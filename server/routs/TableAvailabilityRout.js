const express = require("express")
const router = express.Router()
const tableAvailabilityController = require("../controllers/tableAvailabilityController")

router.get("/getyByDateAndtimeSlots",tableAvailabilityController.getyByDateAndtimeSlot)

router.post("/createTableAvailability",tableAvailabilityController.createTableAvailability)

router.delete("deleteTodayTableAvailabilities" ,tableAvailabilityController.deleteTodayTableAvailabilities)

module.exports=router
