"use server"

import mongoose from "mongoose";

const dbConnection = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_DB_URL || '', {
            minPoolSize: 4,
        });
        return conn
    } catch(err){
        console.log(err)
    }
}

export default dbConnection