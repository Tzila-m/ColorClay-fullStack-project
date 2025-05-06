const express = require("express")
const router = express.Router()
const table = require("../controllers/tableController")

router.get("/getAllTables",table.getAllTables)
router.get("/getTableById/:id",table.getColorById)
router.post("/createTable", table.createTable)
router.delete("/deletaTable/:id",table.deleteTable)

module.exports = router
