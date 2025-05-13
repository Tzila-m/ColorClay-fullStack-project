const Order = require("../models/Order")
const Product = require("../models/Product")
const Color = require("../models/Color")
const nodemailer = require("nodemailer")
const TableAvailability = require("../models/TableAvailability")

//post
//create order status1
exports.createOrder = async (req, res) => {
    try {
        const { userId, tableId, date, timeSlot } = req.body;

        if (!userId || !tableId || !date || !timeSlot ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // בדיקת זמינות השולחן
        const existingReservation = await TableAvailability.findOne({
            tableId,
            date,
            timeSlot
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'השולחן לא פנוי בתאריך ובזמן שנבחר' });
        }

        // אם השולחן פנוי, המשך עם יצירת ההזמנה
        const newReservation = await TableAvailability.create({
            tableId,
            date,
            timeSlot
        });
        if (!newReservation) {
            return res.status(500).json({ message: "Error while placing order" });
        }
        const newOrder = await Order.create({
            userId,
            tableId,
            date,
            timeSlot,
        });
         if (!newOrder) {
            return res.status(500).json({ message: 'Error while placing order' });
        }
        return res.status(201).json(newOrder);

    } catch (error) {
        res.status(500).json({ message: 'שגיאה בהזמנה', error });
    }
};


//put
//create order status2
exports.addProductsAndColors = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { productIds = [], colorIds = [] } = req.body;


        if (!orderId) {
            return res.status(400).json({ message: "Missing order ID" });
        }

        const unavailableProducts = await Product.find({
            _id: { $in: productIds },
            isAvailable: false
        });


        if (unavailableProducts.length > 0) {
            return res.status(400).json({
                message: "One or more products are not available",
                unavailableProducts
            });
        }
        const unavailableColors = await Color.find({
            _id: { $in: colorIds },
            isAvailable: false
        });

        if (unavailableColors.length > 0) {
            return res.status(400).json({
                message: "One or more colors are not available",
                unavailableColors
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $push: {
                    productIds: { $each: productIds },
                    colorIds: { $each: colorIds },
                },
                status: "2",
            },
            { new: true }
        );


        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

//put
//create order - payment status3
exports.confirmOrderPayment = async (req, res) => {
    try {
        const { orderId } = req.params
        if (!orderId)
            return res.status(400).json({ message: "Missing required fields" })




        const order = await Order.findById(orderId).populate("productIds")


        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }


        //סכום סה"כ לתשלום עבור המוצרים שהוזמנו
        const totalPrice = order.productIds.reduce(
            (sum, product) => sum + product.price,
            0
        )


        order.totalPrice = totalPrice
        order.status = "3"
        await order.save()


        return res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: "Error confirming payment", error });
    }
}


//put
// order compleete - payment status4
exports.markOrderReady = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Missing order ID" });
        }

        const order = await Order.findById(orderId).populate("userId");


        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }


        order.status = "4";
        await order.save();


        // send email
        const email = process.env.EMAIL
        const password = process.env.PASSWORD
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password,
            },
        })


        await transporter.sendMail({
            from: process.env.EMAIL,
            to: order.userId.email,
            subject: `Hi ${order.userId.username} Your order is ready for pickup!`,
            text: "Dear customer, your order is now ready for pickup. Thank you!",
        })


        return res.status(200).json({ message: "Order marked as ready and email sent" })
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error })
    }
}


//get
exports.getOrderById = async (req, res) => {
    try {
        const _id = req.params.id


        const order = await Order.findById(_id)
            .populate("userId")
            .populate("productIds")
            .populate("colorIds")
            .populate("tableId");


        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }


        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error });
    }
}