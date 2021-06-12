import mongoose, {Document, Model} from "mongoose";
import {SelectionObj} from "../utils/types";

interface SelectionDoc extends SelectionObj, Document {}

const SelectionSchema = new mongoose.Schema({
    noteId: mongoose.Schema.Types.ObjectId,
    templateId: mongoose.Schema.Types.ObjectId,
    selected: {type: String, required: true},
}, {
    timestamps: true,
});

export const SelectionModel: Model<SelectionDoc> = mongoose.models.selection || mongoose.model<SelectionDoc>("selection", SelectionSchema);
