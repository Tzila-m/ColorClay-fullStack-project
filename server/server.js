require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const dbConnect = require('./config/dbConnect')

const app = express()
const PORT = process.env.PORT || 1100

dbConnect()

app.use(cors(corsOptions))
app.use(express.json)
app.use(express.static("public"))

// const cron = require("node-cron")
// const { updateAvailabilityDaily } = require("./services/availabilityManager")


mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
})


// cron.schedule("0 0 * * *", async () => {//בלילה הפעלת הפונקציה כל יום בחצות
//   await updateAvailabilityDaily();
// });


mongoose.connection.on('error', err => {
    console.log(err)
})

