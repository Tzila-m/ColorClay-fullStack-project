const Table = require("../models/Table");

//get 
exports.getAllTables = async (req, res) => {
    const tables = await Table.find();
    res.status(200).json(tables);
}

//get 
exports.getTableById = async (req, res) => {
    const _id = req.params.id;
    if (!_id)
        return res.status(400).json({ message: "Please fill _id" })
    const table = await Table.findById(_id);
    res.status(200).json(table);
}

//post
exports.createTable = async (req, res) => {
    const { tableNumber, chairCount} = req.body
    if (!tableNumber || !chairCount )
        return res.status(400).json({ message: "Please fill all fields" })
    const isExist = await Table.findOne({ tableNumber });
    console.log(isExist)
    if (isExist)
        return res.status(400).json({ message: "code tableNumber exist" })
    
    const table = await Table.create({  tableNumber, chairCount });
    if (!table)
        return res.status(500).json({ message: "Error creating table" });
    const tables = await Table.find();
    res.status(201).json(table);
}

//delete
exports.deleteTable = async (req, res) => {
    const  _id  = req.params.id
    if (!_id)
        return res.status(400).json({ message: "Please fill all fields" })
    await Table.deleteOne({ _id });
    const tables = await Table.find();
    res.status(200).json(tables);
}