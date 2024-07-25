const express = require('express');
const message = express.Router();
const { getMessages, postMessage, getMessagesOnForum, postMessageOnForum } = require('../controllers/message');

message.get('/forum', getMessagesOnForum);
message.post('/postForum', postMessageOnForum);

message.get('/bug/:reportId/messages', getMessages);
message.post('/bug/:reportId/message', postMessage);

module.exports = message;