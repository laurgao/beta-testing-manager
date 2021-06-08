import {signIn, useSession, getSession} from "next-auth/client"
import {GetServerSideProps} from "next";
import SignInButton from "../../components/signInButton";

const SignIn = () => {
    const [session, loading] = useSession();
    
    return (
        <div>
            <SignInButton />
        </div>
    )
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        console.log(session);
        context.res.setHeader("location", "/auth/new-account");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};
