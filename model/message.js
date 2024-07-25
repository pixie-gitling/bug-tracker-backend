const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    reportId: { 
        type: Schema.Types.ObjectId, 
        ref: 'BugReport' 
    },
    sender: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User'
    },
    content: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Message', MessageSchema);