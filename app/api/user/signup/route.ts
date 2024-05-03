import { NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from '@/db/queries/users'
import { hashPassword } from '@/utils/password-hash'
import { z } from 'zod'
import { enctryptData } from '@/utils/encryption'
import sendEmail from "@/utils/email"
import { verifyEmailTemplate } from "@/utils/email-templates"

// validation schema
const schema = z.object({
    username: z.string().min(4, "username should contain atleast four characters"),
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
        const checkUser = await getUserByEmail(validatedFields.data.email)
        if (checkUser) {
            if(!checkUser.email_verified){
                return NextResponse.json({
                    message:"Please verify your email to login."
                }, {status: 409})
            }
            return NextResponse.json({
                message: "Email already exists, Please login.",
            }, { status: 409 })
        }
        // create a user record and initiate verification email
        const user = await createUser({
            username: validatedFields.data.username,
            email: validatedFields.data.email,
            password: await hashPassword(validatedFields.data.password)
        })
        // send verification email to user
        const verificationLink = `${process.env.BASE_URL}/api/user/verify/${enctryptData(user._id?.toString())}`;
        await sendEmail({ to: user.email, subject: "Verify your email", html: verifyEmailTemplate({link: verificationLink, userName: user?.username}) })
        return NextResponse.json({
            message: "success",
        }, {status:200})
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Invalid Request" }, { status: 400 })
    }
}

export { POST }