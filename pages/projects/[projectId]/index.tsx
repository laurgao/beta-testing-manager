import { formatDistance } from "date-fns"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { FiEdit2, FiTrash } from "react-icons/fi"
import Skeleton from "react-loading-skeleton"
import useSWR, { SWRResponse } from "swr"
import Badge from "../../../components/Badge"
import DeleteModal from "../../../components/DeleteModal"
import H1 from "../../../components/H1"
import InlineButton from "../../../components/InlineButton"
import MoreMenu from "../../../components/MoreMenu"
import MoreMenuItem from "../../../components/MoreMenuItem"
import PrimaryButton from "../../../components/PrimaryButton"
import ProjectModal from "../../../components/ProjectModal"
import SecondaryButton from "../../../components/SecondaryButton"
import Table from "../../../components/Table"
import TableItem from "../../../components/TableItem"
import Tabs from "../../../components/Tabs"
import UpSEO from "../../../components/up-seo"
import UpdateModal from "../../../components/UpdateModal"
import UserModal from "../../../components/UserModal"
import { ProjectModel } from "../../../models/project"
import dbConnect from "../../../utils/dbConnect"
import { DatedObj, ProjectObj, SelectionTemplateObj, TextTemplateObj, UpdateObj, UserGraphObj, UserObj } from "../../../utils/types"
import { cleanForJSON, fetcher, useKey, waitForEl } from "../../../utils/utils"

