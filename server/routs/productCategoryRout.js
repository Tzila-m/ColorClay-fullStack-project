const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/producrCategoryController");

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/",verifyAdmin, categoryController.createCategory);
router.delete("/:id",verifyAdmin, categoryController.deleteCategory);

module.exports = router;
