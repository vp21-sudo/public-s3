import mongoose from "mongoose";


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
    }
}, {
    timestamps: true
});

const imageModel = (mongoose?.models?.imageModel || mongoose.model('imageModel', imageSchema))

export default imageModel