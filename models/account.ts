import mongoose, {Model, Document} from "mongoose";
import {AccountObj} from "../utils/types";

interface AccountDoc extends AccountObj, Document {}

const AccountSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
    trialExpDate: {type: String, required: true},
}, {
    timestamps: true,
})

export const AccountModel: Model<AccountObj> = mongoose.models.account || mongoose.model<AccountDoc>("account", AccountSchema);