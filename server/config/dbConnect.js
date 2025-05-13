const mongoose = require("mongoose")

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (err) {
        console.error("*error connection to DB*\n" + err)
    }
}

module.exports = dbConnect