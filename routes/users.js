const express = require('express')
const { login, signup, getProfile, getAllUsers, signupAdmin, loginAdmin, updateUser } = require('../controllers/users')
const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.get("/:userId", getProfile)

userRouter.put("/:userId", updateUser)

userRouter.post("/login", login)
userRouter.post("/signup", signup)

// userRouter.post("/admin/login", loginAdmin)
// userRouter.post("/admin/signup", signupAdmin)

module.exports = userRouter