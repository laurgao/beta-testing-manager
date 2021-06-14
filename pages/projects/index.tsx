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
import ProjectModal from "../../components/ProjectModal";

const projects = () => {
    const {data: projects, error: projectsError}: SWRResponse<{data: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);

    const toggleAddProject = (e) => {
        if (!addProjectOpen) {
            setAddProjectOpen(true);
            e.preventDefault();
            waitForEl("project-name-field");
        }
    }
    useKey("KeyN", toggleAddProject);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <ProjectModal 
                isOpen={addProjectOpen} 
                setIsOpen={setAddProjectOpen}
                iter={iter}
                setIter={setIter}
            />

            <div className="flex items-center mb-12">
                <H1 text="All Projects" />
                <PrimaryButton 
                    onClick={toggleAddProject} 
                    className="ml-auto"
                ><FaPlus className="-mt-0.5"/><span className="ml-2">New project (n)</span></PrimaryButton>
            </div>
            <div className="md:flex -mx-3 flex-wrap gap-4">
                {(projects && projects.data) ? projects.data[0] ? (
                    projects.data.map((project : DatedObj<ProjectObj>) => (
                        <div key={project._id}>
                            <ProjectCard 
                                projectName={project.name} 
                                projectId={project._id} 
                                userCount={project.userArr && project.userArr.length}
                                latestUpdate={project.latestUpdate}
                            />
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