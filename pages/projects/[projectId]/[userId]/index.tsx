import { GetServerSideProps } from 'next'
import {format, formatDistance} from "date-fns";
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import UpdateModal from '../../../../components/UpdateModal'
import H1 from '../../../../components/H1'
import PrimaryButton from '../../../../components/PrimaryButton'
import TableItem from '../../../../components/TableItem'
import Table from '../../../../components/Table'
import UpSEO from '../../../../components/up-seo'
import { DatedObj, ProjectObj, SelectionTemplateObj, TextTemplateObj, UpdateObj, UserGraphObj, UserObj } from '../../../../utils/types'
import { fetcher, useKey, waitForEl } from '../../../../utils/utils'
import Skeleton from 'react-loading-skeleton';
import InlineButton from '../../../../components/InlineButton';
import { getSession } from 'next-auth/client';
import { FaPlus } from 'react-icons/fa';
import DeleteModal from '../../../../components/DeleteModal';
import MoreMenuItem from '../../../../components/MoreMenuItem';
import MoreMenu from '../../../../components/MoreMenu';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import UserModal from '../../../../components/UserModal';
import Truncate from '../../../../components/Truncate';

const index = ( props: {userId: string } ) => {
    const [userId, setUserId] = useState<string>(props.userId);
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
    const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const {data: data, error: error}: SWRResponse<DatedObj<UserGraphObj>, any> = useSWR(`/api/user?id=${userId}&iter=${iter}`, fetcher);
    const user: DatedObj<UserObj> = data ? data.userData[0] : {name: "",  _id: "", createdAt: "", updatedAt: "", projectId: "", date: "", tags: []};
    const updates: DatedObj<UpdateObj>[] = data ? data.updateData : [];
    const selectionTemplates: DatedObj<SelectionTemplateObj>[] = data ? data.selectionTemplateData : [];
    const textTemplates: DatedObj<TextTemplateObj>[] = data ? data.textTemplateData : [];
    const projectData: DatedObj<ProjectObj> = data ? data.projectData : {name: "", description: "", _id: "", createdAt: "", updatedAt: "", accountId: ""};
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    useEffect(() => {
        setIsModalOpen(addUpdateOpen || deleteUserOpen || editUserOpen);
    }, [addUpdateOpen, deleteUserOpen, editUserOpen])

    function toggleAddUpdate(e) {
        if (!isModalOpen) {
            setAddUpdateOpen(true);
            e.preventDefault();
            waitForEl("update-name-field");
        }
    }    
    useKey("KeyN", toggleAddUpdate);
    
    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
                {projectData.name ? <InlineButton href={`/projects/${user.projectId}`}>{projectData.name}</InlineButton> : <Skeleton width={100}/>}
            </div>
            {user && deleteUserOpen && (
                <DeleteModal 
                    item={user}
                    itemType="user"
                    isOpen={deleteUserOpen}
                    setIsOpen={setDeleteUserOpen}
                    iter={iter}
                    setIter={setIter}
                />
            )}

            {user && editUserOpen && (
                <UserModal 
                    isOpen={editUserOpen}
                    setIsOpen={setEditUserOpen}
                    user={user}
                    iter={iter}
                    setIter={setIter}
                    projectId={user.projectId}
                />
            )}

            {addUpdateOpen && (
                <UpdateModal 
                    isOpen={addUpdateOpen}
                    setIsOpen={setAddUpdateOpen}
                    userId={userId}
                    users={[user]}
                    selectionTemplates={selectionTemplates}
                    textTemplates={textTemplates}
                    iter={iter}
                    setIter={setIter}
                />
            )}
            <div className="flex items-center mb-12">
                {user ? <H1 text={user.name} /> : <Skeleton width={200} height={40}/>}
                <div className="ml-auto flex flex-row gap-3">
                    <PrimaryButton onClick={toggleAddUpdate} className="ml-auto"><FaPlus className="-mt-0.5"/><span className="ml-2">New update (n)</span></PrimaryButton>
                    <MoreMenu>
                        <MoreMenuItem text="Edit" icon={<FiEdit2 />} onClick={() => setEditUserOpen(true)}/>
                        <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setDeleteUserOpen(true)}/>
                    </MoreMenu>
                </div>
            </div>
            <div className="md:flex flex-row gap-24">
                <div className="flex flex-col gap-9">
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Email</p>
                        {user ? <p className="text-xl btm-text-gray-500">{user.email ? user.email : "N/A"}</p> : <Skeleton width={100}/>}
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Tags</p>
                        {user ? <p className="text-xl btm-text-gray-500">{user.tags.length ? user.tags : "No tags" /* badge map */ }</p> : <Skeleton width={100}/>}
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Joined</p>
                        {user && user.date ? <p className="text-xl btm-text-gray-500">{format(new Date(user.date), "MMM d, yyyy")}</p> : <Skeleton width={100}/>}
                    </div>
                    {selectionTemplates && selectionTemplates[0] && selectionTemplates.map(st => (
                        <div>
                            <Truncate className="text-sm btm-text-gray-400 mb-2">{st.question}</Truncate>
                            <p className="text-xl btm-text-gray-500">{
                                (updates && updates[updates.length-1]) ? updates[updates.length-1].selectionArr.filter(s => (
                                    s.templateId == st._id
                                ))[0].selected : "No updates yet"
                            }</p> 
                        </div>
                    ))}
                    
                </div>

                <div className="flex-grow">
                    <Table 
                        gtc={`1fr ${"6rem ".repeat(selectionTemplates.length || 0)}6rem`}
                        headers={(selectionTemplates && selectionTemplates[0]) ? [ "Name", ...selectionTemplates.map(s => (s.question)) ,"Date"] : [ "Name", "Date"]}
                    >
                        {(data && updates) ? updates[0] ? updates.map(update => (
                            <>
                                <TableItem 
                                    main={true}
                                    href={`/projects/${user.projectId}/${user._id}/${update._id}`} 
                                    className="text-base"
                                    truncate={true}
                                    wide={true}
                                >{update.name}</TableItem>

                                {update.selectionArr && update.selectionArr.map(s => (
                                    <TableItem truncate={true} key={s._id}>{s.selected}</TableItem>
                                ))}
                                <TableItem>{formatDistance(
                                    new Date(update.date),
                                    new Date(),
                                    {
                                        addSuffix: true,
                                    },)}</TableItem> 
                                <hr className={`col-span-${2 + (selectionTemplates.length || 0)} my-2`}/>
                            </>
                        )) : <TableItem>No updates</TableItem> : (
                            <>
                                <Skeleton className="col-span-2"/>
                                <Skeleton className="col-span-1"/>
                            </>
                        )}
                    </Table>
                </div>
            </div>
            
        </div>
    )
}

export default index

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return {redirect: {permanent: false, destination: "/auth/sign-in"}};
    const userId: any = context.params.userId;
    // const user = await UserModel.findOne({ _id: userId });

    // const project = await 
    // Future: don't need useSWR and fetch all data server side? That's literally smarter doe right
    
    return { props: { userId: userId }};
};