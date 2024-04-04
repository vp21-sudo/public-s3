"use server"

import { putObject } from "@/s3/s3-functions"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from 'next/navigation'


const uploadImageAction = async (formData: FormData) => {
    try{
    const file = formData.get('file') as File
    if(file.size <= 0 ) {
        throw new Error('invalid request')
    }
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        // Upload image to S3
        const resposne = await putObject({file: {
            origianlName: file.name,
            buffer: fileBuffer,
            mimetype: file.type,
            size: file.size,
        } })
        await revalidatePath('/')
        return redirect('/')
    } catch (error) {
        if(isRedirectError(error)) {
            throw error
        }
        return 'invalid request'
    }
}   


export {
    uploadImageAction
}