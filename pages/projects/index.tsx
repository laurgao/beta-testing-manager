import { GetServerSideProps } from "next";
// import { getSession } from "next-auth/client";
import { getSession } from "next-auth/client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import useSWR, { SWRResponse } from "swr";
import H1 from "../../components/H1";
import PrimaryButton from "../../components/PrimaryButton";
import ProjectCard from "../../components/ProjectCard";
import ProjectModal from "../../components/ProjectModal";
import UpSEO from "../../components/up-seo";
import { DatedObj, ProjectObj } from "../../utils/types";
import { fetcher, useKey, waitForEl } from "../../utils/utils";

const projects = () => {
    const [iter, setIter] = useState<number>(0);
    const { data: projects, error: projectsError }: SWRResponse<{ data: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project?iter=${iter}`, fetcher);
    const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);

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
            <UpSEO title="Projects" />
            <ProjectModal
                isOpen={addProjectOpen}
                setIsOpen={setAddProjectOpen}
                iter={iter}
                setIter={setIter}
            />

            <div className="flex items-center mb-12">
                <H1 text="All Projects" className="leading-none" />
                <PrimaryButton
                    onClick={toggleAddProject}
                    className="ml-auto"
                ><FaPlus /><span className="ml-2 mt-0.5">New project (n)</span></PrimaryButton>
            </div>
            {(projects && projects.data) ? projects.data[0] ? (
                <div className="md:flex -mx-3 flex-wrap gap-4">
                    {projects.data.map((project: DatedObj<ProjectObj>) => (
                        <ProjectCard
                            project={project}
                            userCount={project.userArr && project.userArr.length}
                            iter={iter}
                            setIter={iter}
                            key={project._id}
                        />
                    ))}
                </div>
            ) : (
                <p>You have no projects. Create a new project today!</p>
            ) : (<div className="w-full"><Skeleton height={208} /></div>)}
        </div >
    )
}

export default projects

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    console.log(session)
    if (!session) return { redirect: { permanent: false, destination: "/auth/sign-in" } };
    console.log('here')

    return { props: {} };
};