"use server"

import { putObject } from "@/s3/s3-functions"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from 'next/navigation'
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from '@vercel/kv'
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '3600 s'),
});

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const uploadImageAction = async (setState: any, formData: FormData) => {
    try {

        const file = formData.get('file') as File
        if (file.size <= 0) {
            return {message:"Please add an image", error: true}
        }

        //file type validation - only images allowed
        if(!allowedImageTypes.includes(file.type)){
            return {message:"Invalid file type, Please add an image", error: true}
        }
        // to add rate limiter
        // get client IP
        const headersList = headers()
        const headerField = headersList.get('x-forwarded-for') || ''
        const clientIp = headerField.split(/, /)[0]
        // get cacahed data
        const { success } = await ratelimit.limit(
            "upload"+clientIp
        );
        // verify request
        if (!success) return {message:"Too many requests, please try again later", error: true}
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        // Upload image to S3
        const resposne = await putObject({
            file: {
                origianlName: file.name,
                buffer: fileBuffer,
                mimetype: file.type,
                size: file.size,
            }
        })
        revalidatePath('/')
        return redirect('/?upload=success')
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        console.log(error)
        return 'Invalid Request'
    }
}


export {
    uploadImageAction
}