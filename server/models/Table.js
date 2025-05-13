const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({

  tableNumber: {
    type:Number,
    required: true,
    unique: true },
  
  chairCount:{
    type:Number,
    required: true,
  },

});

module.exports = mongoose.model("Table", tableSchema);