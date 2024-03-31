"use server"
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

const listAllObjects = async ({continueToken}: ListAllObjectsResponse) => {
    const command = new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET, MaxKeys:8, ContinuationToken: continueToken});
    const response = await client.send(command);
    if(response.Contents){
        const imageUrls = response.Contents.map((object) => {
            const encodedKey = encodeURIComponent(object.Key || '');
            const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${encodedKey}`;
            return imageUrl;
        });
        return {imageUrls, continueToken: response.NextContinuationToken}
    }
    return {imageUrls: [], continueToken: response.NextContinuationToken}
}

const putObject = async ({file} :any) => {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: new Date().getTime() + '_' + file.origianlName,
        Body: file.buffer,
        ContentType: file.mimetype
      };
    const command = new PutObjectCommand(params);
    const res = await client.send(command);
    return 'success';
}   

export {
    listAllObjects,
    putObject
}