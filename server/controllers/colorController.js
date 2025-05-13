const Color = require("../models/Color");

//get 
exports.getAllColors = async (req, res) => {
    const colors = await Color.find();
    res.status(200).json(colors);
}

//get 
exports.getColorById = async (req, res) => {
    const _id=req.params.id;
    if ( !_id) 
        return res.status(400).json({ message: "Please fill _id" })
    const color = await Color.findById(_id);
    res.status(200).json(color);
}

//post
exports.createColor = async (req, res) => {
    const { name, code, imageUrl } = req.body
    if (!code || !name) 
        return res.status(400).json({ message: "Please fill all fields" })
    const isExist= await Color.findOne({code});
    if (isExist)
        return res.status(404).json({ message: "Color exist" })
    const color = await Color.create({ name, code, imageUrl });
    if (!color)
        return res.status(500).json({ message: "Error creating color" });
    const colors = await Color.find();
    res.status(201).json(colors);
}

//put
exports.updateAvailableColor = async (req, res) => {
    const _id  = req.params.id
    if (!_id) 
        return res.status(400).json({ message: "Please fill all fields" })
    const color = await Color.findById(_id);
    if (!color) 
        return res.status(404).json({ message: "Color not found" })
    color.isAvailable = !color.isAvailable;
    await color.save();
    const colors = await Color.find();
    res.status(200).json(colors);
}

//delete
exports.deleteColor = async (req, res) => {
    const  _id  = req.params.id
    if (!_id) 
        return res.status(400).json({ message: "Please fill all fields" })
    await Color.deleteOne({ _id});
    const colors = await Color.find();
    res.status(200).json(colors);
}