import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import PrimaryButton from "../../components/PrimaryButton";
import useSWR, {SWRResponse} from "swr";
import {fetcher} from "../../utils/utils";
import { ProjectObj } from "../../utils/types";
import ProjectCard from "../../components/ProjectCard";
import Link from "next/link";
import React from "react";
import UpSEO from "../../components/up-seo";
import H1 from "../../components/H1";
import Skeleton from "react-loading-skeleton";

const projects = () => {
    const [session, loading] = useSession();
    
    const {data: projects, error: projectsError}: SWRResponse<{data: ProjectObj[] }, any> = useSWR(`/api/project`, fetcher);

    const handleNewProject = (e) => {
        // axios post input sth
        // showmodal = true
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="flex items-center mb-12">
                <H1 text="All Projects" />
                <PrimaryButton href="/projects/new" className="ml-auto">New project</PrimaryButton>
            </div>
            <div className="md:flex -mx-3 flex-wrap gap-3">
                {/* display prjs*/ (projects && projects.data) ? projects.data.length ? (
                    projects.data.map((project : ProjectObj) => (
                        <div key={project._id}>
                            <ProjectCard projectName={project.name} projectId={project._id} userCount={project.userArr && project.userArr.length}/>
                        </div>
                    ))
                ) : (
                    <p>You have no projects. Create a new project today!</p> ) : <Skeleton/>
                }
            </div>
            
        </div>
    )
}

export default projects

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
  
    if (!session) {
        context.res.setHeader("location", "/");
        context.res.statusCode = 302;
        context.res.end();
    }

    return { props: {} };
  };