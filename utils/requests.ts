import { AccountModel } from "../models/account";
import { ProjectModel } from "../models/project";
import { UserModel } from "../models/user";
import dbConnect from "./dbConnect";

export async function getCurrUserRequest(email: string) {
    await dbConnect();
    return AccountModel.findOne({ email: email });
}

export async function getProjectRequest(projectId: string) {    
    await dbConnect();
    return ProjectModel.findOne({ _id: projectId });
}

export async function getUserRequest(userId: string) {    
    await dbConnect();
    return UserModel.findOne({ _id: userId });
}