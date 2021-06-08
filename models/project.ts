import mongoose, {Document, Model} from "mongoose";
import {ProjectObj} from "../utils/types";

const ProjectSchema = new mongoose.Schema({
    accountId: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: {type: String, required: false},
    collaborators: { type: [mongoose.Schema.Types.ObjectId], required: true }, 
	featuredQuestions: { type: [mongoose.Schema.Types.ObjectId], required: true },
}, {
    timestamps: true,
});

export const ProjectModel: Model<Document<ProjectObj>> = mongoose.models.project || mongoose.model("project", ProjectSchema);