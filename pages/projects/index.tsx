import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import PrimaryButton from "../../components/PrimaryButton";
import useSWR, {SWRResponse} from "swr";
import { DatedObj, ProjectObj } from "../../utils/types";
import ProjectCard from "../../components/ProjectCard";
import React, { useState } from "react";
import UpSEO from "../../components/up-seo";
import H1 from "../../components/H1";
import Skeleton from "react-loading-skeleton";
import { fetcher, waitForEl, useKey } from '../../utils/utils'
import UpModal from "../../components/UpModal";
import { useRouter } from "next/router";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const projects = () => {
    const router = useRouter();
    const [session, loading] = useSession();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {data: projects, error: projectsError}: SWRResponse<{data: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);

    const toggleAddProject = (e) => {
        if (!addProjectOpen) {
            setAddProjectOpen(true);
            e.preventDefault();
            waitForEl("project-name-field");
        }
    }
    useKey("KeyN", toggleAddProject);

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
                router.push(`/projects/${res.data.id[0]}`); // project page
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>

            {addProjectOpen && (
                <UpModal isOpen={addProjectOpen} setIsOpen={setAddProjectOpen} wide={true}>
                    <H1 text="New user"/>
                    <div className="my-12">
                        <h3 className="up-ui-title">Name</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="Beta Testing Manager"
                            value={name}
                            id="project-name-field"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="my-12">
                        <h3 className="up-ui-title">Description</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="The all in one tool for effortlessly keeping track of beta testers"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <PrimaryButton
                        onClick={onSubmit}
                        isLoading={isLoading}
                        isDisabled={!name}
                    >
                        Create
                    </PrimaryButton>
                </UpModal>
            )}

            <div className="flex items-center mb-12">
                <H1 text="All Projects" />
                <PrimaryButton 
                    onClick={toggleAddProject} 
                    className="ml-auto"
                ><FaPlus/><span className="ml-2">New project (n)</span></PrimaryButton>
            </div>
            <div className="md:flex -mx-3 flex-wrap gap-3">
                {(projects && projects.data) ? projects.data.length ? (
                    projects.data.map((project : DatedObj<ProjectObj>) => (
                        <div key={project._id}>
                            <ProjectCard projectName={project.name} projectId={project._id} userCount={project.userArr && project.userArr.length}/>
                        </div>
                    ))
                ) : (
                    <p>You have no projects. Create a new project today!</p> 
                ) : <Skeleton count={2}/>}
            </div>
            
        </div>
    )
}

export default projects

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return {redirect: {permanent: false, destination: "/auth/sign-in"}};
    
    return { props: {} };
  };