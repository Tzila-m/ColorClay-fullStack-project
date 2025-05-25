const mongoose = require("mongoose")

const Product = require("../models/Product");


//get 
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
}


exports.getProductByCategory = async (req, res) => {
    try {
          console.log('Category ID:', req.params.id)
        const { categoryId } = req.params;
        console.log("Category ID:", categoryId);

        if (!categoryId)
            return res.status(400).json({ message: "Please fill categoryId" });

        const products = await Product.find({
            categoryId: new mongoose.Types.ObjectId(categoryId),
        });

        console.log("Products found:", products);


        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





//post
exports.createProduct = async (req, res) => {
    const { name, code, price, imageUrl, categoryId } = req.body;

    if (!name || !code || !price || !categoryId)
        return res.status(400).json({ message: "Please fill all fields" });

    const isExist = await Product.findOne({ code });
    if (isExist)
        return res.status(400).json({ message: "code product exist" });

    if (!mongoose.Types.ObjectId.isValid(categoryId))
        return res.status(400).json({ message: "Invalid categoryId" });

    const product = await Product.create({
        name,
        code,
        price,
        imageUrl,
        categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    if (!product)
        return res.status(500).json({ message: "Error creating product" });

    const products = await Product.find();
    res.status(201).json(products);
};


//put
exports.updateAvailableProduct = async (req, res) => {
    try {
        const _id = req.params.id;
        
        if (!_id)
            return res.status(400).json({ message: "Please provide ID" });

        const product = await Product.findById(_id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        product.isAvailable = !product.isAvailable;
        await product.save();

        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error updating product availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//delete
exports.deleteProduct = async (req, res) => {
    const _id = req.params.id
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })
    await Product.deleteOne({ _id });
    const products = await Product.find();
    res.status(200).json(products);
}