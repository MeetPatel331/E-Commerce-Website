const exp = require('express')
const route = exp.Router()
const Order = require('../models/Order')
const authCheck = require('../authController/AuthCheck')
const Cart = require('../models/cart')
const Product = require('../models/products')
const User = require('../models/users')
const SavedInfo = require('../models/SavedInfo')

 

route.post('/addorder', authCheck, async (req, res) => {
    const { userId } = req.body
    const cart = await Cart.findOne({ userId: userId })
    const user = await User.findOne({ _id: userId })
    if (!cart) {
        return res.status(400).json({ message: 'Cart not found' })
    }
    const items = []
    let total = 0;
    for (let i of cart.items) {
        const detail = await Product.findOne({ _id: i.productId }, { title: 1, price: 1, _id: 0 })
        items.push({ productId: i.productId, quantity: i.quantity, productName: detail.title, price: detail.price })
        total += (i.quantity * detail.price)
    }
    console.log(total, items)
    const order = new Order({
        userEmail: user.email, items: items, order_time: new Date().toLocaleString(), total, userId: user._id
    })
    await order.save()
    await Cart.deleteOne({ userId: userId })
    res.status(201).json({ message: 'order created' })
})

route.post('/getorders', authCheck, async (req, res) => {
    const orders = await Order.find({})
    return res.status(200).json({ orders })
})

route.post('/getorderhistory', authCheck, async (req, res) => {
    const { userId } = req.body
    const orderhistory = await Order.find({ userId: userId })

    res.status(200).json(orderhistory)
})

route.post('/user/getsavedinfo', authCheck, async (req, res) => {
    const { userId } = req.body
    const savedinfo = await SavedInfo.findOne({ userId: userId })
    res.json(savedinfo)
})

module.exports = route
