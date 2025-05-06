const express = require("express")
const router = express.Router()
const tableAvailability = require("../controllers/tableAvailabilityController")

router.get("/getyByDateAndtimeSlot",tableAvailability.getyByDateAndtimeSlot)
router.post("/createTableAvailability", tableAvailability.createTableAvailability)
router.delete("/deleteTodayTableAvailabilities",tableAvailability.deleteTodayTableAvailabilities)

module.exports = router
