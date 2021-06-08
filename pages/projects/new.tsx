import React, {useState} from 'react';
import Link from "next/link";
import {FiArrowLeft} from "react-icons/fi";
import {useSession} from "next-auth/client";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import {useRouter} from "next/router";
import BackToProjects from "../../components/BackToProjects";
import SpinnerButton from "../../components/spinner-button";
import UpSEO from "../../components/up-seo";
import useSWR, { SWRResponse } from 'swr';
import { fetcher } from '../../utils/utils';

export default function NewProject() {
    const router = useRouter();
    const [session, loading] = useSession();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/project", {
            name: name,
            description: description
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                // @ts-ignore
                /* window.analytics.track("Item created", {
                    type: "project",
                    projectId: res.data.id,
                }); */
                router.push("/projects"); // project page
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="New project"/>
            <BackToProjects/>
            <hr className="my-8"/>
            <h1 className="up-h1">New project</h1>
            <div className="my-12">
                <h3 className="up-ui-title">Name</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Beta Testing Manager"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="my-12">
                <h3 className="up-ui-title">Description</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="A better way to keep track of beta users"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <SpinnerButton
                onClick={onSubmit}
                isLoading={isLoading}
                isDisabled={!name}
            >
                Create
            </SpinnerButton>
        </div>
    );
}