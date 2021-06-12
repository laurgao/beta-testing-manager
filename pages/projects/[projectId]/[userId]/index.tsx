import { GetServerSideProps } from 'next'
import {format} from "date-fns";
import { useEffect, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import AddUpdateModal from '../../../../components/AddUpdateModal'
import H1 from '../../../../components/H1'
import PrimaryButton from '../../../../components/PrimaryButton'
import TableItem from '../../../../components/TableItem'
import Table from '../../../../components/Table'
import UpSEO from '../../../../components/up-seo'
import { DatedObj, ProjectObj, SelectionObj, SelectionTemplateObj, UpdateObj, UserObj } from '../../../../utils/types'
import { cleanForJSON, fetcher } from '../../../../utils/utils'
import Skeleton from 'react-loading-skeleton';
import InlineButton from '../../../../components/InlineButton';
import { getSession } from 'next-auth/client';

const index = ( props: {userId: string } ) => {
    const [userId, setUserId] = useState<string>(props.userId);
    const [addUpdateOpen, setAddUpdateOpen] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const {data: users, error: usersError}: SWRResponse<{data: DatedObj<UserObj>[] }, any> = useSWR(`/api/user?id=${userId}&iter=${iter}`, fetcher);
    const [user, setUser] = useState<DatedObj<UserObj>>();
    useEffect(() => {
        if(users) {
            setUser(users.data[0]); 
        }
    }, [users])

    // Fetched data:
    // user.updateArr
    // user.updateArr.map(update => update.selectionArr)
    // user.updateArr.map(update => update.textArr)
    // user.projectArr[0]
    // user.projectArr[0].selectionTemplateArr
    // user.projectArr[0].textTemplateArr
    
    const selectionQuestions: string[] = user && user.projectArr[0].selectionTemplateArr ? user.projectArr[0].selectionTemplateArr.map(s => (
        s.question.length > 10 ? `${s.question.substring(0, 10)}...` : s.question
    )) : [] // There's a better way to do this

    const [projectName, setProjectName] = useState<string>("");
    useEffect(() => {
        if(user) {
            setProjectName(user.projectArr[0].name);
        }
    }, [user])
    
    
    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
                <InlineButton href={`/projects/${user && user.projectId}`}>{projectName}</InlineButton>
            </div>
            {addUpdateOpen && (
                <AddUpdateModal 
                    addUpdateOpen={addUpdateOpen}
                    setAddUpdateOpen={setAddUpdateOpen}
                    updateUserId={userId}
                    selectionTemplates={user.projectArr[0].selectionTemplateArr}
                    textTemplates={user.projectArr[0].textTemplateArr}
                    iter={iter}
                    setIter={setIter}
                />
            )}
            <div className="flex items-center mb-12">
                <H1 text={user && user.name} />
                <PrimaryButton onClick={() => setAddUpdateOpen(true)} className="ml-auto">New update (n)</PrimaryButton>
            </div>
            <div className="md:flex flex-row gap-24">
                <div className="flex flex-col gap-9">
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Email</p>
                        <p className="text-xl btm-text-gray-500">{user && user.email ? user.email : "Null"}</p>
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Tags</p>
                        <p className="text-xl btm-text-gray-500">{user && user.tags.length ? user.tags : "No tags" /* badge map */ }</p> 
                    </div>
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Joined</p>
                        <p className="text-xl btm-text-gray-500">{user && format(new Date(user.createdAt), "MMM d, yyyy")}</p> 
                    </div>
                    {selectionQuestions && selectionQuestions.map(q => (
                        <div>
                            <p className="text-sm btm-text-gray-400 mb-2">{q}</p>
                            <p className="text-xl btm-text-gray-500">Very dissatisfied</p> 
                        </div>
                    ))}
                    
                </div>

                <div className="flex-grow">
                    <Table 
                        gtc={`1fr ${"6rem ".repeat(selectionQuestions.length)}6rem`}
                        headers={[ "Name", ...selectionQuestions ,"Date"]}
                    >
                        {(user && user.updateArr) ? user.updateArr.length ? user.updateArr.map(update => (
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
    const session = await getSession(context);
    if (!session) return {redirect: {permanent: false, destination: "/auth/sign-in"}};
    const userId: any = context.params.userId;
    // const user = await UserModel.findOne({ _id: userId });

    // const project = await 
    // Future: don't need useSWR and fetch all data server side? That's literally smarter doe right
    
    return { props: { userId: userId }};
};