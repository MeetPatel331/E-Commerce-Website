const exp = require('express')
const route = exp.Router()
const Products = require('../models/products')

route.get('/products',async(req,res)=>{
    const products = await Products.find({})
    if(!products){
        return res.status(400).json({message : 'Not Found any products'})
    }
    res.status(200).json(products)
})

route.get('/signleproduct',async(req,res)=>{
    const id = req.query.id
    const product = await Products.findOne({_id:id})
    if(!product){
        return res.status(400).json({message:'Product Not found'})
    }
    res.status(200).json(product)
})

module.exports = route