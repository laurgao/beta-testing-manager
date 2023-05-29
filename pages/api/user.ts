import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { ProjectModel } from "../../models/project";
import { UpdateModel } from "../../models/update";
import { UserModel } from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import { getCurrUserRequest } from "../../utils/requests";
import { UpdateObj, UserGraphObj } from "../../utils/types";
import { cleanForJSON } from "../../utils/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.id || req.query.projectId)) {
                return res.status(406);
            }

            try {
                let conditions = {};

                const mongoose = require('mongoose');

                try {
                    if (req.query.id) {
                        const id = mongoose.Types.ObjectId(`${req.query.id}`);
                        conditions["_id"] = id;
                    }
                    if (req.query.projectId) {
                        // console.log(req.query.projectId)
                        if (mongoose.Types.ObjectId.isValid(req.query.projectId)) {
                            console.log("valid", req.query.projectId)
                            var objectId = mongoose.Types.ObjectId(req.query.projectId)
                            conditions["projectId"] = objectId;
                        } else {
                            return res.status(406).json({ error: "Invalid project ID" })
                        }
                        // const pId = mongoose.Types.ObjectId(`${req.query.projectId}`);
                        // conditions["projectId"] = pId;
                        // conditions["projectId"] = req.query.projectId;
                    }
                } catch (err) {
                    console.log(err)
                    // return res.status(200)
                }

                await dbConnect();

                const thisObject = await UserModel.aggregate([
                    { $match: conditions },
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
                                {
                                    $lookup: {
                                        from: "texts",
                                        localField: "_id", // Update field
                                        foreignField: "noteId", //  Selection field
                                        as: "textArr",
                                    }
                                },
                                {
                                    $sort: {
                                        'date': -1
                                    },
                                }
                            ],
                            as: "updateArr", // you want the selection of the latest update
                        },
                    },
                    {
                        $lookup: {
                            from: "projects",
                            // localField: "projectId",
                            // foreignField: "_id",
                            let: { "id": "$projectId" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$_id", "$$id"] },] } } },
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
                            ],
                            as: "projectArr",
                        },
                    },
                    { $unwind: "$project" },
                ]);
                // Sort users by date of latest update. If user has no update, sort by user joining date.
                thisObject.sort((a, b) => { return new Date(b.updateArr[0] ? b.updateArr[0].date : b.date).getTime() - new Date(a.updateArr[0] ? a.updateArr[0].date : b.date).getTime() });

                console.log(thisObject, conditions);

                // return res.status(200).json({ message: "valid" }) // this works
                const thisProject = thisObject.length > 0 ? thisObject[0].projectArr[0] : await ProjectModel.findById(req.query.projectId);
                const selectionTemplates = thisProject.selectionTemplateArr
                const textTemplates = thisProject.textTemplateArr

                // Get all the updates of all the users
                // let updates = [];
                // thisObject.map((user) => (
                //     user.updateArr.map((update) => {
                //         updates.push(update);
                //     })
                // ))
                let updates;
                try {
                    updates = thisObject.reduce((accumulator, userObject: UserGraphObj) => {
                        let userUpdates = Object.values(userObject)[0].updateArr;
                        return accumulator.concat(userUpdates);
                    }, []);
                } catch (e) {
                    console.log(e);
                    updates = [];
                }

                // If there are no users, users.data.length is 0 and "No updates" will be displayed. 
                if (!thisObject || !thisObject.length) return res.status(404).json({ data: [] });

                // Sort all updates by date
                updates.sort((a: UpdateObj, b: UpdateObj) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });

                return res.status(200).json({
                    userData: cleanForJSON(thisObject),
                    updateData: cleanForJSON(updates),
                    projectData: cleanForJSON(thisProject),
                    selectionTemplateData: cleanForJSON(selectionTemplates),
                    textTemplateData: cleanForJSON(textTemplates)
                });
            } catch (e) {
                Error.stackTraceLimit = 20; // or whatever number you want
                console.error(e)
                return res.status(500).json({ error: e });
            }
        }

        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();

                if (req.body.id) {
                    if (!(req.body.email || req.body.name || req.body.date || req.body.projectId)) {
                        return res.status(406);
                    }
                    const thisObject = await UserModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);

                    thisObject.email = req.body.email;
                    thisObject.name = req.body.name;
                    thisObject.projectId = req.body.projectId;
                    thisObject.date = req.body.date;

                    await thisObject.save();

                    return res.status(200).json({ message: "Object updated" });
                } else {
                    if (!(req.body.name && req.body.projectId && req.body.date)) {
                        return res.status(406);
                    }

                    const newUser = new UserModel({
                        name: req.body.name,
                        date: req.body.date,
                        projectId: req.body.projectId,
                    });

                    if (req.body.email) newUser.email = req.body.email;

                    const savedUser = await newUser.save();

                    return res.status(200).json({ message: "Object created", id: savedUser._id.toString() });
                }
            } catch (e) {
                return res.status(500).json({ message: e });
            }
        }

        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403);

            if (!req.body.id) return res.status(406);

            try {
                await dbConnect();

                const thisObject = await UserModel.findById(req.body.id);

                const mongoose = require('mongoose');
                let conditions = {};
                const id = mongoose.Types.ObjectId(`${req.body.id}`);
                conditions["_id"] = id;

                const thisUser = await UserModel.aggregate([
                    { $match: conditions },
                    {
                        $lookup: {
                            from: "projects",
                            localField: "projectId",
                            foreignField: "_id",
                            as: "projectArr",
                        }
                    }
                ])

                if (!thisUser[0]) return res.status(404);

                // const thisProject = await ProjectModel.findById(thisObject.projectId) // can I do lookups instead
                const accountId = thisUser[0].projectArr[0].accountId;
                const thisAccount = await getCurrUserRequest(session.user.email)
                if (accountId.toString() !== thisAccount._id.toString()) return res.status(403).json({ message: "You do not have permission to delete this project." });

                await UserModel.deleteOne({ _id: req.body.id });
                await UpdateModel.deleteMany({ userId: req.body.id });

                return res.status(200).json({ message: "User successfully deleted" });
            } catch (e) {
                return res.status(500).json({ message: e });
            }
        }

        default:
            return res.status(405);
    }
}
