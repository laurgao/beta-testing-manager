import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import SignInButton from "../../components/SignInButton";
import { AccountModel } from "../../models/account";
import dbConnect from "../../utils/dbConnect";

const SignIn = () => {
    return (
        <div>
            <SignInButton />
        </div>
    )
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    await dbConnect();
    const user = await AccountModel.findOne({ email: session?.user.email });

    if (user) {
        return { redirect: { permanent: false, destination: "/projects", } };
    } else if (session) {
        return { redirect: { permanent: false, destination: "/auth/new-account", } };
    }

    return { props: {} };
};
