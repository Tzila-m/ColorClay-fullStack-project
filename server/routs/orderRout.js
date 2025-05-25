const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.post("/", orderController.createOrder);
router.post("/", orderController.createOrder);
router.put("/addProductsAndColors/:orderId", orderController.addProductsAndColors);
router.put("/confirmOrderPayment/:orderId", orderController.confirmOrderPayment);
router.put("/markOrderReady/:orderId",verifyAdmin, orderController.markOrderReady);
router.get("/:id", orderController.getOrderById);
module.exports = router;