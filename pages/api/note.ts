import {NoteModel} from "../../models/note";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import { NoteObj } from "../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.userId || req.query.projectId || req.query.date || req.query.selections || req.query.texts)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};

                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.userId) conditions["userId"] = req.query.userId;
                if (req.query.projectId) {
                    const mongoose = require('mongoose');
                    const id = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = id;
                };
                if (req.query.date) conditions["date"] = req.query.date;
                if (req.query.selections) conditions["selections"] = req.query.selections;
                if (req.query.texts) conditions["texts"] = req.query.texts;
                
                         
                await dbConnect();   
            
                const thisObject = await NoteModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404).json({data: []}); 
                // so if there are no updates, updates.data.length is 0 and "No updates" will be displayed. 
                
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
                    const thisObject = await NoteModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    /* thisObject.userId = req.body.userId;
                    thisObject.date = req.body.date;
                    thisObject.selections = req.body.selections;
                    thisObject.texts = req.body.texts; */
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.userId && req.body.projectId && req.body.name)) {
                        return res.status(406);            
                    }
                    
                    const newNote = new NoteModel({
                        userId: req.body.userId,
                        projectId: req.body.projectId,
                        name: req.body.name,
                    });

                    return res.status(200).json({message: newNote});
                    const savedNote = await newNote.save();
                    return res.status(200).json({message: "Object created", id: savedNote._id.toString()});
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
                               
                const thisObject = await NoteModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await NoteModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
