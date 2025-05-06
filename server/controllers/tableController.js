const Table = require("../models/Table")

//get
exports.getAllTables = async (req, res) => {

    const tables = await Table.find()
    res.status(201).json(tables)
}

exports.getColorById = async(req,res) =>{

    const { _id } = req.params
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })

    const table = await Table.findById(_id)
    if (!table)
        return res.status(400).json({ message: "Table not found" })

    res.status(201).json(table)
}


//post
exports.createTable = async (req, res) => {
    const { chairCount, tableNumber } = req.body
    if (!chairCount || !tableNumber)
        return res.status(400).json({ message: "Please fill all fields" })

    const isExist = await Product.find({tableNumber})
    if(isExist)
        return res.status(400).json({ message: "tableNumber table exist" })

    const table = Table.create({  chairCount, tableNumber })
    if (!table)
        return res.status(400).json({ message: "Error creating table" })

    const tables = await Table.find()
    res.status(201).json(tables)
}

//delete
exports.deleteTable = async (req, res) => {
    const { _id } = req.params
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })

    await Table.deleteOne({ _id });

    const tables = await Table.find()
    res.status(201).json(tables)

}






