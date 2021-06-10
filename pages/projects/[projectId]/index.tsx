import { GetServerSideProps } from 'next'
import H1 from '../../../components/H1'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import UpSEO from '../../../components/up-seo'
import { getProjectRequest } from '../../../utils/requests'
import { UpdateObj, ProjectObj, SelectionTemplateObj, UserObj, SelectionObj } from '../../../utils/types'
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

const index = ( props: { data: {project: ProjectObj }} ) => {
    const [project, setProject] = useState<ProjectObj>(props.project);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("dashboard");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    
    // useSWR fetch users and updates assoc with this project ID 
    const {data: users, error: usersError}: SWRResponse<{data: UserObj[] }, any> = useSWR(`/api/user?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: updates, error: updatesError}: SWRResponse<{data: UpdateObj[] }, any> = useSWR(`/api/update?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: selectionTemplates, error: selectionTemplatesError}: SWRResponse<{data: SelectionTemplateObj[] }, any> = useSWR(`/api/selectionTemplate?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: selections, error: selectionsError}: SWRResponse<{data: SelectionObj[] }, any> = useSWR(`/api/selection?projectId=${project._id}&iter=${iter}`, fetcher);
    const selectionQuestions: string[] = selectionTemplates && selectionTemplates.data ? selectionTemplates.data.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : []

    function handleAddUser() {
        setIsLoading(true);

        axios.post("/api/user", {
            name: name,
            email: email,
            projectId: project._id
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
                <H1 text={project.name} />
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
                    selectionTemplates={selectionTemplates}
                    users={users}
                    projectId={project._id}
                />
            )}      

            {tab == "dashboard" && (
                <div>
                    <p>{project.description && project.description}</p>
                </div>
            )}

            {tab == "users" && (
                // get all users assoc with this project id
                // map into a table
                <Table 
                    gtc={`1fr 6rem 6rem 6rem ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                    headers={["Name", "Last update", "Added", "Tags", ...selectionQuestions ,"Total updates"]}
                >
                    {(users && users.data) ? users.data.length ? users.data.map(user => (
                        <>
                            <TableItemMain href={`/projects/${project._id}/${user._id}`} className="text-xl">{user.name}</TableItemMain>
                            <TableItem>3 months ago</TableItem>
                            <TableItem>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableItem>
                            <div className="flex items-center">
                                {user.tags && user.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            {updates.data.filter(u => (u.userId == user._id))[0] ? selections && selections.data && selections.data.filter(s => (
                                s.noteId == updates.data.filter(u => (u.userId == user._id))[0]._id // assume updates are sorted by date
                            )).map(s => ( 
                                <TableItem key={s._id}>{s.selected}</TableItem> 
                            )): <p>None</p> /* repeat selectionTemplates.data.length times */ }
                            <TableItem>5</TableItem>
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
                    {(updates && updates.data) ? updates.data.length ? updates.data.map(update => (
                        <>
                            {users && users.data && users.data.filter(user => (
                                user._id == update.userId
                            )).map(user => (
                                <TableItemMain href={`/projects/${project._id}/${update.userId}`} className="text-base">{user.name}</TableItemMain>
                            ))}
                            <TableItem href={`/projects/${project._id}/${update.userId}/${update._id}`}>{update.name}</TableItem>
                            {selections && selections.data && selections.data.filter(s => (s.noteId == update._id)).map(s => (
                                <TableItem key={s._id}>{s.selected}</TableItem>
                            ))}
                            <TableItem>{format(new Date(update.createdAt), "MMM d, yyyy")}</TableItem> {/* {format(new Date(user.createdAt), "MMM d, yyyy")}*/}
                            <hr className={`col-span-${3 + selectionQuestions.length} my-2`}/>
                        </>
                    )) : <p>No updates</p> : <Skeleton/>}
                </Table>
            )}

        </div>
    )
}

export default index

export const getServerSideProps: GetServerSideProps = async (context) => {

    const projectId: any = context.params.projectId;
    const project = await getProjectRequest(projectId)
    
    return { props: { project: cleanForJSON(project) }};
};