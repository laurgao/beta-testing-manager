import mongoose, {Document, Model} from "mongoose";
import {SelectionTemplateObj} from "../utils/types";

interface SelectionTemplateDoc extends SelectionTemplateObj, Document {}

const SelectionTemplateSchema = new mongoose.Schema({
    projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
    question: {type: String, required: true},
    options: [{type: String, required: true}],
    required: {type: Boolean, required: true},
}, {
    timestamps: true,
});

export const SelectionTemplateModel: Model<SelectionTemplateDoc> = mongoose.models.selectionTemplate || mongoose.model<SelectionTemplateDoc>("selectionTemplate", SelectionTemplateSchema);
