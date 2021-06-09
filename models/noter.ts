import mongoose, {Model, Document} from "mongoose";
import {NoterObj} from "../utils/types";

const NoterSchema = new mongoose.Schema({
    name: {type: String, required: true},    
    date: {type: Date, required: false},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    theIdoftheUser: { type: mongoose.Schema.Types.ObjectId, required: false },
}, {
    timestamps: true,
});

export const NoterModel: Model<Document<NoterObj>> = mongoose.models.noter || mongoose.model("noter", NoterSchema);