import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import H1 from "../../components/H1";
import SignInButton from "../../components/SignInButton";
import { AccountModel } from "../../models/account";
import dbConnect from "../../utils/dbConnect";

const SignIn = () => {
    return (
        <div className="max-w-2xl mx-auto px-4">
            <H1 className="mb-4">Get started</H1>
            <p className="btm-text-gray-700 mb-8">Sign in or create an account with Google</p>
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
