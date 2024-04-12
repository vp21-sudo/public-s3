import mongoose from "mongoose";
import userModel from "./users";


const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    size: {
        type: Number,
        required: true
    },
    bucket: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: true
    }
}, {
    timestamps: true
});

const imageModel = (mongoose?.models?.imageModel || mongoose.model('imageModel', imageSchema))

export default imageModel