const mongoose = require("mongoose");

const reportHistorySchema = new mongoose.Schema({
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },
    previousData: {
        type: Object,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});



const reportSchema = new mongoose.Schema({
    User : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    fileAttached : {
        type: String,
        // required: true
    },
    severity : {
        type : String,
        default : "Low"
    },
    assignedTo : {
        type : String,
        default : "None"
    },
    status : {
        type : String,
        default : "Reported"
    },
    remark : {
        type : String
    },
},{timestamps:true})

const Reports = new mongoose.model("reports", reportSchema)
const ReportHistory = new mongoose.model('ReportHistory', reportHistorySchema);

module.exports = {Reports, ReportHistory}