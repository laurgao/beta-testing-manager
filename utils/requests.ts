import { AccountModel } from "../models/account";
import dbConnect from "./dbConnect";

export async function getCurrUserRequest(email: string) {
    await dbConnect();
    return AccountModel.findOne({ email: email });
}