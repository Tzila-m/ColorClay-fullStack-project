const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT); 


// GET 
router.get("/",verifyAdmin, userController.getAllUsers)


// GET 
router.get("/:id", userController.getUserById)


// PUT 
router.put("/:id", userController.updateUser)

module.exports = router