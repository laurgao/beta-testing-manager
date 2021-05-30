import {signIn, signOut, useSession, getSession} from "next-auth/client"
import {GetServerSideProps} from "next";


const SignIn = () => {
    const [session, loading] = useSession();
    
    return (
        <div>

            <main>
                
                {!session && (
                <>
                    Not signed in <br />
                    <button onClick={() => signIn('google')}>Sign in</button>
                </>
                )}

                {
                session && ( 
                    <>
                    Signed in as {session.user.email} <br />
                    <div>You can now access our super secret pages</div>
                    <button onClick={() => signOut()}>Sign out</button>
                    </>
                )
                }

            </main>

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
