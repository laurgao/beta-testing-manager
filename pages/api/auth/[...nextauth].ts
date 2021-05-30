import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";

const options = {
    providers: [
        Providers.Google({ // providers is null error is solved by wrapping _app.tsx in <Provider> tag
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ]    
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
