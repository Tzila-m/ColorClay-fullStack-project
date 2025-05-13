const express = require("express")
const router = express.Router()
const table = require("../controllers/tableController")

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.get("/",table.getAllTables)
router.get("/:id",table.getTableById)

router.post("/",verifyAdmin,table.createTable)

router.delete("/:id",verifyAdmin,table.deleteTable)

module.exports=router
