import mongoose, {Schema, Model} from "mongoose";

const reqString = {
    type: String,
    required: true,
};

const unreqString = {
    type: String,
    required: false,
};

const commentSchema: Schema = new Schema({
    authorId: mongoose.Schema.Types.ObjectId,
    updateId: mongoose.Schema.Types.ObjectId,
    body: reqString,
    isSubComment: {type: Boolean, required: true},
    parentCommentId: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true,
});


const updateV2Schema: Schema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    body: reqString,
    url: reqString,
    title: unreqString,
    date: Date,
    readBy:  [mongoose.Schema.Types.ObjectId],
    comments: [commentSchema],
}, {
    timestamps: true,
});


export const updateModel = mongoose.models.update || mongoose.model('update', updateV2Schema);
