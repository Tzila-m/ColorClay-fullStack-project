const mongoose = require("mongoose");

const orderSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    productIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",   
    }],
    colorIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Color",
    }],

    tableId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "TableAvailability",
        required: true
    },
    totalPrice: { 
        type: Number, 
        default: 0
    },
    status: { 
        type: String, 
        enum: ["1", "2", "3","4"], 
        default: "1"
        },
        //1: הוזמן שולחן+תאריך
        //2: הוזמן מוצקים וצבעים במקום
        //3 : בוצע תשלום והזמנה אושרה
        //4: הכלי מוכן לאיסוף
    date: { 
        type: Date, 
        required: true,
    },
    timeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        required: true
      },
})

module.exports = mongoose.model("Order", orderSchema)
