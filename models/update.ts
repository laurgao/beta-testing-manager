import mongoose, {Document, Model} from "mongoose";
import {UpdateObj} from "../utils/types";

interface UpdateDoc extends UpdateObj, Document {}

const UpdateSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    date: {type: Date, required: true}, // gunna be like updately where you can change the date from the createdat
    selections: { type: [mongoose.Schema.Types.ObjectId], required: false }, 
    texts: { type: [mongoose.Schema.Types.ObjectId], required: false }, 
}, {
    timestamps: true,
});

export const UpdateModel: Model<UpdateDoc> = mongoose.models.update || mongoose.model<UpdateDoc>("update", UpdateSchema);