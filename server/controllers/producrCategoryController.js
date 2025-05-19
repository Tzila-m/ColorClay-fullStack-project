const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");

// get
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// get
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findById(id).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

// post
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await ProductCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category with this name already exists" });
    }

    await ProductCategory.create({ name });
    const allCategories = await ProductCategory.find().lean();
    res.status(201).json(allCategories);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// delete
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const result = await Product.deleteMany({ categoryId: id });

    res.status(200).json({
      message: "Category and all related products have been deleted successfully",
      deletedProductsCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
