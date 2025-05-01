const mongoose = require('mongoose')

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    code: {
        type: String,
        require: true,
        unique: true

    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    imageUrl: {
        type: String,
        default: ""

    }
})

module.exports = mongoose.model("Color", colorSchema);

