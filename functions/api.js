require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('../db/connect');
const userRouter = require('../routes/users');
const reportsRouter = require('../routes/reports');
const messageRouter = require('../routes/message');
const notificationRouter = require('../routes/notification');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://master--beamish-arithmetic-22778c.netlify.app'
];

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;

// Connect to MongoDB database
connectDb();

app.get('/', (req, res) => {
    res.send('<h1>Server Live</h1>');
});

app.use('/users', userRouter);
app.use('/report', reportsRouter);
app.use('/message', messageRouter);
app.use('/notification', notificationRouter);

module.exports.handler = serverless(app);
