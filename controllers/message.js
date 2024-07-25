const Message = require('../model/message');
const Users = require('../model/users');

exports.getMessagesOnForum = async (req, res) => {
    try {
        const messages = await Message.find({ reportId: { $exists: false } }).sort('createdAt');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.postMessageOnForum = async (req, res) => {
    const { sender, content } = req.body;

    if (!sender || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newMessage = new Message({ sender, content });
        const savedMessage = await newMessage.save();
        res.json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ reportId: req.params.reportId }).sort('createdAt');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.postMessage = async (req, res) => {
    const {sender, content} = req.body
    try {
        const message = new Message({
            reportId: req.params.reportId,
            sender,
            content
        });

        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};