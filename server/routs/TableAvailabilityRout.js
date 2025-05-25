const express = require("express")
const router = express.Router()
const tableAvailabilityController = require("../controllers/tableAvailabilityController")

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.get("/",tableAvailabilityController.getAvailableTables)

router.get("/ByDate",tableAvailabilityController.getReservationsByDate)

router.delete("/",verifyAdmin,tableAvailabilityController.deleteByDate)  

module.exports=router
