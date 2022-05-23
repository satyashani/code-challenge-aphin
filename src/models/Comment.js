var mongoose = require("./mongoose");
var Schema = mongoose.Schema;

const Comment = new Schema({
    hashTags    : [ String ],
    mentions    : [ String ],
    text        : String,
    timestamp   : Schema.Types.Date,
    userId      : {type: Schema.Types.ObjectId, ref: 'User'}
},{ timestamps: true });

Comment.index({userId : 1});

exports.schema = Comment;
exports.model = mongoose.model("Comment",Comment);