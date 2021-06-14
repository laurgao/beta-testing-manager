import { GetServerSideProps } from 'next'
import H1 from '../../../components/H1'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import UpSEO from '../../../components/up-seo'
import { UpdateObj, ProjectObj, SelectionTemplateObj, UserObj, SelectionObj, TextTemplateObj, DatedObj } from '../../../utils/types'
import { cleanForJSON, fetcher, waitForEl, useKey } from '../../../utils/utils'
import { useState, useEffect } from "react"
import {format, formatDistance} from "date-fns";
import Skeleton from 'react-loading-skeleton'
import InlineButton from '../../../components/InlineButton'
import Badge from '../../../components/Badge'
import useSWR, { SWRResponse } from 'swr'
import UpModal from '../../../components/UpModal'
import axios from 'axios'
import Table from '../../../components/Table'
import Tabs from '../../../components/Tabs'
import UpdateModal from '../../../components/UpdateModal'
import TableItem from '../../../components/TableItem'
import { getSession } from 'next-auth/client'
import { ProjectModel } from '../../../models/project'
import dbConnect from '../../../utils/dbConnect'
import { FaPlus } from 'react-icons/fa'
import SmallTitle from '../../../components/SmallTitle'
import MoreMenu from '../../../components/MoreMenu'
import MoreMenuItem from '../../../components/MoreMenuItem'
import { FiEdit2, FiTrash } from 'react-icons/fi'
import router from 'next/router'
import DeleteModal from '../../../components/DeleteModal'
import UserModal from '../../../components/UserModal'

const index = ( props: { project: DatedObj<ProjectObj> } ) => {
    const [project, setProject] = useState<DatedObj<ProjectObj>>(props.project);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("dashboard");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const [editProjectOpen, setEditProjectOpen] = useState<boolean>(false);
    const [deleteProjectOpen, setDeleteProjectOpen] = useState<boolean>(false);
    
    const {data: users, error: userError}: SWRResponse<{data: DatedObj<UserObj>[] }, any> = useSWR(`/api/user?projectId=${project._id}&iter=${iter}`, fetcher);
    const [projectName, setProjectName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [selectionTemplates, setSelectionTemplates] = useState<DatedObj<SelectionTemplateObj>[]>()
    const [textTemplates, setTextTemplates] = useState<DatedObj<TextTemplateObj>[]>()

    useEffect(() => {
        if(users && users.data) {
            setTextTemplates(users && users.data && users.data[0] && users.data[0].projectArr[0] && users.data[0].projectArr[0].textTemplateArr);
            setSelectionTemplates(users && users.data && users.data[0] && users.data[0].projectArr[0] && users.data[0].projectArr[0].selectionTemplateArr);
            setDescription((users && users.data && users.data[0] && users.data[0].projectArr[0].description) || "")
            setProjectName(users && users.data && users.data[0] && users.data[0].projectArr[0].name)
        }
    }, [users])
    
    const selectionQuestions: string[] = selectionTemplates ? selectionTemplates.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : []

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

    function handleAddProject() {
        setIsLoading(true);

        axios.post("/api/project", {
            name: projectName,
            description: description,
            id: project._id
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setIsLoading(false);
                setIter(iter + 1); // Fetching project client side so this can work.
                setEditProjectOpen(false);
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }



    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title={projectName || (project && project.name && project.name)}/>

            {editProjectOpen && (
                <UpModal isOpen={editProjectOpen} setIsOpen={setEditProjectOpen} wide={true}>
                    <H1 text="Edit project"/>
                    <div className="my-12">
                        <h3 className="up-ui-title">Name</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="Beta Testing Manager"
                            value={projectName}
                            id="project-name-field"
                            onChange={e => setProjectName(e.target.value)}
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
                        onClick={handleAddProject}
                        isLoading={isLoading}
                        isDisabled={!projectName}
                    >
                        Save
                    </PrimaryButton>
                </UpModal>
            )}

            {deleteProjectOpen && (
                <DeleteModal 
                    item={project}
                    itemType="project"
                    isOpen={deleteProjectOpen}
                    setIsOpen={setDeleteProjectOpen}
                    iter={iter}
                    setIter={setIter}
                />
            )}

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
                <Tabs tab={tab} tabs={["Dashboard", "Users", "Updates"]} setTab={setTab}/>
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
                    users={users && users.data}
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
                <Table 
                    gtc={`1fr 6rem 6rem 6rem ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                    headers={["Name", "Last update", "Added", "Tags", ...selectionQuestions ,"Total updates"]}
                >
                    {users ? users.data ? users.data.map(user => (
                        <>
                            <TableItem 
                                main={true}
                                href={`/projects/${project._id}/${user._id}`} 
                                className="text-xl"
                                truncate={true}
                                wide={true}
                            >{user.name}</TableItem>
                            {(user.updateArr && user.updateArr[user.updateArr.length-1]) ? user.updateArr[user.updateArr.length-1] && <TableItem truncate={true}>{`${formatDistance(
                                new Date(user.updateArr[user.updateArr.length-1].date || user.updateArr[user.updateArr.length-1].createdAt),
                                new Date(),
                                {
                                    includeSeconds: true,
                                },
                            )} ago`}</TableItem> : (
                                <p></p>
                            )}
                            <TableItem truncate={true}>{`${formatDistance(
                                new Date(user.date || user.createdAt),
                                new Date(),
                                {
                                    includeSeconds: true,
                                },
                            )} ago`}</TableItem>
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
                                selectionQuestions.map((q, index) => (
                                    <p key={index}></p>
                                )) 
                            )}
                            <TableItem>{user.updateArr.length.toString()}</TableItem>
                            <hr className={`col-span-${5 + selectionQuestions.length} my-2`}/>
                        </>
                    )) : <TableItem main={true}>No users</TableItem> : <Skeleton className={`col-span-${5}`}/>}
                </Table>
            )}

            {tab=="updates" && (
                // get all updates with this project id and map into table.
                <Table 
                gtc={`1fr 1fr ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                headers={["User", "Name", ...selectionQuestions ,"Date"]}
                >
                    {users && users.data ? users.data.map(user => ( // does empty array users pass `users &&` ?
                        (user.updateArr && user.updateArr[0]) && user.updateArr.map(update => (
                            <>
                                <TableItem 
                                    main={true}
                                    href={`/projects/${project._id}/${update.userId}`} 
                                    className="text-base"
                                    truncate={true}
                                    wide={true}
                                >{user.name}</TableItem>
                                <TableItem truncate={true} href={`/projects/${project._id}/${update.userId}/${update._id}`}>{update.name}</TableItem>
                                {update.selectionArr && update.selectionArr.map(s => (
                                    <TableItem truncate={true} key={s._id}>{s.selected}</TableItem>
                                ))}
                                <TableItem>{`${formatDistance(
                                    new Date(update.date || update.createdAt),
                                    new Date(),
                                    {
                                        includeSeconds: true,
                                    },
                                    )} ago`}</TableItem> 
                                <hr className={`col-span-${3 + selectionQuestions.length} my-2`}/>
                            </>
                        ))
                    )) : <Skeleton/>}
                </Table>
            )}

        </div>
    )
}

export default index

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