const express = require("express")
const router = express.Router()
const color = require("../controllers/colorController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.get("/",color.getAllColors)
router.get("/:id",color.getColorById)

router.post("/",verifyAdmin,color.createColor)

router.put("/:id",verifyAdmin,color.updateAvailableColor)

router.delete("/:id",verifyAdmin,color.deleteColor)

module.exports=router
