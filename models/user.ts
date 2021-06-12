import mongoose, {Model, Document} from "mongoose";
import {UserObj} from "../utils/types";

interface UserDoc extends UserObj, Document {}

const UserSchema = new mongoose.Schema({
    email: {type: String, required: false},
    name: {type: String, required: true},
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    tags: {type: [String], required: false }
}, {
    timestamps: true,
});

export const UserModel: Model<UserDoc> = mongoose.models.user || mongoose.model<UserDoc>("user", UserSchema);