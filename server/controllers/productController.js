const Product = require("../models/Product")

//get
exports.getAllProducts = async (req, res) => {

    const products = await Product.find()
    res.status(201).json(products)

}

exports.getProductById = async(req,res) =>{

    const { _id } = req.params
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })

    const product = await Product.findById(_id)
    if (!product)
        return res.status(400).json({ message: "Product not found" })

    res.status(201).json(product)
}

//post
exports.createProduct = async (req, res) => {
    const { name, code,price, imageUrl,categoryId } = req.body
    if (!name || !code ||!price)
        return res.status(400).json({ message: "Please fill all fields" })

    const isExist = await Product.find({code})
    if(isExist)
        return res.status(400).json({ message: "code product exist" })

    const product = Product.create({  name, code,price, imageUrl,categoryId })
    if (!product)
        return res.status(400).json({ message: "Error creating product" })

    const products = await Product.find()
    res.status(201).json(products)
}

//put
exports.updateAvailableProduct = async (req, res) => {
    const { _id } = req.params

    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })

    const product = await Product.findById(_id)
    if (!product)
        return res.status(400).json({ message: "Product not found" })

    product.isAvailable = !product.isAvailable
    await product.save()

    const products = await Product.find()
    res.status(201).json(products)

}

//delete
exports.deleteProduct = async (req, res) => {
    const { _id } = req.params
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })

    await Product.deleteOne({ _id });

    const products = await Product.find()
    res.status(201).json(products)

}


