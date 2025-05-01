const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        require: true,
        unique: true
    },
    chairCount: {
        type: Number,
        require: true,
    }

});

module.exports = mongoose.model("Table", tableSchema);