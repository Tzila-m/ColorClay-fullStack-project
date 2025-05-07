const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productIds:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }],

    colorIds:
        [{
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
    },
    status:
    {
        type: String,
        enum: ["1", "2", "3","4"],
        //1 הוזמן שולחן לתאריך מסוים
        //2 הוזמן מוצרים וצבעים במקום
        //3 בוצע תשלום וההזמנה אושרה 
        //4 הכלי מוכן לאיסוף
        default: "pending"
    },
    date: {
        type: Date,
        rerquired: true
    },
    timeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        required: true
    }
})

module.exports = mongoose.model("Order", orderSchema);

