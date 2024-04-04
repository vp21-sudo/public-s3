"use server"
import dbConnection from "@/db/connect";
import imageModel from "@/db/models/images";
import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: process.env.S3_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

interface ListAllObjectsResponse {
    continueToken?: string
}

// old logic that directly requests aws s3, but list requests cost is higher, hence moved to store image data in a mongoDB cluster.
const listAllObjects = async ({ continueToken }: ListAllObjectsResponse) => {
    const command = new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET, MaxKeys: 100, ContinuationToken: continueToken });
    const response = await client.send(command);
    if (response.Contents) {
        const imageUrls = response.Contents.map((object) => {
            const encodedKey = encodeURIComponent(object.Key || '');
            const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${encodedKey}`;
            return imageUrl;
        });

        // add all responses to mongodb
        await dbConnection()
        const imageData = response.Contents.map((object) => {
            return new imageModel({
                name: object.Key,
                url: object.Key,
                size: object.Size,
                bucket: process.env.S3_BUCKET
            })
        })
        await imageModel.insertMany(imageData)


        return { imageUrls, continueToken: response.NextContinuationToken }
    }
    return { imageUrls: [], continueToken: response.NextContinuationToken }
}

const putObject = async ({ file }: any) => {
    try {
        const timeStamp = new Date().getTime();
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: timeStamp + '_' + file.origianlName,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        const command = new PutObjectCommand(params);
        const res = await client.send(command);
        // also add the record to mongoDB
        const imageData = new imageModel({
            name: file.origianlName,
            url: timeStamp + '_' + file.origianlName,
            size: file.size,
            bucket: process.env.S3_BUCKET
        })
        await imageData.save();
        return 'success';

    } catch (err) {
        console.log(err)
    }
}

export {
    listAllObjects,
    putObject
}