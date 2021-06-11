import mongoose, {Document, Model} from "mongoose";
import {SelectionObj} from "../utils/types";

const SelectionSchema = new mongoose.Schema({
    noteId: mongoose.Schema.Types.ObjectId,
    templateId: mongoose.Schema.Types.ObjectId,
    selected: {type: String, required: true},
}, {
    timestamps: true,
});

export const SelectionModel: Model<Document<SelectionObj>> = mongoose.models.selection || mongoose.model("selection", SelectionSchema);
