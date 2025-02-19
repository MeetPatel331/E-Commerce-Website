const exp = require('express')
const route = exp.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()
const bcrypt = require('bcrypt')
const Admin = require('../models/admin')
const authCheck = require('../authController/AuthCheck')
const nodemailer = require('nodemailer')
const accessTokenTime = 60 * 60 * 1000
const refreshTokenTime = 24 * 60 * 60 * 1000 * 3

const sendMail = (data) => {
    let text = ''
    const mailTransport = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })
    if (data.about === 'Signup') {
        text = ` <div style="font-family: Arial, sans-serif; color: #333;margin-inline:"5%";background:"#ccc";display:"block";">
        <h1 style="color: #007bff;text-align:"center">SOUTH TEXAS SLIGNS</h1>
          <h2 style="color: #007bff;">Welcome, ${data.username}!</h2>
          <img src="https://img.freepik.com/free-vector/man-with-hand-up-icon_24877-81630.jpg?ga=GA1.1.841956205.1736584141&semt=ais_hybrid" width="100" height="200"/>
          <p>Thank you for signing up for our service. We’re excited to have you on board.</p>
          <p>Click the button below to verify your email and get started:</p>
          <p>If you didn’t sign up, please ignore this email.</p>
          <p>Best regards,<br>South Texas Slings</p>
        </div>`
    }
    else if (data.about == 'Login') {
        text = ` <div style="font-family: Arial, sans-serif; color: #333;margin-inline:"5%";background:"#ccc";display:"block";">
        <h1 style="color: #007bff;text-align:"center">SOUTH TEXAS SLIGNS</h1>
          <h2 style="color: #007bff;">Welcome Back !!</h2>
          <img src="https://img.freepik.com/free-vector/man-with-hand-up-icon_24877-81630.jpg?ga=GA1.1.841956205.1736584141&semt=ais_hybrid" style="width:100%" height="200"/>
          <p>Explore amazing Products.</p>
          <p>Best regards,<br>South Texas Slings</p>
        </div>`
    }

    const mailOptions = {
        from: "SOUTH TEXAS SLINGS",
        to: data.email,
        subject: data.subject,
        html: text,
    }
    mailTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(info.response)
        }
    })
}

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
        const user = new User({ email, firstname, lastname, password: await bcrypt.hash(password, 10), role: "user" })
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
        sendMail({ email, username: `${firstname} ${lastname}`, subject: `South Texas Slings !`, about: 'Signup' })
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
            if (user.role === 'admin') {
                return res.status(200).json({ message: 'Successfully Logged in', success: true, accessToken, refreshToekn, id: user._id, role: user.role })
            }
            sendMail({ email, subject: `South Texas Slings !`, about: 'Login' })
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