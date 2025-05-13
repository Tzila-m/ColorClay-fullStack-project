const express = require("express")
const router = express.Router()
const product = require("../controllers/productController")

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.get("/",product.getAllProducts)
router.get("/:id",product.getProductById)

router.post("/",verifyAdmin,product.createProduct)

router.put("/:id",verifyAdmin,product.updateAvailableProduct)

router.delete("/:id",verifyAdmin,product.deleteProduct)

module.exports=router
