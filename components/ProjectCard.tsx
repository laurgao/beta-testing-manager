import { formatDistance } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { DatedObj, ProjectObj, UpdateObj } from "../utils/types";
import DeleteModal from "./DeleteModal";
import MoreMenu from "./MoreMenu";
import MoreMenuItem from "./MoreMenuItem";
import ProjectModal from "./ProjectModal";

const ProjectCard = ({project, userCount, iter, setIter}: {
    project: DatedObj<ProjectObj>,
    userCount: number,
    iter: number,
    setIter: any,
}) => {
    const [editProjectOpen, setEditProjectOpen] = useState<boolean>(false);
    const [deleteProjectOpen, setDeleteProjectOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col border btm-gray-200-border p-4 h-52 w-108 hover:shadow-md hover:btm-gray-700-border transition">
            <ProjectModal 
                isOpen={editProjectOpen} 
                setIsOpen={setEditProjectOpen} 
                iter={iter}
                setIter={setIter}
                project={project}
            />

            <DeleteModal 
                item={project}
                itemType="project"
                isOpen={deleteProjectOpen}
                setIsOpen={setDeleteProjectOpen}
                iter={iter}
                setIter={setIter}
            />
            
            <div className="flex flex-row">
                <Link href={`/projects/${project._id}`}>
                    <a>
                        <h3 className="btm-text-gray-700 text-2xl font-semibold my-2 content">{project.name}</h3>
                    </a>
                </Link>
                <div className="ml-auto">
                    <MoreMenu>
                        <MoreMenuItem text="Edit" icon={<FiEdit2 />} onClick={() => setEditProjectOpen(true)}/>
                        <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setDeleteProjectOpen(true)}/>
                    </MoreMenu>
                </div>
            </div>
            {project.latestUpdate && <p className="btm-text-gray-400">Last activity {formatDistance(
                new Date(project.latestUpdate.date),
                new Date(),
                {
                    addSuffix: true,
                })}</p>}
            <div className="btm-text-gray-400 flex flex-row mt-auto"><FaUser /><span className="ml-2 -mt-0.5">{userCount}</span></div>
        </div>
    )
}

export default ProjectCard
