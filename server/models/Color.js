const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },

    code: {
        type:String,
        required: true,
        unique: true,
    },

    isAvailable: {
        type: Boolean,
        default: true
    },
    
    imageUrl: {
        type: String,
        default: "https://example.com/default-image.jpg" // Default image URL   
    }
});

module.exports = mongoose.model("Color", colorSchema)
