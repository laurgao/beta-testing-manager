import { GetServerSideProps } from 'next'
import H1 from '../../../components/H1'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import UpSEO from '../../../components/up-seo'
import { getProjectRequest } from '../../../utils/requests'
import { UpdateObj, ProjectObj, SelectionTemplateObj, UserObj, SelectionObj, TextTemplateObj } from '../../../utils/types'
import { cleanForJSON, fetcher } from '../../../utils/utils'
import { useState, useEffect, useRef } from "react"
import {format} from "date-fns";
import Skeleton from 'react-loading-skeleton'
import InlineButton from '../../../components/InlineButton'
import Badge from '../../../components/Badge'
import useSWR, { SWRResponse } from 'swr'
import UpModal from '../../../components/UpModal'
import axios from 'axios'
import Table from '../../../components/Table'
import Tabs from '../../../components/Tabs'
import AddUpdateModal from '../../../components/AddUpdateModal'
import TableItem from '../../../components/TableItem'
import TableItemMain from '../../../components/TableItemMain'

const index = ( props: { data: {projectId: string }} ) => {
    const [projectId, setProjectId] = useState<string>(props.projectId);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("dashboard");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    
    const {data: projects, error: projectError}: SWRResponse<{data: ProjectObj[] }, any> = useSWR(`/api/project?id=${projectId}&iter=${iter}`, fetcher);
    const [project, setProject] = useState<ProjectObj>();
    useEffect(() => {
        if(projects) {
            setProject(projects.data[0]); // only 1 project should be returned from the useSWR call, so projects.data should only contain 1 project.
        }
    }, [projects]) 

    const selectionQuestions: string[] = project && project.selectionTemplateArr ? project.selectionTemplateArr.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : []
    function handleAddUser() {
        setIsLoading(true);

        axios.post("/api/user", {
            name: name,
            email: email,
            projectId: projectId
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setAddUserOpen(false);
                setIsLoading(false);
                setIter(iter + 1);
                setTab("users");
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function useKey(key, cb) {
        const callbackRef = useRef(cb);
    
        useEffect(() => {
            callbackRef.current = cb;
        })
    
        useEffect(() => {
          const handleKeyPress = (e) => {
            if(e.code === key) {
                callbackRef.current(e)
            }
          }
    
          document.addEventListener("keypress", handleKeyPress)
          return () => document.removeEventListener("keypress", handleKeyPress)
        }, [key])
    }

    const waitForEl = (selector) => {
        const input = document.getElementById(selector);
        if (input) {
            input.focus();
        } else {
            setTimeout(function() {
                waitForEl(selector);
            }, 100);
        }
    };
      
    function toggleAddUser(e) {
        if (!addUserOpen && !addUpdateOpen) {
            setAddUserOpen(true);
            e.preventDefault(); // prevents U from being typed in the case of a keyboard shortcut
            waitForEl("user-name-field");
        }
    }
    function toggleAddUpdate(e) {
        if (!addUserOpen && !addUpdateOpen) {
            setAddUpdateOpen(true);
            e.preventDefault();
            waitForEl("update-name-field");
        }
    }
    
    useKey("KeyN", toggleAddUpdate);
    useKey("KeyU", toggleAddUser);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
            </div>
            <div className="flex items-center mb-9">
                <H1 text={project && project.name} />
                <div className="ml-auto flex flex-row gap-3">
                    <SecondaryButton onClick={toggleAddUser}>New User (u)</SecondaryButton>
                    <PrimaryButton onClick={toggleAddUpdate}>New Update (n)</PrimaryButton>
                </div>                
            </div>

            <div className="mb-12">
                <Tabs tab={tab} tabs={["Dashboard", "Users", "Updates"]} setTab={setTab}/>
            </div>

            {addUserOpen && (
                <UpModal isOpen={addUserOpen} setIsOpen={setAddUserOpen} wide={true}>
                    <H1 text="New user"/>
                    <div className="my-12">
                        <h3 className="up-ui-title">Name</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="Laura Gao"
                            value={name}
                            id="user-name-field"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="my-12">
                        <h3 className="up-ui-title">Email</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="hi@lauragao.ca"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <PrimaryButton
                        onClick={handleAddUser}
                        isLoading={isLoading}
                        isDisabled={!name}
                    >
                        Create
                    </PrimaryButton>
                </UpModal>
            )}

            {addUpdateOpen && (
                <AddUpdateModal 
                    addUpdateOpen={addUpdateOpen}
                    setAddUpdateOpen={setAddUpdateOpen}
                    updateUserId={updateUserId}
                    setUpdateUserId={setUpdateUserId}
                    selectionTemplates={project && project.selectionTemplateArr}
                    textTemplates={project && project.textTemplateArr}
                    users={project.userArr}
                    iter={iter}
                    setIter={setIter}
                />
            )}      

            {tab == "dashboard" && (
                <div>
                    <p>{project && project.description && project.description}</p>
                </div>
            )}

            {tab == "users" && (
                // get all users assoc with this project id
                // map into a table
                <Table 
                    gtc={`1fr 6rem 6rem 6rem ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                    headers={["Name", "Last update", "Added", "Tags", ...selectionQuestions ,"Total updates"]}
                >
                    {project.userArr ? project.userArr.length ? project.userArr.map(user => (
                        <>
                            <TableItemMain href={`/projects/${project._id}/${user._id}`} className="text-xl">{user.name}</TableItemMain>
                            <TableItem truncate={true}>3 months ago</TableItem>
                            <TableItem truncate={true}>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableItem>
                            <div className="flex items-center">
                                {user.tags && user.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            {user.updateArr ? user.updateArr[user.updateArr.length-1] && user.updateArr[user.updateArr.length-1].selectionArr.length && user.updateArr[user.updateArr.length-1].selectionArr.map(s => ( // updates are auto sorted by createdAt earliest -> latest. 
                                <TableItem key={s._id} truncate={true}>{s.selected ? s.selected : "None"}</TableItem>
                                // selectionArr will exist as an empty array if there are no selections.
                            )): (
                                // If use has no updates, have a "none" for every selection template.
                                selectionQuestions.map((q, index) => (
                                    <TableItem key={index}>None</TableItem>
                                )) 
                            )}
                            <TableItem>{user.updateArr.length.toString()}</TableItem>
                            <hr className={`col-span-${5 + selectionQuestions.length} my-2`}/>
                        </>
                    )) : <TableItemMain>No users</TableItemMain> : <Skeleton/>}
                </Table>
            )}

            {tab=="updates" && (
                // get all updates with this project id and map into table.
                <Table 
                gtc={`1fr 1fr ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                headers={["User", "Name", ...selectionQuestions ,"Date"]}
                >
                    {project.userArr && project.userArr.length ? project.userArr.map(user => ( // does empty array users pass `users &&` ?
                        (user.updateArr) && user.updateArr.length && user.updateArr.map(update => (
                            <>
                                <TableItemMain href={`/projects/${project._id}/${update.userId}`} className="text-base">{user.name}</TableItemMain>
                                <TableItem truncate={true} href={`/projects/${project._id}/${update.userId}/${update._id}`}>{update.name}</TableItem>
                                {update.selectionArr && update.selectionArr.map(s => (
                                    <TableItem truncate={true} key={s._id}>{s.selected}</TableItem>
                                ))}
                                <TableItem truncate={true}>{format(new Date(update.createdAt), "MMM d, yyyy")}</TableItem>
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

    const projectId: any = context.params.projectId;
    // const project = await getProjectRequest(projectId)
    
    return { props: { projectId: projectId }};
};