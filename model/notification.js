const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    redirect: {
        type: String,
        required: true
    },
    recipents: {
        type: [String]
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;