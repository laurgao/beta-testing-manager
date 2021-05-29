import mongoose, {Document, Model} from "mongoose";
import {NoteObj} from "../utils/types";

const NoteSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    date: {type: Date, required: true},
    selections: [mongoose.Schema.Types.ObjectId],
    texts: [mongoose.Schema.Types.ObjectId],
}, {
    timestamps: true,
});

export const NoteModel: Model<Document<NoteObj>> = mongoose.models.note || mongoose.model("note", NoteSchema);