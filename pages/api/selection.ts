import {SelectionModel} from "../../models/selection";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.noteId || req.query.projectId || req.query.templateId || req.query.selected)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};
                const mongoose = require('mongoose');

                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.noteId) {
                    const id = mongoose.Types.ObjectId(`${req.query.noteId}`);
                    conditions["noteId"] = id;
                }
                if (req.query.projectId) {
                    const pId = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = pId;
                }
                
                if (req.query.templateId) conditions["templateId"] = req.query.templateId;
                if (req.query.selected) conditions["selected"] = req.query.selected;
                
                         
                await dbConnect();   
            
                const thisObject = await SelectionModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
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
                    if (!(req.body.noteId || req.body.templateId || req.body.selected)) {
                        return res.status(406);            
                    }
                    const thisObject = await SelectionModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    thisObject.noteId = req.body.noteId;
                    thisObject.templateId = req.body.templateId;
                    thisObject.selected = req.body.selected;
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.noteId && req.body.templateId && req.body.selected && req.body.projectId)) {
                        return res.status(406);            
                    }
                    
                    const newSelection = new SelectionModel({
                        noteId: req.body.noteId,
                        templateId: req.body.templateId,
                        selected: req.body.selected,
                        projectId: req.body.projectId                             
                    });
                    
                    const savedSelection = await newSelection.save();
                    
                    return res.status(200).json({message: "Object created", id: savedSelection._id.toString()});
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
                               
                const thisObject = await SelectionModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await SelectionModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
