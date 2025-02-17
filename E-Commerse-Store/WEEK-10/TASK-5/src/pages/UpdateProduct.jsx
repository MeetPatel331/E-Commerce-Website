import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toastErrorMessage, toastSuccessMessage } from '../components/RemovingDuplicate'
import { FaArrowLeft } from 'react-icons/fa'
import { refreshAccess } from '../components/Access'
import { useCart } from '../components/CartProvider'

const UpdateProduct = (props) => {
    const id = props.id
    console.log(id)
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const {BASE_URL}=useCart()
    useEffect(() => {
        axios.post(`${BASE_URL}/admin/product/singleproduct?id=${id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((res) => {
            setData(res.data)
        }).catch((err) => {
            console.log(err)
            navigate('/login')
        })
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.patch(`${BASE_URL}/admin/updateproduct?id=${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('updateStatus', 'true');
            toastSuccessMessage('Product Updated')
            setTimeout(() => {
                window.location.href = '/admin'
            }, 1000)
        }).catch((err) => {
            if (err.response.data.unauthorized) {
                const { success, accessToken } = refreshAccess()
                if (success && accessToken) {
                    localStorage.setItem('accessToken', accessToken)
                }
                else {
                    navigate('/login')
                }
            }
            toastErrorMessage(err.response.data.message)
            console.log(err);
           
        });
    }

    return (
        <div className='productUpdate'>
            <form action="">
                <h1>Update Product</h1>
                <div>
                    <input type="text" name='title' value={data.title} onChange={(e) => handleChange(e)} placeholder='Product Title' />
                    <input type="number" name='price' value={data.price} onChange={(e) => handleChange(e)} placeholder='Product Price' />
                </div>
                <div>
                    <input type="number" name='discount' value={data.discount} onChange={(e) => handleChange(e)} placeholder='Product Discount' />
                    <input type="text" name='brand' value={data.brand} onChange={(e) => handleChange(e)} placeholder='Product Brand' />
                </div>
                <div>
                    <input type="text" name='model' value={data.model} onChange={(e) => handleChange(e)} placeholder='Product Model' />
                    <input type="text" name='color' value={data.color} onChange={(e) => handleChange(e)} placeholder='Product Color' />
                </div>
                <div>
                    <input type="text" name='category' value={data.category} onChange={(e) => handleChange(e)} placeholder='Product Category' />
                </div>
                <div>
                    <input type="text" name='description' value={data.description} onChange={(e) => handleChange(e)} placeholder='Product description' />
                    <input type="text" name='image' value={data.image} onChange={(e) => handleChange(e)} placeholder='Product Image URL' />
                </div>
                <button onClick={(e) => handleSubmit(e)}>UPDATE</button>
                <button className='backbtn' onClick={() => {
                    window.history.back()
                }}><FaArrowLeft />&nbsp;Back</button>
            </form>
        </div>
    )
}

export default UpdateProduct