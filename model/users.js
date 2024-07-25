const { default: mongoose } = require("mongoose");

const signupSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    role : {
        type: String,
    },
    image : {
        type: String,
    }
},{timestamps:true})

const Users = new mongoose.model("users", signupSchema)

module.exports = Users