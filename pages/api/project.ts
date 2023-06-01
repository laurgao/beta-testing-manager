import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { AccountModel } from "../../models/account";
import { ProjectModel } from "../../models/project";
import { SelectionTemplateModel } from "../../models/selectionTemplate";
import { TextTemplateModel } from "../../models/textTemplate";
import { UpdateModel } from "../../models/update";
import { UserModel } from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import { getCurrUserRequest } from "../../utils/requests";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403).json({ error: "You must be signed in to do that." });

            try {
                await dbConnect();
                const userData = await AccountModel.findOne({ email: session.user.email });
                let conditions = {};
                const mongoose = require('mongoose');

                if (req.query.id) {
                    const id = new mongoose.Types.ObjectId(req.query.id);
                    conditions["_id"] = id; // Get all projects with this id
                } else {
                    // const id = mongoose.Types.ObjectId(`${userData._id}`);
                    conditions["accountId"] = userData._id; // Get all projects with this userid
                }

                const thisObject = await ProjectModel.aggregate([ // aggregate returns an array of objecs.
                    { $match: conditions },
                    {

                        $lookup: {
                            from: "users",
                            // localField: "_id",
                            // foreignField: "projectId",
                            let: { "projectId": "$_id" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$projectId", "$$projectId"] },] } } },
                                {
                                    $lookup: {
                                        from: "updates",
                                        let: { "userId": "$_id" }, // Local field (user field)
                                        pipeline: [
                                            { $match: { $expr: { $and: [{ $eq: ["$userId", "$$userId"] },] } } },
                                            {
                                                $lookup: {
                                                    from: "selections",
                                                    localField: "_id", // Update field
                                                    foreignField: "noteId", //  Selection field
                                                    as: "selectionArr",
                                                }
                                            },
                                        ],
                                        as: "updateArr", // you want the selection of the latest update
                                    },
                                },
                            ],
                            as: "userArr", // if no users, returns userArr is an empty array.
                        }
                    },
                    {
                        $lookup: {
                            from: "selectiontemplates",
                            localField: "_id",
                            foreignField: "projectId",
                            as: "selectionTemplateArr",
                        }
                    },
                    {
                        $lookup: {
                            from: "texttemplates",
                            localField: "_id",
                            foreignField: "projectId",
                            as: "textTemplateArr",
                        }
                    },
                ]);

                if (!thisObject || !thisObject.length) return res.status(200).json({ data: [] });

                thisObject.map(project => {
                    project["updates"] = [];
                    project.userArr.map(user => {
                        user.updateArr.map(update => {
                            project["updates"].push(update);
                        })
                        project["updates"].sort((a, b) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
                        project["latestUpdate"] = project.updates[0]
                    })
                })


                return res.status(200).json({ data: thisObject });
            } catch (e) {
                return res.status(500).json({ error: e }); // if I see internal server error in console.log, that means we're going here.                     
            }
        }

        case "POST": {
            const session = await getSession({ req });

            if (!session) return res.status(403).json({ error: "You must be signed in to do that." });
            try {
                await dbConnect();
                const userData = await AccountModel.findOne({ email: session.user.email });

                if (req.body.id) {
                    if (!(req.body.name || req.body.description || req.body.collaborators || req.body.featuredQuestions)) {
                        return res.status(406).json({ error: "You must provide at least one field to update." });
                    }
                    const thisObject = await ProjectModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);

                    thisObject.name = req.body.name;
                    thisObject.description = req.body.description || "";
                    if (req.body.collaborators) thisObject.collaborators = req.body.collaborators;
                    if (req.body.featuredQuestions) thisObject.featuredQuestions = req.body.featuredQuestions;

                    await thisObject.save();

                    return res.status(200).json({ message: "Object updated" });
                } else {
                    if (!(req.body.name)) {
                        return res.status(406).json({ error: "You must provide a project name." });
                    }

                    const newProject = new ProjectModel({
                        accountId: userData._id,
                        name: req.body.name,
                        description: req.body.description || ""
                    });

                    const savedProject = await newProject.save(); // these are already typed, you don't need to type them.

                    const defaultSelectionTemplate = new SelectionTemplateModel({
                        projectId: savedProject._id,
                        question: `How dissatisfied would you be if you could no longer use ${req.body.name}?`,
                        options: ["Very dissatisfied", "Somewhat dissatisfied", "Not dissatisfied"],
                        required: false,
                    });

                    const savedDefaultSelectionTemplate = await defaultSelectionTemplate.save();

                    const defaultTextTemplate = new TextTemplateModel({
                        projectId: savedProject._id,
                        question: `What's the main benefit you get from using ${req.body.name}?`,
                        required: false,
                    });

                    const defaultTextTemplate2 = new TextTemplateModel({
                        projectId: savedProject._id,
                        question: `Notes`,
                        required: false,
                    });

                    const savedDefaultTextTemplate = await defaultTextTemplate.save();
                    const savedDefaultTextTemplate2 = await defaultTextTemplate2.save();

                    return res.status(200).json({
                        message: "Objects created",
                        id: [
                            savedProject._id.toString(),
                            savedDefaultSelectionTemplate._id.toString(),
                            savedDefaultTextTemplate._id.toString(),
                            savedDefaultTextTemplate2._id.toString()
                        ]
                    });
                }
            } catch (e) {
                return res.status(500).json({ error: e });
            }
        }

        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403);

            if (!req.body.id) return res.status(406);

            try {
                await dbConnect();

                const thisObject = await ProjectModel.findById(req.body.id);

                if (!thisObject) return res.status(404).json({ message: "No project found with given ID." });
                const thisAccount = await getCurrUserRequest(session.user.email)
                if (thisObject.accountId.toString() !== thisAccount._id.toString()) return res.status(403).json({ message: "You do not have permission to delete this project." });

                await ProjectModel.deleteOne({ _id: req.body.id });

                const users = await UserModel.find({ projectId: req.body.id })

                if (users) {
                    await UserModel.deleteMany({ projectId: req.body.id });
                    await users.map(user => (
                        UpdateModel.deleteMany({ userId: user._id })
                    ))
                }

                return res.status(200).json({ message: "Project successfully deleted" });
            } catch (e) {
                return res.status(500).json({ error: e });
            }
        }

        default:
            return res.status(405);
    }
}