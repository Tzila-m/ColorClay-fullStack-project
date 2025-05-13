const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true,
        unique: true
      },
      price: {
        type: Number,
        required: true
      },
      isAvailable: {
        type: Boolean,
        default: true
      },
      imageUrl: {
        type: String,
        default: "https://example.com/default-image.jpg" // Default image URL
      },
      
      categoryId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "ProductCategory" }

});
module.exports = mongoose.model("Product", productSchema);

