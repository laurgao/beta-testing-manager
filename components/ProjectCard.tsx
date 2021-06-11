import Link from "next/link";

const ProjectCard = ({projectName, projectId, userCount}) => {
    return (
        <div className="border up-border-gray-200 p-4 h-52 w-72 shadow-md hover:shadow-xl hover:up-border-gray-700 transition">
            <div className="h-32">
                <Link href={`/projects/${projectId}`}>
                    <a>
                        <h3 className="font-medium my-2 content">{projectName}</h3>
                    </a>
                </Link>
                <p className="up-gray-400">{userCount} Users</p>
            </div>
            <div className="mt-6 text-sm">
                <p className="up-gray-500">
                    
                </p>
            </div>
        </div>
    )
}

export default ProjectCard
