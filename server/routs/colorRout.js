const express = require("express")
const router = express.Router()
const color = require("../controllers/colorController")

router.get("/getAllColors",color.getAllColors)
router.get("/getColorById:id",color.getColorById)

router.post("/createColor",color.createColor)

router.put("updateAvailableColor:id",color.updateAvailableColor)

router.delete("deletColor:id" ,color.deletColor)

module.exports=router
