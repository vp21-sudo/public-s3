import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from '@/db/queries/users'
import { comparePassword, hashPassword } from '@/utils/password-hash'
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { enctryptData } from '@/utils/encryption'

// validation schema
const schema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(7, "Password length must be greater than or 8")
})


const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        // input validation
        const validatedFields = schema.safeParse(body)
        // Return early if the form data is invalid
        if (!validatedFields.success) {
            return NextResponse.json({
                message: validatedFields.error.flatten().fieldErrors,
            }, { status: 400 })
        }
        // get the user data from the DB and match the password
        const user = await getUserByEmail(validatedFields.data.email?.toLocaleLowerCase())
        if (!user) {
            return NextResponse.json({
                message: "User not found, Please register.",
            }, { status: 404 })
        }
        // verfify password
        if (!await comparePassword(validatedFields.data.password, user.password)) {
            // incorrect password
            return NextResponse.json({
                message: "Incorrect password",
            }, { status: 401 })
        }
        if (!user.email_verified) {
            return NextResponse.json({
                message: "Please verify email to login.",
            }, { status: 403 })
        }
        // set the user session and send the data to front-end
        const sessionid = "session" + user._id?.toString()
        const encryptedSessionId = enctryptData(sessionid)
        kv.set(sessionid, JSON.stringify({
            userId: user._id?.toString(),
            createdOn: new Date().getTime(),
            lastRequest: new Date().getTime(),
            expiry: 24 * 60 * 60 * 1000
        }))
        return NextResponse.json({
            message: "success",
            sessionId: encryptedSessionId,
            error: false
        }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Invalid Request" }, { status: 400 })
    }
}

export { POST }