const User = require("../models/User")

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const login = async (req, res) => {


    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ username }).populate('orders').lean()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }


    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized' })


    const userInfo = {
        _id: foundUser._id,
        name: foundUser.name,
        roles: foundUser.roles,
        username: foundUser.username,
        email: foundUser.email,
        phone: foundUser.phone,
        orders: foundUser.orders
    }

    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    console.log("Login response:", { accessToken, userInfo });

    res.json({ accessToken, userInfo });
}


const register = async (req, res) => {


    const { username, password, name, email, phone } = req.body
    if (!name || !username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    const exist = await User.findOne({ username }).lean()
    if (exist) {
        return res.status(409).json({ message: "Duplicate username" })
    }


    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { name, email, username, phone, password: hashedPwd }
    const user = await User.create(userObject)
    if (user) { // Created
        return res.status(201).json({
            message: `New user ${user.username}
    created` })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}
module.exports = { login, register }