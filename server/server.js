require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require("node-cron");

const dbConnect = require('./config/dbConnect');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT;

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

app.use("/login", require("./routs/authRout"))
app.use("/color", require("./routs/colorRout"))
app.use("/order", require("./routs/orderRout"))
app.use("/product", require("./routs/productRout"))
const tableAvailabilityRout = require('./routs/tableAvailabilityRout');
app.use("/table", require("./routs/tableRout"))
app.use("/user", require("./routs/userRout"))
app.use("/category", require("./routs/productCategoryRout"))
// נצטרך לממש את הפונקציה שתופעל בשעה 12:00 
// const { updateAvailabilityDaily } = require("./services/availabilityManager");

// cron.schedule("0 0 * * *", async () => {
//   await updateAvailabilityDaily();
// });
