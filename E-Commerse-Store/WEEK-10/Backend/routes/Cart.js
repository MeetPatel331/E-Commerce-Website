const exp = require('express')
const route = exp.Router()
const app = exp.Router()
const authCheck = require('../authController/AuthCheck')
const Cart = require('../models/cart')
const Product = require('../models/products')

route.post('/getCart', authCheck, async (req, res) => {
    const userId = req.query.id
    if (!userId) {
        return res.status(400).json({ message: 'Id is not provided', success: false })
    }
    const cart = await Cart.findOne({ userId: userId }, { items: 1 })
    if (!cart) {
        return res.status(200).json([])
    }
    else {
        return res.status(200).json(cart)
    }
})

route.post('/addcart', authCheck, async (req, res) => {
    const { productId, userId, quantity } = req.body
    if (!productId || !userId) {
        return res.status(400).json({ message: 'Id is not provided' })
    }
    if (!quantity) {
        quantity = 1
    }
    let cart = await Cart.findOne({ userId: userId })
    if (!cart) {
        cart = new Cart({
            userId: userId, items: [{ quantity: 0, productId }], total: 0
        })
    }
    const itmsIndex = cart.items.findIndex((item) => item.productId === productId)
    if (itmsIndex > -1) {
        cart.items[itmsIndex].quantity += quantity
    }
    else {
        cart.items.push({ productId, quantity })
    }
    for (let i = 0; i < cart.items.length; i++) {
        let product = await Product.findOne({ _id: productId })
        if (product) {
            cart.total += (cart.items[i].quantity * product.price)
        }
    }
    await cart.save()
    res.status(200).json({ message: 'Added to cart' })
})

route.delete('/removeCartItem', authCheck, async (req, res) => {
    const { productId, userId } = req.body
    console.log(req.body)
    if (!productId || !userId) {
        return res.status(400).json({ message: 'Id is not provided' })
    }
    const cart = await Cart.findOne({ userId: userId })
    if (!cart) {
        return res.status(400).json({ message: "Cart Not found" })
    }
    else {
        cart.items = cart.items.filter((item) => item.productId !== productId)
        if (cart.items.length > 0) {
            await cart.save()
            return res.status(200).json({ message: 'removed from cart' })
        }
        else {
            await Cart.deleteOne({ userId: userId })
            return res.status(200).json({ message: 'removed from cart' })
        }
    }
})

route.put('/updatecart', authCheck, async (req, res) => {
    const { productId, userId, quantity } = req.body
    let cart = await Cart.findOne({ userId: userId })
    if (!cart) {
        return res.status(404).json({ message: 'Cart Not found' })
    }
    const item = cart.items.find((item) => item.productId === productId)
    if (item) {
        item.quantity = quantity;
        for (let i = 0; i < cart.items.length; i++) {
            let product = await Product.findOne({ _id: productId })
            if (product) {
                cart.total += (cart.items[i].quantity * product.price)
            }
        }
        await cart.save()
        res.status(200).json({ message: 'updated to cart' })
    }
})

module.exports = route