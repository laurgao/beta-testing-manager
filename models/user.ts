import mongoose, {Model, Document} from "mongoose";
import {UserObj} from "../utils/types";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: false},
    name: {type: String, required: true},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    tags: {type: [String], required: false }
}, {
    timestamps: true,
});

export const UserModel: Model<Document<UserObj>> = mongoose.models.user || mongoose.model("user", UserSchema);