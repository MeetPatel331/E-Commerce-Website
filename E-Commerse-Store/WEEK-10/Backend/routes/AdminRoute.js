const exp = require('express')
const route = exp.Router()
const User = require('../models/users')
const Product = require('../models/products')
const isAdmin = require('../authController/AuthCheck')
const bcrypt = require('bcrypt')
const Orders = require('../models/Order')

route.post('/users', isAdmin, async (req, res) => {
    const users = await User.find({}, { 'password': 0 })
    if (!users) {
        return res.status(400).json({ message: 'Do not have any User' })
    }
    res.status(200).json(users)
})

route.post('/products', isAdmin, async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 })
    const categories = products.map((p) => p.category)
    if (!products) {
        return res.status(400).json({ message: 'Do not have any Product' })
    }
    res.status(200).json({ products, categories })
})

route.post('/addProduct', async (req, res) => {
    const { title, image, category, price, discount, description, brand, model, color } = req.body
    if (!title || !image || !category || !price || !discount || !description || !brand || !model || !color) {
        console.log('g')
        return res.status(400).json({ message: 'Provide all values' })
    }
    const product = new Product({ title, image, category, price, discount, description, brand, model, color })
    await product.save()
    res.status(201).json({ message: 'product created' })
})

route.patch('/updateproduct', isAdmin, async (req, res) => {
    const productId = req.query.id
    if (!productId) {
        return res.status(400).json({ message: 'Id is not provided', success: false })
    }
    const { title, image, category, price, discount, description, brand, model, color } = req.body
    if (!title || !image || !category || !price || !discount || !description || !brand || !model || !color) {
        return res.status(400).json({ message: 'Provide all values' })
    }
    const product = await Product.findOne({ _id: productId })
    if (!product) {
        return res.status(400).json({ message: 'Product not found', success: false })
    }
    await Product.updateOne({ _id: productId }, {
        $set: {
            title, image, category, price, discount, description, brand, model, color
        }
    })
    res.status(200).json({ message: 'product updated' })
})

route.delete('/deleteproduct', isAdmin, async (req, res) => {
    const productId = req.query.id
    if (!productId) {
        return res.status(400).json({ message: 'Id is not provided', success: false })
    }
    const deleteProduct = await Product.deleteOne({ _id: productId })
    if (!deleteProduct) {
        return res.status(400).json({ message: 'Something went wrong' })
    }
    else {
        res.status(200).json({ message: 'Product Deleted' })
    }
})

route.post('/product/category', isAdmin, async (req, res) => {
    const category = req.query.category
    if (!category) {
        return res.status(400).json({ message: 'category is not provided', success: false })
    }
    if (category === 'all') {
        const product = await Product.find({})
        return res.status(200).json(product)
    }
    const products = await Product.find({ category: category })
    if (!products) {
        return res.status(400).json({ message: 'Do not have any Product' })
    }
    res.status(200).json(products)
})

route.post('/product/singleproduct', isAdmin, async (req, res) => {
    const id = req.query.id
    const product = await Product.findOne({ _id: id })
    if (!product) {
        return res.status(400).json({ message: 'Product Not found' })
    }
    res.status(200).json(product)
})

route.post('/products/overview', isAdmin, async (req, res) => {
    const products = await Product.find({})
    const users = await User.find({})
    const orders = await Orders.find({})
    res.status(200).json({ products: products.length, users: users.length, orders: orders.length })
})
route.post('/product/search', isAdmin, async (req, res) => {
    const q = req.query.search
    const model = req.query.searchfor
    const category = req.query.category
    if (model === 'users') {
        const users = await User.find({
            $or: [{ firstname: { $regex: q + '.*', $options: 'i' } }, { lastname: { $regex: q + '.*', $options: 'i' } },
            { email: { $regex: q + '.*', $options: 'i' } }
            ]
        })

        if (users) {
            res.status(200).json({ users, success: true })
        }
        else {
            res.status(400).json({ users: 0, success: false })
        }
    }
    else {
        if (category === 'all') {
            const products = await Product.find({
                $or: [{ title: { $regex: q + '.*', $options: 'i' } },
                { description: { $regex: q + '.*', $options: 'i' } }, { brand: { $regex: q + '.*', $options: 'i' } },
                { category: { $regex: q + '.*', $options: 'i' } }, { model: { $regex: q + '.*', $options: 'i' } }, { color: { $regex: q + '.*', $options: 'i' } }
                ]
            })
            if (products) {
                res.status(200).json({ products, success: true })
            }
            else {
                res.status(400).json({ products: 0, success: false })
            }
        }
        else {
            const products = await Product.find({
                category: category,
                $or: [{ title: { $regex: q + '.*', $options: 'i' } },
                { description: { $regex: q + '.*', $options: 'i' } }, { brand: { $regex: q + '.*', $options: 'i' } },
                { category: { $regex: q + '.*', $options: 'i' } }, { model: { $regex: q + '.*', $options: 'i' } }, { color: { $regex: q + '.*', $options: 'i' } }
                ]
            })
            if (products) {
                res.status(200).json({ products, success: true })
            }
            else {
                res.status(400).json({ products: 0, success: false })
            }
        }
    }
})

route.post('/adduser', isAdmin, async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Enter all Values', success: false })
    }
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
        return res.status(400).json({ message: 'User with this Email already exists', success: false })
    }
    else {
        const user = new User({ email, firstname, lastname, password: await bcrypt.hash(password, 10) })
        await user.save()
        res.status(200).json({ message: 'Successfully Registered', success: true, id: user._id })
    }
})

module.exports = route