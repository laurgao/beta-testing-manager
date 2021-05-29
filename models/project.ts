import mongoose, {Document, Model} from "mongoose";
import {ProjectObj} from "../utils/types";

const ProjectSchema = new mongoose.Schema({
    accountId: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String, required: false},
    collaborators: [mongoose.Schema.Types.ObjectId],
    featuredQuestions: [mongoose.Schema.Types.ObjectId],
}, {
    timestamps: true,
});

export const ProjectModel: Model<Document<ProjectObj>> = mongoose.models.project || mongoose.model("project", ProjectSchema);