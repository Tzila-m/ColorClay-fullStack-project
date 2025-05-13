const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
        },
    phone: {
        type: String,
    },
    orders:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
       
    roles: {
        type: String,
        enum: ['User', 'Admin'],
        default: "User",
    }
}, { timestamps: true }
)


module.exports = mongoose.model("User", userSchema);






