import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import SignInButton from "../../components/SignInButton";

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
        return {redirect: {permanent: false, destination: "/projects",}};
    }

    return {props: {}};
};
