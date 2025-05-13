require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require("node-cron");

const dbConnect = require('./config/dbConnect');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 5001;

dbConnect();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
})

// נצטרך לממש את הפונקציה שתופעל בשעה 12:00 
// const { updateAvailabilityDaily } = require("./services/availabilityManager");

// cron.schedule("0 0 * * *", async () => {
//   await updateAvailabilityDaily();
// });
