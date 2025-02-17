const exp = require('express')
const app = exp()
const bodyParser = require('body-parser')
const cp = require('cookie-parser')
const cors = require('cors')
const productsRoute = require('./routes/Products')
const auth = require('./routes/Auth')
const adminRoute = require('./routes/AdminRoute')
const cart = require('./routes/Cart')
const authVerify = require('./routes/AuthVerify')
const orders = require('./routes/orders')
const payments = require('./routes/StripePayment')

app.use(cp())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
  };
app.use(cors())
app.use('/fetch', productsRoute)
app.use('/auth', auth)
app.use('/admin', adminRoute)
app.use('/cart', cart)
app.use('/check',authVerify)
app.use('/order',orders)
app.use('/payment',payments)

app.listen(3000)