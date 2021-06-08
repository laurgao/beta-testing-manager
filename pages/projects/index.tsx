import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import PrimaryButton from "../../components/PrimaryButton";
import useSWR, {SWRResponse} from "swr";
import {fetcher} from "../../utils/utils";
import { ProjectObj } from "../../utils/types";
import ProjectCard from "../../components/ProjectCard";
import Link from "next/link";

const projects = () => {
    const [session, loading] = useSession();
    
    const {data: projects, error: projectsError}: SWRResponse<{projects: ProjectObj[] }, any> = useSWR(`/api/project`, fetcher);
    console.log(projects && projects.data)

    const handleNewProject = (e) => {
        // axios post input sth
        // href new project page
    }

    return (
        <div>
            <div className="flex">
                <h1>All projects</h1>
                <Link href="/projects/new"><a><PrimaryButton text="New project" onClick={handleNewProject}/></a></Link>
            </div>
            {/* display prjs*/ projects && projects.data ? (
                projects.data.map((project : ProjectObj) => (
                    <div>
                        <ProjectCard projectName={project.name} projectId={project._id}/>
                    </div>
                ))
            ) : (
                <p>You have no projects. Create a new project today!</p>
            )}
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