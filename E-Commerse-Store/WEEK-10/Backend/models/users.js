const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To Users')
}).catch((err) => {
    console.log(err)
})

const schema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    role: String
})

const User = mongoose.model('users', schema)
module.exports = User