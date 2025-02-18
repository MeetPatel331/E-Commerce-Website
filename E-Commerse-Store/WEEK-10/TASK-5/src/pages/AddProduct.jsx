import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AdminPanel from './AdminPanel'
import { toastErrorMessage, toastSuccessMessage } from '../components/RemovingDuplicate'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'
import { refreshAccess } from '../components/Access'
import { useCart } from '../components/CartProvider'

const AddProduct = () => {
    const [data, setData] = useState({})
    const [loading, SetLoading] = useState(false)
    const [categories, SetCategory] = useState([])
    const { BASE_URL } = useCart()
    const navigate = useNavigate()
    const [display, SetDisplay] = useState(false)
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const fetchProducts = () => {
            axios.post(`${BASE_URL}/admin/products`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then((res) => {
                let set = new Set(res.data.categories)
                SetCategory(Array.from(set))
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
                console.log(err)
            })
        }
        fetchProducts()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        SetLoading(true)
        axios.post(`${BASE_URL}/admin/addProduct`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('updateStatus', 'true');
            toastSuccessMessage('Product Added')
            SetLoading(false)
            setTimeout(() => {
                navigate('/admin')
            }, 1000)
        }).catch((err) => {
            SetLoading(false)
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

    const handleCategory = (e) => {
        if (e.target.value === 'new') {
            SetDisplay(true)
            setData({ ...data, 'category': '' })
        }
        else {
            SetDisplay(false)
            handleChange(e)
        }
    }

    return (
        <div className='productUpdate'>
            <form action="">
                <h1>Add Product</h1>
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
                    <select name="category" id="" onChange={(e) => handleCategory(e)}>
                        <option value="" selected disabled hidden>Category</option>
                        {
                            categories.map((c) => {
                                return (
                                    <option value={c}>{String(c).toUpperCase()}</option>
                                )
                            })
                        }
                        <option value="new">NEW</option>
                    </select>
                    <input type="text" id='new' />
                </div>
                <div>
                    {
                        display ?
                            <input type="text" name='category' value={data.category} onChange={(e) => handleChange(e)} placeholder='Product Category' />
                            : ''
                    }
                </div>
                <div>
                    <input type="text" name='description' value={data.description} onChange={(e) => handleChange(e)} placeholder='Product description' />
                    <input type="text" name='image' value={data.image} onChange={(e) => handleChange(e)} placeholder='Product Image URL' />
                </div>
                <button onClick={(e) => handleSubmit(e)}>{
                    loading ? <div className="loader"></div> : 'ADD'
                }</button>
                <button className='backbtn' onClick={() => {
                    navigate('/admin')
                }}><FaArrowLeft />&nbsp;Back</button>
            </form>
        </div>
    )
}

export default AddProduct