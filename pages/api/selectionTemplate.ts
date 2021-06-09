import {SelectionTemplateModel} from "../../models/selectionTemplate";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.projectId || req.query.question || req.query.options || req.query.required)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};

                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.projectId) {
                    const mongoose = require('mongoose');
                    const id = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = id; // Get all selectionTemplates with this projectId
                };
                if (req.query.question) conditions["question"] = req.query.question;
                if (req.query.options) conditions["options"] = req.query.options;
                if (req.query.required) conditions["required"] = req.query.required;
                
                         
                await dbConnect();   
            
                const thisObject = await SelectionTemplateModel.aggregate([
                    {$match: conditions},
                    
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404);
                
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
                    if (!(req.body.projectId || req.body.question || req.body.options || req.body.required)) {
                        return res.status(406);            
                    }
                    const thisObject = await SelectionTemplateModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    thisObject.projectId = req.body.projectId;
                    thisObject.question = req.body.question;
                    thisObject.options = req.body.options;
                    thisObject.required = req.body.required;
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.projectId && req.body.question && req.body.options && req.body.required)) {
                        return res.status(406);            
                    }
                    
                    const newSelectiontemplate = new SelectionTemplateModel({
                        projectId: req.body.projectId,
                        question: req.body.question,
                        options: req.body.options,
                        required: req.body.required,                             
                    });
                    
                    const savedSelectiontemplate = await newSelectiontemplate.save();
                    
                    return res.status(200).json({message: "Object created", id: savedSelectiontemplate._id.toString()});
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
                               
                const thisObject = await SelectionTemplateModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await SelectionTemplateModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}
