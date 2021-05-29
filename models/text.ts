import mongoose, {Document, Model} from "mongoose";
import {TextObj} from "../utils/types";

const TextSchema = new mongoose.Schema({
    noteId: mongoose.Schema.Types.ObjectId,
    templateId: mongoose.Schema.Types.ObjectId,
    body: {type: String, required: true},
}, {
    timestamps: true,
});

export const TextModel: Model<Document<TextObj>> = mongoose.models.text || mongoose.model("text", TextSchema);
