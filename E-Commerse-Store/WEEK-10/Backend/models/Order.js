const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To Orders')
}).catch((err) => {
    console.log(err)
})

const OrderItemschema = mongoose.Schema({
    productId: String,
    productName: String,
    quantity: Number,
    price:Number
})
const OrderSchema = mongoose.Schema({
    userEmail: String,
    userId: String,
    items: [OrderItemschema],
    order_time: String,
    total: Number
})

const Orders = mongoose.model('orders', OrderSchema)
module.exports = Orders