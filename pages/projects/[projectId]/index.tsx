import { GetServerSideProps } from 'next'
import React from 'react'
import H1 from '../../../components/H1'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import UpSEO from '../../../components/up-seo'
import { getProjectRequest } from '../../../utils/requests'
import { NoteObj, ProjectObj, UserObj } from '../../../utils/types'
import { cleanForJSON, fetcher } from '../../../utils/utils'
import { useState } from "react"
import {format} from "date-fns";
import Skeleton from 'react-loading-skeleton'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import useSWR, { SWRResponse } from 'swr'
import UpModal from '../../../components/UpModal'
import axios from 'axios'
import Table from '../../../components/Table'
import Tabs from '../../../components/Tabs'

const index = ( props: { data: {project: ProjectObj }} ) => {
    const [project, setProject] = useState<ProjectObj>(props.project);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("users");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [updateName, setUpdateName] = useState<string>("");
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0)

    
    console.log(updateUserId)
    console.log(updateName)
    
    // useSWR fetch users and updates assoc with this project ID 
    const {data: users, error: usersError}: SWRResponse<{data: UserObj[] }, any> = useSWR(`/api/user?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: updates, error: updatesError}: SWRResponse<{data: NoteObj[] }, any> = useSWR(`/api/note?projectId=${project._id}&iter=${iter}`, fetcher);
    
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
                // @ts-ignore
                /* window.analytics.track("Item created", {
                    type: "project",
                    projectId: res.data.id,
                }); */
                setAddUserOpen(false);
                setIsLoading(false);
                setIter(iter + 1);
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function handleAddUpdate() {
        setIsLoading(true);
        axios.post("/api/note", {
            name: updateName,
            userId: updateUserId,
            projectId: project._id,
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                // @ts-ignore
                /* window.analytics.track("Item created", {
                    type: "project",
                    projectId: res.data.id,
                }); */
                setAddUpdateOpen(false);
                setIsLoading(false);
                setIter(iter + 1);
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }
    
    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="flex items-center mb-12">
                <H1 text={project.name} />
                <div className="ml-auto flex flex-row gap-3">
                    <SecondaryButton onClick={() => setAddUserOpen(true)}>New User (u)</SecondaryButton>
                    <PrimaryButton onClick={() => setAddUpdateOpen(true)}>New Update (n)</PrimaryButton>
                </div>                
            </div>

            <Tabs tab={tab} tabs={["Dashboard", "Users", "Updates"]} setTab={setTab}/>

            {addUserOpen && (
                <UpModal isOpen={addUserOpen} setIsOpen={setAddUserOpen}>
                    <H1 text="New user"/>
                    <div className="my-12">
                        <h3 className="up-ui-title">Name</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="Laura Gao"
                            value={name}
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
                <UpModal isOpen={addUpdateOpen} setIsOpen={setAddUpdateOpen}>
                    <H1 text="New update"/>
                    <div className="my-12">
                        <h3>User</h3>
                        <select
                            className="border-b w-full content my-2 py-2"
                            value={updateUserId}
                            onChange={e => setUpdateUserId(e.target.value)}
                            placeholder="Choose a user"
                        >
                            {users.data.map(u => (
                                <option 
                                    key={u._id}
                                    value={u._id}
                                >{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="my-12">
                        <h3 className="up-ui-title">Name</h3>
                        <input
                            type="text"
                            className="border-b w-full content my-2 py-2"
                            placeholder="Check in 2"
                            value={updateName}
                            onChange={e => setUpdateName(e.target.value)}
                        />
                    </div>
                    <PrimaryButton
                        onClick={handleAddUpdate}
                        isLoading={isLoading}
                        isDisabled={!updateUserId}
                    >
                        Create
                    </PrimaryButton>
                </UpModal>
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
                    gtc="1fr 6rem 6rem 12rem 6rem 6rem" 
                    headers={["Name", "Last update", "Added", "Tags", "How dissatisfied...", "Total updates"]}
                >
                    {(users && users.data) ? users.data.length ? users.data.map(user => (
                        <>
                            <div className="my-2">
                                <Button href={`/projects/${project._id}/${user._id}`}>{user.name}</Button>
                            </div>
                            <p className="text-lg opacity-40">3 months ago</p>
                            <p className="text-lg opacity-40">{format(new Date(user.createdAt), "MMM d, yyyy")}</p> {/* {format(new Date(user.createdAt), "MMM d, yyyy")}*/}
                            <div className="flex items-center">
                                {user.tags && user.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            <p className="text-lg opacity-40">Very dis...</p>
                            <p className="text-lg opacity-40">5</p>
                            
                        </>
                    )) : <p>No users</p> : <Skeleton/>}
                </Table>
            )}

            {tab=="updates" && (
                // get all updates with this project id and map into table.
                <Table 
                    gtc="1fr 6rem 6rem 12rem" 
                    headers={["User", "Name", "How dissatisfied...", "Date"]}
                >
                    {(updates && updates.data) ? updates.data.length ? updates.data.map(update => (
                        <>
                            <div className="my-2">
                                <Button href={`/projects/${project._id}/${update.userId}/${update._id}`}>{update.name}</Button>
                            </div>
                            
                            <p className="text-lg opacity-40">Very dis...</p>
                            <p className="text-lg opacity-40">{format(new Date(update.createdAt), "MMM d, yyyy")}</p> {/* {format(new Date(user.createdAt), "MMM d, yyyy")}*/}
                            
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