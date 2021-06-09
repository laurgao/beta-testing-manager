import { GetServerSideProps } from 'next'
import React from 'react'
import H1 from '../../../components/H1'
import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import UpSEO from '../../../components/up-seo'
import { getProjectRequest } from '../../../utils/requests'
import { UpdateObj, ProjectObj, SelectionTemplateObj, UserObj } from '../../../utils/types'
import { cleanForJSON, fetcher } from '../../../utils/utils'
import { useState, useEffect } from "react"
import {format} from "date-fns";
import Skeleton from 'react-loading-skeleton'
import Button from '../../../components/Button'
import Badge from '../../../components/Badge'
import useSWR, { SWRResponse } from 'swr'
import UpModal from '../../../components/UpModal'
import axios from 'axios'
import Table from '../../../components/Table'
import Tabs from '../../../components/Tabs'
import Link from 'next/link'

const index = ( props: { data: {project: ProjectObj }} ) => {
    const [project, setProject] = useState<ProjectObj>(props.project);
    const [tab, setTab] = useState<"dashboard"|"users"|"updates">("dashboard");
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);    
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false); 
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [updateName, setUpdateName] = useState<string>("");
    const [updateUserId, setUpdateUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    
    // useSWR fetch users and updates assoc with this project ID 
    const {data: users, error: usersError}: SWRResponse<{data: UserObj[] }, any> = useSWR(`/api/user?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: updates, error: updatesError}: SWRResponse<{data: UpdateObj[] }, any> = useSWR(`/api/update?projectId=${project._id}&iter=${iter}`, fetcher);
    const {data: selectionTemplates, error: selectionTemplatesError}: SWRResponse<{data: SelectionTemplateObj[] }, any> = useSWR(`/api/selectionTemplate?projectId=${project._id}&iter=${iter}`, fetcher);
    const selectionQuestions: string[] = selectionTemplates && selectionTemplates.data ? selectionTemplates.data.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : []

    console.log(updates)
    console.log(users)

    // create a state variable for the value of every selection template
    const [selectionValues, setSelectionValues] = useState([])

    useEffect(() => {
        selectionTemplates && selectionTemplates.data && setSelectionValues(selectionTemplates.data.map(s => (
            {
                templateId: s._id,
                selected: "",
            }
        )))
    }, [selectionTemplates]); // make a type for this

    function handleAddUser() {
        setIsLoading(true);

        axios.post("/api/noter", {
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

    function handleAddUpdate() {
        setIsLoading(true);
        console.log(updateName)
        console.log(updateUserId)
        console.log(project._id)

        axios.post("/api/update", {
            name: updateName,
            userId: updateUserId,
            projectId: project._id
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                setAddUserOpen(false);
                setIsLoading(false);
                // setIter(iter + 1);
                // setTab("users");
                setUpdateName("");
                console.log(res.data);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    /* function handleAddUpdate() {
        console.log(selectionValues);
        setIsLoading(true);
        axios.post("/api/update", {
            name: updateName,
            userId: updateUserId,
            projectId: project._id,
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(`Error: ${res.data.error}`);
            } else {
                selectionValues && selectionValues.map(s => (
                    axios.post("/api/selection", {
                        noteId: res.data.id,
                        templateId: s.templateId,
                        selected: s.selected,
                    }).then(r => {
                        if (r.data.error) {
                            setIsLoading(false);
                            console.log(`Error: ${r.data.error}`);
                        } else {
                            setAddUpdateOpen(false);
                            setIsLoading(false);
                            setIter(iter + 1);
                            setTab("updates");
                            console.log(r.data);
                        }
                    }).catch(e => {
                        setIsLoading(false);
                        console.log(e);
                    })
                ))
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
        
    } */
    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="flex items-center mb-9">
                <H1 text={project.name} />
                <div className="ml-auto flex flex-row gap-3">
                    <SecondaryButton onClick={() => setAddUserOpen(true)}>New User (u)</SecondaryButton>
                    <PrimaryButton onClick={() => setAddUpdateOpen(true)}>New Update (n)</PrimaryButton>
                </div>                
            </div>

            <div className="mb-12">
                <Tabs tab={tab} tabs={["Dashboard", "Users", "Updates"]} setTab={setTab}/>
            </div>

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
                    {selectionTemplates && selectionTemplates.data && selectionTemplates.data.map(s => (
                        <div className="my-12" key={s._id}>
                            <h3>{s.question}</h3>
                            <select
                                className="border-b w-full content my-2 py-2"
                                value={selectionValues.filter((sv) => sv.templateId == s._id)[0].selected}
                                onChange={e => setSelectionValues([
                                    ...selectionValues.filter((sv) => sv.templateId != s._id), {
                                        templateId: s._id,
                                        selected: e.target.value,
                                    }
                                ])}
                                placeholder="Choose a user"
                            >
                                {s.options.map(o => (
                                    <option
                                        value={o}
                                    >{o}</option>
                                ))}
                            </select>
                        </div>
                    ))}
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
                    gtc={`1fr 6rem 6rem 6rem ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                    headers={["Name", "Last update", "Added", "Tags", ...selectionQuestions ,"Total updates"]}
                >
                    {(users && users.data) ? users.data.length ? users.data.map(user => (
                        <>
                            <Link 
                                href={`/projects/${project._id}/${user._id}`} 
                            ><a className="text-base btm-text-gray-500 font-semibold text-left text-xl py-2">{user.name}</a></Link>
                            <p className="text-base btm-text-gray-500">3 months ago</p>
                            <p className="text-base btm-text-gray-500">{format(new Date(user.createdAt), "MMM d, yyyy")}</p> {/* {format(new Date(user.createdAt), "MMM d, yyyy")}*/}
                            <div className="flex items-center">
                                {user.tags && user.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            <p className="text-base btm-text-gray-500">Very dis...</p>
                            <p className="text-base btm-text-gray-500">5</p>
                            <hr className={`col-span-${6} my-2`}/>
                        </>
                    )) : <p>No users</p> : <Skeleton/>}
                </Table>
            )}

            {tab=="updates" && (
                // get all updates with this project id and map into table.
                <Table 
                gtc={`1fr 6rem 6rem ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                headers={["User", "Name", ...selectionQuestions ,"Date"]}
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