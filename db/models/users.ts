import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    email_verified: {
        type:Boolean,
        default: false,
    },
    email_verified_timestamp: {
        type:Date,
    }
})

const userModel = (mongoose?.models?.userModel || mongoose.model('userModel', schema))

export default userModel