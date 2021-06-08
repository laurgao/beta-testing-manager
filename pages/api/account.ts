import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {AccountModel} from "../../models/account";
import {AccountObj} from "../../utils/types";

export default async function account(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({req});
    // return res.status(200).json({message: session}); // session is good

    if (!session) {
        return res.status(403).json({message: "You must have an active session to create an account."});
    }

    try {
        await dbConnect();
        // return res.status(200).json({message: "made it past dbconnect"});

        // made it here with updately mongodb

        // const update: Update = await updateModel.findOne();

        // return res.status(200).json({message: update.title}); // works

        

        const emailUser = await AccountModel.findOne({ "email": session.user.email });
        if (emailUser) {
            return res.status(200).json({message: "Account already exists."});
        }
        

        const newAccount: AccountObj = {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            trialExpDate: "2021-06-28T18:46:41.984Z" // this is a random date change later. today + x days
        };        

        await AccountModel.create(newAccount); 

        res.status(200).json({message: "Account successfully created."});

        return;
    } catch (e) {
        return res.status(500).json({message: e}); 
    }
}