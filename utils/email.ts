import nodemailer from "nodemailer"

interface nodemailerInput {
    to: string
    subject: string
    text?: string
    html?   : string
    attachments?: any
}

const sendEmail = async ({ to, subject, text, html, attachments }: nodemailerInput) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSORD
            }
        })
        await transporter.sendMail({
            from: `do-not-reply<${process.env.MAIL_FROM}>`,
            to,
            subject,
            text,
            html,
            attachments
        })
    } catch(err){
        throw err
    }
}

export default sendEmail