import {UserModel} from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";

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

                if (req.query.id) {
                    const id = mongoose.Types.ObjectId(`${req.query.id}`);
                    conditions["_id"] = id;
                }
                if (req.query.projectId) {
                    const pId = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = pId;
                }

                await dbConnect();   
            
                const thisObject = await UserModel.aggregate([
                    {$match: conditions},
                    {
                        $lookup: {
                            from: "updates",
                            let: {"userId": "$_id"}, // Local field (user field)
                            pipeline: [
                                {$match: {$expr: {$and: [{$eq: ["$userId", "$$userId"]}, ]}}},
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
                            ],
                            as: "updateArr", // you want the selection of the latest update
                        }
                    },
                    {
                        $lookup: {
                            from: "projects",
                            // localField: "projectId",
                            // foreignField: "_id",
                            let: {"id": "$projectId"},
                            pipeline: [
                                {$match: {$expr: {$and: [{$eq: ["$_id", "$$id"]}, ]}}},
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
                        }
                    }
                ]);
                
                // If there are no users, users.data.length is 0 and "No updates" will be displayed. 
                if (!thisObject || !thisObject.length) return res.status(404).json({data: []});
                
                return res.status(200).json({data: thisObject});
            } catch (e) {
                return res.status(500).json({message: e});                        
            }
        }
            
        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();
                
                if (req.body.id) {
                    if (!(req.body.email || req.body.name || req.body.projectId)) {
                        return res.status(406);            
                    }
                    const thisObject = await UserModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    /* thisObject.email = req.body.email;
                    thisObject.name = req.body.name;
                    thisObject.projectId = req.body.projectId;*/
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.name && req.body.projectId)) {
                        return res.status(406);            
                    }
                    
                    const newUser = new UserModel({
                        name: req.body.name,
			            projectId: req.body.projectId,                
                    });

                    if (req.body.email) newUser.email = req.body.email;
                    
                    const savedUser = await newUser.save();
                    
                    return res.status(200).json({message: "Object created", id: savedUser._id.toString()});
                }            
            } catch (e) {
                return res.status(500).json({message: e});            
            }
        }
        
        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            
            if (!req.body.id) return res.status(406);
            
            try {
                await dbConnect();
                               
                const thisObject = await UserModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await UserModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
