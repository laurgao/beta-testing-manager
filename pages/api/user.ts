import {UserModel} from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import { UserObj } from "../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {    
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            if (!(req.query.email || req.query.name || req.query.projectId)) {
                return res.status(406);                        
            }
            
            try {                
                let conditions = {};

                if (req.query.id) conditions["_id"] = req.query.id;
                if (req.query.email) conditions["email"] = req.query.email;
                if (req.query.name) conditions["name"] = req.query.name;
                if (req.query.projectId) {
                    const mongoose = require('mongoose');
                    const id = mongoose.Types.ObjectId(`${req.query.projectId}`);
                    conditions["projectId"] = id;
                }
                         
                await dbConnect();   
            
                const thisObject = await UserModel.aggregate([
                    {$match: conditions},
                    
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
