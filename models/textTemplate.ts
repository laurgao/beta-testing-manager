import mongoose, {Document, Model} from "mongoose";
import {TextTemplateObj} from "../utils/types";

interface TextTemplateDoc extends TextTemplateObj, Document {}

const TextTemplateSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    question: {type: String, required: true},
    required: {type: Boolean, required: true},
}, {
    timestamps: true,
});

export const TextTemplateModel: Model<TextTemplateDoc> = mongoose.models.textTemplate || mongoose.model<TextTemplateDoc>("textTemplate", TextTemplateSchema);
