const express = require("express")
const router = express.Router()
const product = require("../controllers/productController")

router.get("/getAllProducts",color.getAllProducts)
router.get("/getProductById:id",color.getProductById)

router.post("/createProduct",color.createProduct)

router.put("updateAvailableProduct:id",color.updateAvailableProduct)

router.delete("deleteProduct:id" ,color.deleteProduct)

module.exports=router
