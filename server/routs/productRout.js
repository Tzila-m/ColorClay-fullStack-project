const express = require("express")
const router = express.Router()
const product = require("../controllers/productController")

router.get("/getAllProducts",product.getAllProducts)
router.get("/getProductById/:id",product.getProductById)
router.post("/createProduct", product.createProduct)
router.put("/updateAvailableProduct",product.updateAvailableProduct)
router.delete("/deletaProduct/:id",product.deleteProduct)

module.exports = router
