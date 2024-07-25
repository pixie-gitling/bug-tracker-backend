// routes/notificationRoutes.js
const express = require('express');
const notificationRouter = express.Router();
const { getNotifications, createNotification } = require('../controllers/notification');

notificationRouter.get('/notifications', getNotifications);
notificationRouter.post('/notifications', createNotification);

module.exports = notificationRouter;