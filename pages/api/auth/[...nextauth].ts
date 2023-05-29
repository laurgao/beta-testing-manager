// import NextAuth from "next-auth";
// // import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET
//         }),
//     ]
// };

// // export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);



// // export const authOptions = {
// //   // Configure one or more authentication providers
// //   providers: [
// //     GithubProvider({
// //       clientId: process.env.GITHUB_ID,
// //       clientSecret: process.env.GITHUB_SECRET,
// //     }),
// //     // ...add more providers here
// //   ],
// // }
// export default NextAuth(authOptions)

import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ]
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);