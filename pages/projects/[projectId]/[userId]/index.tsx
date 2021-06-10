import { GetServerSideProps } from 'next'
import {format} from "date-fns";
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import AddUpdateModal from '../../../../components/AddUpdateModal'
import H1 from '../../../../components/H1'
import PrimaryButton from '../../../../components/PrimaryButton'
import TableItem from '../../../../components/TableItem'
import TableItemMain from '../../../../components/TableItemMain'
import Table from '../../../../components/Table'
import UpSEO from '../../../../components/up-seo'
import { getProjectRequest, getUserRequest } from '../../../../utils/requests'
import { ProjectObj, SelectionObj, SelectionTemplateObj, UpdateObj, UserObj } from '../../../../utils/types'
import { cleanForJSON, fetcher } from '../../../../utils/utils'
import Skeleton from 'react-loading-skeleton';
import InlineButton from '../../../../components/InlineButton';

const index = ( props: { data: {user: UserObj }} ) => {
    const [user, setUser] = useState<UserObj>(props.user);
    const [project, setProject] = useState<ProjectObj>(props.project);
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const {data: updates, error: updatesError}: SWRResponse<{data: UpdateObj[] }, any> = useSWR(`/api/update?userId=${user._id}&iter=${iter}`, fetcher);
    const {data: selectionTemplates, error: selectionTemplatesError}: SWRResponse<{data: SelectionTemplateObj[] }, any> = useSWR(`/api/selectionTemplate?projectId=${user.projectId}&iter=${iter}`, fetcher);
    const {data: selections, error: selectionsError}: SWRResponse<{data: SelectionObj[] }, any> = useSWR(`/api/selection?userId=${user._id}&iter=${iter}`, fetcher); 
    const selectionQuestions: string[] = selectionTemplates && selectionTemplates.data ? selectionTemplates.data.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : []
    
    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
                <InlineButton href={`/projects/${user.projectId}/`}>{project.name}</InlineButton>
            </div>
            {addUpdateOpen && (
                <AddUpdateModal 
                    addUpdateOpen={addUpdateOpen}
                    setAddUpdateOpen={setAddUpdateOpen}
                    updateUserId={user._id}
                    selectionTemplates={selectionTemplates}
                    projectId={user.projectId}
                    setIter={setIter}
                />
            )}
            <div className="flex items-center mb-12">
                <H1 text={user.name} />
                <PrimaryButton onClick={() => setAddUpdateOpen(true)} className="ml-auto">New update (n)</PrimaryButton>
            </div>
            <div className="md:flex flex-wrap gap-32">
                <div className="flex flex-col gap-9">
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Email</p>
                        <p className="text-xl btm-text-gray-500">{user.email ? user.email : "Null"}</p>
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Tags</p>
                        <p className="text-xl btm-text-gray-500">{user.tags.length ? user.tags : "No tags" /* badge map */ }</p> 
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Joined</p>
                        <p className="text-xl btm-text-gray-500">{format(new Date(user.createdAt), "MMM d, yyyy")}</p> 
                    </div>
                    {selectionQuestions && selectionQuestions.map(q => (
                        <div>
                            <p className="text-sm btm-text-gray-400 mb-2">{q}</p>
                            <p className="text-xl btm-text-gray-500">Very dissatisfied</p> 
                        </div>
                    ))}
                    
                </div>

                <div className="">
                    <Table 
                        gtc={`1fr ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                        headers={[ "Name", ...selectionQuestions ,"Date"]}
                    >
                        {(updates && updates.data) ? updates.data.length ? updates.data.map(update => (
                            <>
                                <TableItemMain href={`/projects/${user.projectId}/${user._id}/${update._id}`} className="text-base">{update.name}</TableItemMain>
                                {selections && selections.data && selections.data.filter(s => (s.noteId == update._id)).map(s => (
                                    <TableItem key={s._id}>{s.selected}</TableItem>
                                ))}
                                <TableItem>{format(new Date(update.createdAt), "MMM d, yyyy")}</TableItem> {/* {format(new Date(user.createdAt), "MMM d, yyyy")}*/}
                                <hr className={`col-span-${2 + selectionQuestions.length} my-2`}/>
                            </>
                        )) : <p>No updates</p> : <Skeleton/>}
                    </Table>
                </div>
            </div>
            
        </div>
    )
}

export default index

export const getServerSideProps: GetServerSideProps = async (context) => {

    const userId: any = context.params.userId;
    const user = await getUserRequest(userId);

    const project = await getProjectRequest(user.projectId);

    return { props: { user: cleanForJSON(user), project: cleanForJSON(project) }};
};