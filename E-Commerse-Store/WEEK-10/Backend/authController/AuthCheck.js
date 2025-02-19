const jwt = require('jsonwebtoken')
require('dotenv').config()
const nodemailer = require('nodemailer')

const authCheck = (req, res, next) => {
    const token = String(req.headers['authorization']).split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized token is not found' });
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized', unauthorized: false });
        }
        req.user = decoded;
        next();
    });
}

export const sendMail = (data) => {
    const mailTransport = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: data.email,
        subject: data.subject,
        text: data.text
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

module.exports = authCheck