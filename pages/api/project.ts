import {ProjectModel} from "../../models/project";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import { getCurrUserRequest } from "../../utils/requests";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": { 
            const session = await getSession({ req });
            const userData = await getCurrUserRequest(session.user.email); 
            if (!session) return res.status(403);       
            
            try {                
                let conditions = {};

                const mongoose = require('mongoose');
                const id = mongoose.Types.ObjectId(`${userData._id}`);
                conditions["accountId"] = id; // Get all projects with this userid
                         
                await dbConnect();   
            
                const thisObject = await ProjectModel.aggregate([ // aggregate returns an array of objecs.
                    {$match: conditions},                    
                ]);
                
                if (!thisObject || !thisObject.length) return res.status(404);
                
                return res.status(200).json({data: thisObject});
            } catch (e) {
                return res.status(500).json({message: e}); // if I see internal server error in console.log, that means we're going here.                     
            }
        }
            
        case "POST": {
            const session = await getSession({ req });
            const userData = await getCurrUserRequest(session.user.email); 
            if (!session) return res.status(403);
            try {
                await dbConnect();
                
                if (req.body.id) {
                    if (!(req.body.accountId || req.body.name || req.body.description || req.body.collaborators || req.body.featuredQuestions)) {
                        return res.status(406);            
                    }
                    const thisObject = await ProjectModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);
                    
                    /* thisObject.accountId = req.body.accountId;
                    thisObject.name = req.body.name;
                    thisObject.description = req.body.description;
                    thisObject.collaborators = req.body.collaborators;
                    thisObject.featuredQuestions = req.body.featuredQuestions; */
                    
                    await thisObject.save();
                    
                    return res.status(200).json({message: "Object updated"});                            
                } else {
                    if (!(req.body.name)) {
                        return res.status(406);            
                    }   
                    
                    const newProject = new ProjectModel({
                        accountId: userData._id, 
                        name: req.body.name,
                        description: req.body.description || ""                            
                    });
                    
                    const savedProject = await newProject.save();
                    
                    return res.status(200).json({message: "Object created", id: savedProject._id.toString()});
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
                               
                const thisObject = await ProjectModel.findById(req.body.id);
                
                if (!thisObject) return res.status(404);
                // if (thisObject.userId.toString() !== session.userId) return res.status(403);
                
                await ProjectModel.deleteOne({_id: req.body.id});
                
                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        
        default:
            return res.status(405);
    }
}