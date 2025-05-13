const express = require("express")
const router = express.Router()
const table = require("../controllers/tableController")

router.get("/getAllTables",table.getAllTables)
router.get("/getTableById:id",table.getTableById)

router.post("/createtable",table.createtable)

router.delete("deletetable:id" ,table.deletetable)

module.exports=router
