import mongoose, {Model, Document} from "mongoose";
import {UserObj} from "../utils/types";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    featuredProjects: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true,
});

export const UserModel: Model<Document<UserObj>> = mongoose.models.user || mongoose.model("user", UserSchema);