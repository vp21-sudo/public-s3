"use server"
import { createUser, getUserByEmail } from '@/db/queries/users'
import sendEmail from '@/utils/email'
import { verifyEmailTemplate } from '@/utils/email-templates'
import { enctryptData } from '@/utils/encryption'
import { hashPassword } from '@/utils/password-hash'
import { error } from 'console'
import { z } from 'zod'

// validation schema
const schema = z.object({
    username: z.string().min(4, "username should contain atleast four characters"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(7, "Password length must be greater than or 8")
})

const handleRegistrationForm = async (setState: any, formData: FormData) => {
    try {
        // input validation
        const validatedFields = schema.safeParse({
            username: formData.get('username'),
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
        // check if email already exits
        const checkUser = await getUserByEmail(validatedFields.data.email)
        if(checkUser){
            if(!checkUser.email_verified){
                return {
                    message: {
                        verify: "Please verify your email to login."
                    },
                    error: true
                }
            }
            return {
                message: {
                    exists: "User already exits, Please login."
                },
                error: true
            }
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
        return {
            message: "success",
            error: false
        }
    } catch (err) {
        console.log(err)

    }
}

export {
    handleRegistrationForm
}