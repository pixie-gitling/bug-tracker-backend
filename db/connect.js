const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Database Connected ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit(1)
    }
}

module.exports = connectDb