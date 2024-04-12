"use server"
import { createUser, getUserByEmail } from '@/db/queries/users'
import sendEmail from '@/utils/email'
import { verifyEmailTemplate } from '@/utils/email-templates'
import { enctryptData } from '@/utils/encryption'
import { hashPassword } from '@/utils/password-hash'
import { z } from 'zod'

// validation schema
const schema = z.object({
    email: z.string().email("Invalid Email"),
})

const handleResendEmail = async (setState: any, formData: FormData) => {
    try {
        // input validation
        const validatedFields = schema.safeParse({
            email: formData.get('email'),
        })

        // Return early if the form data is invalid
        if (!validatedFields.success) {
            return {
                message: validatedFields.error.flatten().fieldErrors,
                error: true
            }
        }
        // check if email already exits
        const checkUser = await getUserByEmail(validatedFields.data.email)
        if (checkUser) {
            if (!checkUser.email_verified) {
                // send verification email to user
                const verificationLink = `${process.env.BASE_URL}/api/user/verify/${enctryptData(checkUser._id?.toString())}`;
                await sendEmail({ to: checkUser.email, subject: "Verify your email", html: verifyEmailTemplate({ link: verificationLink, userName: checkUser?.username }) })
                return {
                    message: "success",
                    error: false
                }
            }
            return {
                message: {
                    exists: "User already verified, Please login."
                },
                error: true
            }
        }

    } catch (err) {
        console.log(err)

    }
}

export {
    handleResendEmail
}