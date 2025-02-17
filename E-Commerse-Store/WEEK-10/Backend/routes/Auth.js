const exp = require('express')
const route = exp.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()
const bcrypt = require('bcrypt')
const Admin = require('../models/admin')
const authCheck = require('../authController/AuthCheck')

const accessTokenTime = 60 * 60 * 1000
const refreshTokenTime = 24 * 60 * 60 * 1000 * 3

route.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Enter all Values', success: false })
    }
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
        return res.status(400).json({ message: 'User with this Email already exists', success: false })
    }
    else {
        const user = new User({ email, firstname, lastname, password: await bcrypt.hash(password, 10),role:"user" })
        await user.save()
        const accessToken = jwt.sign(
            { id: user._id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: accessTokenTime
        }
        )
        const refreshToken = jwt.sign(
            { id: user._id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: refreshTokenTime
        }
        )
        if (!accessToken || !refreshToken) {
            return res.status(400).json({ message: 'Something went wrong try again !!', success: false })
        }
        res.status(200).json({ message: 'Successfully Registered', success: true, accessToken, refreshToken, id: user._id })
    }
})

route.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Enter both values', success: false })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials', success: false })
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: 'Something went wrong', success: false })
        }
        if (result) {
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: accessTokenTime })
            const refreshToekn = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenTime })
            if(user.role==='admin'){
                return res.status(200).json({ message: 'Successfully Logged in', success: true, accessToken, refreshToekn, id: user._id, role: user.role })
            }
            res.status(200).json({ message: 'Successfully Logged in', success: true, accessToken, refreshToekn, id: user._id, role: user.role })
        }
        else {
            return res.status(400).json({ message: 'Invalid Credentials', success: false })
        }
    })
})

route.post('/profile', authCheck, async (req, res) => {
    const userId = req.query.id
    if (!userId) {
        return res.status(400).json({ message: 'Id is not provided', success: false })
    }
    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(400).json({ message: 'User not found', success: false })
    }
    res.status(200).json({ user, success: true })
})

route.post('/adminLogin', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Enter both values', success: false })
    }
    const user = await Admin.findOne({ email: email, password: password })
    if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials', success: false })
    }
    else {
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: accessTokenTime })
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenTime })
        res.status(200).json({ message: 'Successfully Logged in', success: true, accessToken, refreshToken, id: user._id })
    }
})

module.exports = route