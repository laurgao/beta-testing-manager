import React, {useState} from "react";
import {GetServerSideProps} from "next";
import {getSession, signIn, useSession} from "next-auth/client";
import axios from "axios";
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import SpinnerButton from "../../components/spinner-button";
import UpSEO from "../../components/up-seo";
import { getCurrUserRequest } from "../../utils/requests"

export default function NewAccount() {
    const router = useRouter();
    const [session, loading] = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    console.log(session);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/account").then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                console.log(res.data.message)
                console.log("redirecting...");
                // signIn("google").then(() => router.push("/")).catch(e => console.log(e)); // look @ next router documentation
                // the sigin call again is to get the user id registered into the session variable.
                router.push("/").catch(e => console.log(e));
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred."); // erroring out here
            console.log(e.response.data);
        });
    }

    return (
        <div className="max-w-sm mx-auto px-4">
            <UpSEO title="New account"/>
            <h1 className="up-h1">Welcome to Beta Testing Manager</h1>
            <hr className="my-8"/>
            <p className="up-ui-title">Creating new account as:</p>
            {loading ? (
                <div className="my-4">
                    <Skeleton count={2}/>
                </div>
            ) : (
                <div className="flex items-center my-4">
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="rounded-full h-12 h-12 mr-4"
                    />
                    <div>
                        <p className="up-ui-title">{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                </div>
            )}
           
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <hr className="my-8"/>
            <SpinnerButton
                onClick={onSubmit}
                isLoading={isLoading}
                isDisabled={loading}
            >
                Let's get started!
            </SpinnerButton>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = await getCurrUserRequest(session.user.email);

    if (!session || user) {
        context.res.setHeader("location", !session ? "/auth/sign-in" : "/");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};