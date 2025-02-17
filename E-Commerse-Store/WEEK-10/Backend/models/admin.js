const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To Admin')
}).catch((err) => {
    console.log(err)
})

const schema = mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model('Admin', schema)
module.exports = User