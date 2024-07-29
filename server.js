require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDb = require('./db/connect')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/users')
const reportsRouter = require('./routes/reports')
const messageRouter = require('./routes/message')
const notificationRouter = require('./routes/notification')

const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

const PORT = process.env.PORT || 8000;

//connect to mongodb database
connectDb()

app.get('/', (req,res) => {
    res.send('<h1>Server Live<h1/>')
})
app.use("/users", userRouter)
app.use("/report", reportsRouter)
app.use("/message", messageRouter)
app.use("/notification", notificationRouter)

app.listen(process.env.PORT || PORT , () => {
    console.log(`Server Running on ${process.env.PORT}`);
}) 