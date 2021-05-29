import mongoose, {Document, Model} from "mongoose";
import {TextTemplateObj} from "../utils/types";

const TextTemplateSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    question: {type: String, required: true},
    required: {type: Boolean, required: true},
}, {
    timestamps: true,
});

export const TextTemplateModel: Model<Document<TextTemplateObj>> = mongoose.models.textTemplate || mongoose.model("textTemplate", TextTemplateSchema);