const Project = ( props: { project: DatedObj<ProjectObj> } ) => {
    const [project, setProject] = useState<DatedObj<ProjectObj>>(props.project);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("dashboard");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [iter, setIter] = useState<number>(0);
    const [editProjectOpen, setEditProjectOpen] = useState<boolean>(false);
    const [deleteProjectOpen, setDeleteProjectOpen] = useState<boolean>(false);
    
    const {data: data, error: error}: SWRResponse<DatedObj<UserGraphObj>, any> = useSWR(`/api/user?projectId=${project._id}&iter=${iter}`, fetcher);

    const users: DatedObj<UserObj>[] = data ? data.userData : [];
    const updates: DatedObj<UpdateObj>[] = data ? data.updateData : [];
    const selectionTemplates: DatedObj<SelectionTemplateObj>[] = data ? data.selectionTemplateData : [];
    const textTemplates: DatedObj<TextTemplateObj>[] = data ? data.textTemplateData : [];
    const projectData: DatedObj<ProjectObj> = data ? data.projectData : {name: "", description: "", _id: "", createdAt: "", updatedAt: "", accountId: ""};
    const [projectName, setProjectName] = useState<string>();
    const [description, setDescription] = useState<string>();
    
    useEffect(() => {
        if(projectData) {
            setDescription((projectData.description) || "")
            setProjectName(projectData.name)
        }
    }, [projectData])

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    useEffect(() => {
        setIsModalOpen(addUpdateOpen || addUserOpen ||  deleteProjectOpen || editProjectOpen);
    }, [addUpdateOpen, addUserOpen, deleteProjectOpen, editProjectOpen])

    function toggleAddUser(e) {
        if (!isModalOpen) {
            setAddUserOpen(true);
            e.preventDefault(); // prevents U from being typed in the case of a keyboard shortcut
            waitForEl("user-name-field");
        }
    }
    function toggleAddUpdate(e) {
        if (!isModalOpen) {
            setAddUpdateOpen(true);
            e.preventDefault();
            waitForEl("update-name-field");
        }
    }
    
    useKey("KeyN", toggleAddUpdate);
    useKey("KeyU", toggleAddUser);

    const toggleEditProject = (e) => {
        console.log(editProjectOpen)
        if (!isModalOpen) {
            setEditProjectOpen(true);
            e.preventDefault();
            waitForEl("project-name-field");
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title={projectName || (project && project.name && project.name)}/>

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

            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
            </div>
            <div className="flex items-center mb-9">
                <H1 text={projectName || project.name} />
                <div className="ml-auto flex flex-row gap-3">
                    <SecondaryButton onClick={toggleAddUser}><FaPlus className="-mt-0.5"/><span className="ml-2">New User (u)</span></SecondaryButton>
                    <PrimaryButton onClick={toggleAddUpdate}><FaPlus className="-mt-0.5"/><span className="ml-2">New Update (n)</span></PrimaryButton>
                    <MoreMenu>
                        <MoreMenuItem text="Edit" icon={<FiEdit2 />} onClick={() => setEditProjectOpen(true)}/>
                        <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setDeleteProjectOpen(true)}/>
                    </MoreMenu>
                </div>                
            </div>

            <div className="mb-12">
                <Tabs state={tab} setState={setTab} displayedTabs={["Dashboard", "Users", "Updates"]}/>
            </div>

            {addUserOpen && (
                <UserModal 
                    isOpen={addUserOpen}
                    setIsOpen={setAddUserOpen}
                    iter={iter}
                    setIter={setIter}
                    projectId={project._id}
                    setTab={setTab}
                />
            )}

            {addUpdateOpen && (
                <UpdateModal 
                    isOpen={addUpdateOpen}
                    setIsOpen={setAddUpdateOpen}
                    userId={updateUserId}
                    setUserId={setUpdateUserId}
                    selectionTemplates={selectionTemplates}
                    textTemplates={textTemplates}
                    users={users}
                    iter={iter}
                    setIter={setIter}
                />
            )}      

            {tab == "dashboard" && (
                <div>
                    <p>{description || (project && project.description && project.description)}</p>
                </div>
            )}

            {tab == "users" && (
                // get all users assoc with this project id
                // map into a table
                (data && users) ? (<Table 
                    gtc={`1fr 6rem 6rem 6rem ${"6rem ".repeat(selectionTemplates.length || 0)}6rem`}
                    headers={(selectionTemplates && selectionTemplates[0]) ? ["Name", "Last update", "Added", "Tags", ...selectionTemplates.map(s => (s.question)) ,"Total updates"] : ["Name", "Last update", "Added", "Tags", "Total updates"]}
                >
                    {users[0] ? users.map(user => (
                        <>
                            <TableItem 
                                main={true}
                                href={`/projects/${project._id}/${user._id}`} 
                                className="text-xl"
                                truncate={true}
                                wide={true}
                            >{user.name}</TableItem>
                            {(user.updateArr && user.updateArr[0]) ? <TableItem truncate={true}>{formatDistance(
                                new Date(user.updateArr[0].date),
                                new Date(),
                                {
                                    addSuffix: true,
                                },
                            )}</TableItem> : (
                                <p></p>
                            )}
                            <TableItem truncate={true}>{formatDistance(
                                new Date(user.date),
                                new Date(),
                                {
                                    addSuffix: true,
                                },
                            )}</TableItem>
                            <div className="flex items-center">
                                {user.tags && user.tags.map((tag, index) => (
                                    <Badge key={index}>{tag}</Badge >
                                ))}
                            </div>
                            {user.updateArr[0] ? user.updateArr[user.updateArr.length-1] && user.updateArr[user.updateArr.length-1].selectionArr.length && user.updateArr[user.updateArr.length-1].selectionArr.map(s => ( // updates are auto sorted by createdAt earliest -> latest. 
                                <TableItem key={s._id} truncate={true}>{s.selected ? s.selected : "None"}</TableItem>
                                // selectionArr will exist as an empty array if there are no selections.
                            )): (
                                // If use has no updates, have a "none" for every selection template.
                                selectionTemplates && selectionTemplates[0] && selectionTemplates.map((st, index) => (
                                    <p key={st._id}></p>
                                )) 
                            )}
                            <TableItem>{user.updateArr.length.toString()}</TableItem>
                            <hr className={`col-span-${5 + (selectionTemplates.length || 0)} my-2`}/>
                        </>
                    )) : <TableItem main={true}>No users</TableItem>}
                </Table> ) : 
                <div className={`w-full`} >
                    <Skeleton height={20}/>
                    <Skeleton height={40} count={5}/>
                </div>
            )}

            {tab=="updates" && (
                (data && updates) ? 
                // get all updates with this project id and map into table.
                <Table 
                gtc={`1fr 1fr ${"6rem ".repeat((selectionTemplates.length || 0))}6rem`}
                headers={selectionTemplates && selectionTemplates[0] ? ["User", "Name", ...selectionTemplates.map(s => (s.question)) ,"Date"] : ["User", "Name", "Date"]}
                >
                    {updates[0] ? updates.map(update => (
                        <>
                            <TableItem 
                                main={true}
                                href={`/projects/${project._id}/${update.userId}`} 
                                className="text-base"
                                truncate={true}
                                wide={true}
                            >{users.filter(user => user._id == update.userId)[0].name}</TableItem>
                            <TableItem truncate={true} wide={true} href={`/projects/${project._id}/${update.userId}/${update._id}`}>{update.name}</TableItem>
                            {update.selectionArr && update.selectionArr.map(s => (
                                <TableItem truncate={true} key={s._id}>{s.selected}</TableItem>
                            ))}
                            <TableItem>{formatDistance(
                                new Date(update.date),
                                new Date(),
                                {
                                    addSuffix: true,
                                },
                                )}</TableItem> 
                            <hr className={`col-span-${3 + (selectionTemplates.length || 0)} my-2`}/>
                        </>
                    )) : <TableItem>No updates.</TableItem> }
                </Table> : 
                <div className={`w-full`} >
                    <Skeleton height={20}/>
                    <Skeleton height={40} count={5}/>
                </div>
            )}
        </div>
    )
}

export default Project

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return {redirect: {permanent: false, destination: "/auth/sign-in"}};
    const projectId: any = context.params.projectId;

    try {
        await dbConnect();

        const thisProject = await ProjectModel.findOne({ _id: projectId });

        if (!thisProject) return {notFound: true};

        return {props: {project: cleanForJSON(thisProject)}};
    } catch (e) {
        return {notFound: true};
    }
};