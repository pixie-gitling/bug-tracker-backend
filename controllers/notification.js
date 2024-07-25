const Notification = require('../model/notification');
const User = require('../model/users')

exports.getNotifications = async (req, res) => {
    try {
        const {username} = req.query;
        const notifications = await Notification.find({recipents: username}).sort('-time');
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createNotification = async (req, res) => {
    const { message, type, redirect, sender } = req.body;
    try {
        const users = await User.find({username: {$ne: sender}});
        const recipents = users.map(user => user.username);
        
        const newNotification = new Notification({ message, type, redirect, recipents });
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};