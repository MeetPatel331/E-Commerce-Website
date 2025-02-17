const exp = require('express')
const route = exp.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const accessTokenTime = 10 * 60 * 1000
const refreshTokenTime = 24 * 60 * 60 * 1000 * 3

route.post('/verifyAccess', (req, res) => {
    const accessToken = req.headers['authorization'].split(' ')[1]

    if (!accessToken) {
        return res.status(401).json({ message: 'not logged in', success: false })
    }
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'UnAuthorised checking by refresh token', success: false })
        }
        res.status(200).json({ message: 'Access Granted', success: true, id: decoded.id })
    })
})

route.post('/refreshToekn', (req, res) => {
    const refreshToekn = req.headers['authorization'].split(' ')[1]
    if (!refreshToekn) {
        return res.status(401).json({ message: 'need to Login', success: false })
    }
    jwt.verify(refreshToekn, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'UnAuthorised', success: false })
        }
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn:
                accessTokenTime
        })
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 2*60*1000 })
        res.status(200).json({ message: 'Access Granted', success: true, accessToken, id: decoded.id })
    })
})

module.exports = route