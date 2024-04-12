"use server"
import { getUserByEmail } from '@/db/queries/users'
import { comparePassword, hashPassword } from '@/utils/password-hash'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { enctryptData } from '@/utils/encryption'

// validation schema
const schema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(7, "Password length must be greater than or 8")
})

const handleLoginForm = async (setState: any, formData: FormData) => {
  try {
    // input validation
    const validatedFields = schema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        message: validatedFields.error.flatten().fieldErrors,
        error: true
      }
    }
    // get the user data from the DB and match the password
    const user = await getUserByEmail(validatedFields.data.email)
    if (!user) {
      return {
        message: "User not found, Please register.",
        error: true
      }
    }
    // verfify password
    if (!await comparePassword(validatedFields.data.password, user.password)) {
      // incorrect password
      return {
        message: "Incorrect password",
        error: true
      }
    }
    if (!user.email_verified) {
      return {
        message: "Please verify email to login.",
        error: true
      }
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
    cookies().set("session", encryptedSessionId, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
    return {
      message: "success",
      error: false
    }
  } catch (err) {
    console.log(err)

  }
}

export {
  handleLoginForm
}