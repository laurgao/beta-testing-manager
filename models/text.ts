import mongoose, {Document, Model} from "mongoose";
import {TextObj} from "../utils/types";

interface TextDoc extends TextObj, Document {}

const TextSchema = new mongoose.Schema({
    noteId: mongoose.Schema.Types.ObjectId,
    templateId: mongoose.Schema.Types.ObjectId,
    body: {type: String, required: false}, // If template says it's not required
}, {
    timestamps: true,
});

export const TextModel: Model<TextDoc> = mongoose.models.text || mongoose.model<TextDoc>("text", TextSchema);
