const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To Products')
}).catch((err) => {
    console.log(err)
})

const schema = mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    discount: Number,
    description: String,
    brand: String,
    category: String,
    model: String,
    color: String,
})

const Products = mongoose.model('products', schema)
module.exports = Products