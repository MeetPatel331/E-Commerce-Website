const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected To SavedInfo')
}).catch((err) => {
    console.log(err)
})

const schema = mongoose.Schema({
    userEmail: String,
    userId: String,
    firstname: String,
    lastname: String,
    company: String,
    address: String,
    apartment: String,
    city: String,
    country: String,
    zip: String,
    phone: String,
})

const SavedInfo = mongoose.model('savedinfo', schema)
module.exports = SavedInfo