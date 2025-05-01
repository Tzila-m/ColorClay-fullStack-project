const Color = require("../models/Color")

//get
exports.getAllColors = async (req, res)=>{

    res.status(200).json(colors)
    const colors = await Color.find()
    
}

//post
exports.createColor = async (req,res)=>{
    const {name,code,imageUrl} = req.body
    if(!name || !code)
        return res.status(400).json({message:"Please fill all fields"})

    const color = Color.create({name,code,imageUrl})
    if(!color)
        return res.status(400).json({message:"Error creating color"})

    const colors = await Color.find()
    res.status(201).json(colors)
}

//put
exports.updateAvailableColor = async (req,res)=>{
    const {_id} = req.params

    if(!_id )
        return res.status(400).json({message:"Please fill all fields"})

    const color = await Color.findById(_id)
    if(!color)
        return res.status(400).json({message:"Color not found"})

    color.isAvailable = !color.isAvailable
    await color.save()

    const colors = await Color.find()
    res.status(201).json(colors)

}

//delete
exports.deletaColor = async(req,res)=>{
    const {_id}= req.params
    if(!_id )
        return res.status(400).json({message:"Please fill all fields"})

    await Color.deleteOne({ _id });

    const colors = await Color.find()
    res.status(201).json(colors)

}


