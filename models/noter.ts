import mongoose, {Model, Document} from "mongoose";
import {NoterObj} from "../utils/types";

const NoterSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    name: {type: String, required: true},
    date: {type: Date, required: false}, // gunna be like updately where you can change the date from the createdat
    selections: { type: [mongoose.Schema.Types.ObjectId], required: false }, 
    texts: { type: [mongoose.Schema.Types.ObjectId], required: false }, 
}, {
    timestamps: true,
});

export const NoterModel: Model<Document<NoterObj>> = mongoose.models.noter || mongoose.model("noter", NoterSchema);