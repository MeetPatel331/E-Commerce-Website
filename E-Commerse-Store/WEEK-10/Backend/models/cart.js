const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To Cart')
}).catch((err) => {
    console.log(err)
})

const CartItemschema = mongoose.Schema({
    productId: String,
    quantity: Number
})
const cartSchema = mongoose.Schema({
    userId : String,
    items : [CartItemschema],
    total : Number
})

const Cart = mongoose.model('cart', cartSchema)
module.exports = Cart