import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";
import {AccountModel} from "../../../models/account";
import {AccountObj} from "../../../utils/types";
import dbConnect from "../../../utils/dbConnect";

const options = {
    providers: [
        Providers.Google({ // providers is null error is solved by wrapping _app.tsx in <Provider> tag
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],

    callbacks: {
        signIn: async (user, account, profile) => {
            await dbConnect();

            const foundItem = await AccountModel.findOne({ "email": user.email });
            if (foundItem) {
                return true;
            }

            const newAccount: AccountObj = {
                email: user.email,
                name: user.name,
                image: user.image,
                trialExpDate: "" // today + x days
            };
    
            await AccountModel.create(newAccount);
    
            return true;
        }
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
