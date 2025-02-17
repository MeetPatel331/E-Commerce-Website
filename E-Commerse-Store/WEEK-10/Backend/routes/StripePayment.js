const exp = require('express')
const stripe = require('stripe')
require('dotenv').config()
const route = exp.Router()
const stripeSecret = new stripe(process.env.STRIPE_SECURITY_KEY);

route.post(
    "/payment/create", async (request, response) => {
        const total = request.query.total;
        const paymentIntent = await
            stripeSecret.paymentIntents.create({
                amount: total,
                currency: "inr",
            });
        response.status(201).send({
            clientSecret: paymentIntent.client_secret
        });
    }
);
module.exports = route