"use server"
import dbConnection from "../connect";
import imageModel from "../models/images";


// function to list images with pagination
const listImages = async ({ page }: { page: number}) => {
    try {
        await dbConnection()
        const pageSize = 8
        const skip =  (page - 1) * pageSize
        const limit = pageSize

        const totalCount = await imageModel.countDocuments({
            bucket: process.env.S3_BUCKET
        })
        const images = await imageModel.find({
            bucket: process.env.S3_BUCKET
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        const updatedImages = images.map((object) => {
            const encodedKey = encodeURIComponent(object.url || '');
            const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${encodedKey}`;
            return{
                name: object.name,
                url: imageUrl,
                size: object.size,
            }
        })
        return {
            total_pages: Math.ceil(totalCount / pageSize),
            page: page,
            pageSize: pageSize,
            updatedImages
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    listImages
}