import mongoose, {Model, Document} from "mongoose";
import {AccountObj} from "../utils/types";

const AccountSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
    trialExpDate: {type: String, required: true},
}, {
    timestamps: true,
})

export const AccountModel: Model<Document<AccountObj>> = mongoose.models.account || mongoose.model("account", AccountSchema);