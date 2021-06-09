import mongoose, {Document, Model} from "mongoose";
import {NoteObj} from "../utils/types";

const NoteSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    name: {type: String, required: true},
    date: {type: Date, required: true},
    selections: {type: [mongoose.Schema.Types.ObjectId], required: true},
    texts: {type: [mongoose.Schema.Types.ObjectId], required: true},
}, {
    timestamps: true,
});

export const NoteModel: Model<Document<NoteObj>> = mongoose.models.note || mongoose.model("note", NoteSchema);