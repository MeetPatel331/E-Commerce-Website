const jwt = require('jsonwebtoken')
require('dotenv').config()

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

module.exports = authCheck
