import mongoose, {Document, Model} from "mongoose";
import {SelectionTemplateObj} from "../utils/types";

const SelectionTemplateSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    question: {type: String, required: true},
    options: [{type: String, required: true}],
    required: {type: Boolean, required: true},
}, {
    timestamps: true,
});

export const SelectionTemplateModel: Model<Document<SelectionTemplateObj>> = mongoose.models.selectionTemplate || mongoose.model("selectionTemplate", SelectionTemplateSchema);
