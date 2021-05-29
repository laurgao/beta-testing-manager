import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {AccountModel} from "../../models/account";
import {AccountObj} from "../../utils/types";
import axios from "axios";

export default async function account(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({req});

    if (!session) {
        return res.status(403).json({message: "You must have an active session to create an account."});
    }

    try {
        await dbConnect();

        const emailUser = await AccountModel.findOne({ "email": session.user.email });
        if (emailUser) {
            return res.status(200).json({message: "Account already exists."});
        }
        
        const newAccount: AccountObj = {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            trialExpDate: "" // today + x days
        };

        await AccountModel.create(newAccount);

        res.status(200).json({message: "Account successfully created."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}