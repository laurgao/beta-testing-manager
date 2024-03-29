import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FiEdit2, FiTrash } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import Accordion from "react-robust-accordion";
import useSWR, { SWRResponse } from "swr";
import DeleteModal from "../../../../components/DeleteModal";
import H1 from "../../../../components/H1";
import InlineButton from "../../../../components/InlineButton";
import MoreMenu from "../../../../components/MoreMenu";
import MoreMenuItem from "../../../../components/MoreMenuItem";
import UpdateModal from "../../../../components/UpdateModal";
import UpSEO from "../../../../components/up-seo";
import { ProjectModel } from "../../../../models/project";
import { UpdateModel } from "../../../../models/update";
import { UserModel } from "../../../../models/user";
import dbConnect from "../../../../utils/dbConnect";
import { DatedObj, ProjectObj, UpdateObj, UserObj } from "../../../../utils/types";
import { cleanForJSON, fetcher } from "../../../../utils/utils";


const Update = (props: { update: DatedObj<UpdateObj>, user: DatedObj<UserObj>, project: DatedObj<ProjectObj> }) => {
    const [update, setUpdate] = useState<DatedObj<UpdateObj>>(props.update);
    const [iter, setIter] = useState<number>(0);
    const { data: updates, error: updatesError }: SWRResponse<{ data: DatedObj<UpdateObj>[] }, any> = useSWR(`/api/update?id=${update._id}&iter=${iter}`, fetcher);

    useEffect(() => {
        if (updates?.data?.length > 0) setUpdate(updates.data[0]);
    }, [updates])

    // const user = props.user;
    // const project = props.project;

    const user: DatedObj<UserObj> = (updates) ? update.user : null;
    const project: DatedObj<ProjectObj> = (user) ? user.project : null;

    const [editUpdateOpen, setEditUpdateOpen] = useState<boolean>(false);
    const [deleteUpdateOpen, setDeleteUpdateOpen] = useState<boolean>(false);

    const [textIsOpen, setTextIsOpen] = useState<number>(0);
    const handleTextOnClick = (event: any, index: number, currentIsOpen: boolean) => {
        if (currentIsOpen) {
            setTextIsOpen(-1);
        } else {
            setTextIsOpen(index);
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title={update && update.name} projectName={project && project.name} />

            {updates && update && (
                <DeleteModal
                    item={update}
                    itemType="update"
                    isOpen={deleteUpdateOpen}
                    setIsOpen={setDeleteUpdateOpen}
                    setIter={setIter}
                />
            )}

            {updates && update && user && (
                <UpdateModal
                    isOpen={editUpdateOpen}
                    setIsOpen={setEditUpdateOpen}
                    update={update}
                    setIter={setIter}
                    users={[user]}
                    selectionTemplates={user && user.project.selectionTemplateArr}
                    textTemplates={user && user.project.textTemplateArr}
                />
            )}

            <div className="mb-4">
                <InlineButton href="/projects/">Projects</InlineButton>
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
                {project ? <InlineButton href={`/projects/${project && project._id}`}>{project.name}</InlineButton> : <Skeleton width={100} />}
                <span className="mx-1 btm-text-gray-500 font-bold">/</span>
                {user ? <InlineButton href={`/projects/${project && project._id}/${user && user._id}`}>{user.name}</InlineButton> : <Skeleton width={100} />}

            </div>
            <div className="flex items-center mb-9">
                <H1 text={update.name} className="leading-none" />
                <div className="ml-auto flex flex-row items-center gap-3">
                    <MoreMenu>
                        <MoreMenuItem text="Edit" icon={<FiEdit2 />} onClick={() => setEditUpdateOpen(true)} />
                        <MoreMenuItem text="Delete" icon={<FiTrash />} onClick={() => setDeleteUpdateOpen(true)} />
                    </MoreMenu>
                </div>
            </div>
            <div className="md:flex flex-row gap-24">
                <div className="flex-col btm-max-w-s">
                    <div>
                        <p className="text-sm btm-text-gray-400 mb-2">Date</p>
                        <p className="text-xl btm-text-gray-500">{update && format(new Date(update.date), "MMM d, yyyy")}</p>
                    </div>
                    {update && update.selectionArr && update.selectionArr.map(selection => (
                        <div className="mt-9" key={selection._id}>
                            <p className="text-sm btm-text-gray-400 mb-2">{
                                project?.selectionTemplateArr?.find(st => st._id = selection.templateId)?.question
                            }</p>
                            <p className="text-xl btm-text-gray-500">{selection.selected}</p>
                        </div>
                    ))}
                </div>
                <div className="flex-grow">
                    {(updates && update) ? update.textArr && update.textArr.map((text, index) => (
                        <React.Fragment key={text._id}>
                            <hr className="mb-4 mt-6 btm-text-gray-200" />
                            <Accordion
                                className="text-base btm-text-gray-400 mb-2"
                                label={
                                    <div className="flex">
                                        <p>{project?.textTemplateArr?.find(tt => tt._id == text.templateId)?.question}</p>
                                        {textIsOpen == index ? <FaAngleUp className="ml-auto btm-text-gray-400" /> : <FaAngleDown className="ml-auto btm-text-gray-400" />}
                                    </div>
                                }
                                open={true}
                                setOpenState={(event) => handleTextOnClick(event, index, textIsOpen == index)}
                                openState={textIsOpen == index}
                            >
                                <div className="text-base btm-text-gray-600 mb-6 mt-8"><pre>{text.body}</pre></div>
                            </Accordion>
                        </React.Fragment>

                    )) : (
                        <>
                            <Skeleton height={70} count={2} />
                        </>)}
                </div>
            </div>
        </div>
    )
}

export default Update

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return { redirect: { permanent: false, destination: "/auth/sign-in" } };

    const updateId: any = context.params.updateId;
    const userId: any = context.params.userId;
    const projectId: any = context.params.projectId;

    try {
        await dbConnect();

        const thisUpdate = await UpdateModel.findOne({ _id: updateId });
        const thisUser = await UserModel.findOne({ _id: userId });
        const thisProject = await ProjectModel.findOne({ _id: projectId });

        if (!thisProject || !thisUser || !thisUpdate) return { notFound: true };

        return { props: { update: cleanForJSON(thisUpdate), project: cleanForJSON(thisProject), user: cleanForJSON(thisUser) } };
    } catch (e) {
        return { notFound: true };
    }
};