import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { SelectionModel } from "../../models/selection";
import { TextModel } from "../../models/text";
import { UpdateModel } from "../../models/update";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403).json({ error: "You must be signed in to view this page." });
            if (!(req.query.id || req.query.userId || req.query.projectId)) {
                return res.status(406).json({ error: "You must provide an update id, userId, or projectId." });
            }

            try {
                let conditions = {};
                const mongoose = require('mongoose');

                if (req.query.id) {
                    const id = new mongoose.Types.ObjectId(`${req.query.id}`);
                    conditions["_id"] = id;
                }
                if (req.query.userId) {
                    const uId = new mongoose.Types.ObjectId(`${req.query.userId}`);
                    conditions["userId"] = uId;
                }
                if (req.query.projectId) {
                    const pId = new mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = pId;
                }

                await dbConnect();

                const thisObject = await UpdateModel.aggregate([
                    { $match: conditions },
                    {
                        $lookup: {
                            from: "selections",
                            localField: "_id",
                            foreignField: "noteId",
                            as: "selectionArr",
                        }
                    },
                    {
                        $lookup: {
                            from: "texts",
                            localField: "_id",
                            foreignField: "noteId",
                            as: "textArr",
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { "id": "$userId" },
                            pipeline: [
                                { $match: { $expr: { $and: [{ $eq: ["$_id", "$$id"] },] } } },
                                {
                                    $lookup: {
                                        from: "projects",
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
                                        as: "project",
                                    }
                                },
                                { $unwind: "$project" }
                            ],
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                ]);

                // If there are no users, users.data.length is 0 and "No updates" will be displayed. 
                if (!thisObject || !thisObject.length) return res.status(404).json({ data: [] });

                return res.status(200).json({ data: thisObject });
            } catch (e) {
                return res.status(500).json({ message: e });
            }
        }

        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();

                if (req.body.id) {
                    if (!(req.body.userId || req.body.date || req.body.selections || req.body.texts || req.body.name)) {
                        return res.status(406);
                    }
                    const thisObject = await UpdateModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);

                    thisObject.userId = req.body.userId;
                    thisObject.name = req.body.name;
                    thisObject.date = req.body.date;

                    await thisObject.save();

                    const newTexts = req.body.texts && req.body.texts.map(s => (
                        new TextModel({
                            noteId: req.body.id,
                            templateId: s.templateId,
                            body: s.body,
                        })

                    ));
                    await TextModel.deleteMany({ noteId: req.body.id });
                    await newTexts.map(newText => (newText.save()));

                    const newSelections = req.body.selections && req.body.selections.map(s => (
                        new SelectionModel({
                            noteId: req.body.id,
                            templateId: s.templateId,
                            selected: s.selected,
                        })
                    ));
                    await SelectionModel.deleteMany({ noteId: req.body.id });

                    const savedSelections = await newSelections.map(newSelection => (newSelection.save()))

                    return res.status(200).json({ message: "Update successfully updated" });


                    // const selections = SelectionModel.find({ noteId: req.body.id });
                    // selections.map(s => (
                    //     s.selected = req.body.selections.filter(selection => selection.templateId == s.templateId)[0].selected // can you use map to modify properties like this
                    // ))
                    // await selections.map(s => (
                    //     s.save()
                    // ))

                } else {
                    if (!(req.body.userId && req.body.name && req.body.date && req.body.selections)) {
                        return res.status(406);
                    }

                    const newNote = new UpdateModel({
                        userId: req.body.userId,
                        name: req.body.name,
                        date: req.body.date,
                    });

                    const savedNote = await newNote.save();

                    const newSelections = req.body.selections && req.body.selections.map(s => (
                        new SelectionModel({
                            noteId: savedNote._id,
                            templateId: s.templateId,
                            selected: s.selected,
                        })
                    ));

                    const newTexts = req.body.texts && req.body.texts.map(s => (
                        new TextModel({
                            noteId: savedNote._id,
                            templateId: s.templateId,
                            body: s.body,
                        })
                    ));


                    const savedSelections = await newSelections.map(newSelection => (newSelection.save()))
                    const savedTexts = await newTexts.map(newText => (newText.save()))

                    // if (newSelections) newNote.selections = newSelections.map(s => (s._id));
                    // if (newTexts) newNote.texts = newSelections.map(t => (t._id));

                    return res.status(200).json({ message: "Objects created", id: savedNote._id, selections: newSelections });
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

                const thisObject = await UpdateModel.findById(req.body.id);

                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);

                await UpdateModel.deleteOne({ _id: req.body.id });
                await TextModel.deleteMany({ noteId: req.body.id });
                await SelectionModel.deleteMany({ noteId: req.body.id });


                return res.status(200).json({ message: "Object deleted" });
            } catch (e) {
                return res.status(500).json({ message: e });
            }
        }

        default:
            return res.status(405);
    }
}
