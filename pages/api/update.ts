import {UpdateModel} from "../../models/update";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import { SelectionModel } from "../../models/selection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.id || req.query.userId || req.query.projectId)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};
                const mongoose = require('mongoose');

                if (req.query.id) {
                    const id = mongoose.Types.ObjectId(`${req.query.id}`);
                    conditions["_id"] = id;
                }
                if (req.query.userId) {
                    const uId = mongoose.Types.ObjectId(`${req.query.userId}`);
                    conditions["userId"] = uId;
                }
                if (req.query.projectId) {
                    const pId = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = pId;
                }
                         
                await dbConnect();   
            
                const thisObject = await UpdateModel.aggregate([
                    {$match: conditions},
                    {
                        $lookup: {
                            from: "selections",
                            localField: "_id",
                            foreignField: "noteId",
                            as: "selectionArr",
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
                    if (!(req.body.userId || req.body.date || req.body.selections || req.body.texts)) {
                        return res.status(406);            
                    }
                    const thisObject = await UpdateModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    /* thisObject.userId = req.body.userId;
                    thisObject.date = req.body.date;
                    thisObject.selections = req.body.selections;
                    thisObject.texts = req.body.texts; */
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.userId && req.body.name && req.body.selections)) {
                        return res.status(406);            
                    }
                    
                    const newNote = new UpdateModel({
                        userId: req.body.userId,
                        name: req.body.name,
                    });
                    const savedNote = await newNote.save();

                    return res.status(200).json({message: "Objects created"})
                    const newSelections = req.body.selections && req.body.selections.map(s => (
                        new SelectionModel({
                            noteId: savedNote._id,
                            templateId: s.templateId,
                            selected: s.selected,                   
                        })
                    ))

                    const savedSelections = await newSelections.map(newSelection => (
                        newSelection.save()
                    ))

                    return res.status(200).json({message: "Objects created", id: [
                        savedNote._id.toString(),
                        savedSelections.map(savedSelection => (
                            savedSelection._id.toString()
                        ))
                    ]});
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
                               
                const thisObject = await UpdateModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await UpdateModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
