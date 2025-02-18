import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { fixingPrice } from '../components/RemovingDuplicate'
import { FaDeleteLeft } from 'react-icons/fa6'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import UpdateProduct from './UpdateProduct'
import AddProduct from './AddProduct'
import { refreshAccess } from '../components/Access'
import { useCart } from '../components/CartProvider'

const Products = (props) => {
    const [data, setData] = useState([])
    const { BASE_URL } = useCart()
    const [loading, SetLoading] = useState(false)
    const [search, Setsearch] = useState('')
    const [update, IsUpdate] = useState({
        showForm: false, id: '', showAddForm: false
    })
    const adminAccess = localStorage.getItem('accessToken')
    const fetchProducts = () => {
        SetLoading(true)
        axios.post(`${BASE_URL}/admin/product/category?category=${props.category}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminAccess}`
            }
        }).then((res) => {
            SetLoading(false)
            console.log(res.data)
            setData(res.data)
        }).catch((err) => {
            SetLoading(false)
            console.log(err)
            if (err.response.data.unauthorized) {
                const { success, accessToken } = refreshAccess()
                if (success && accessToken) {
                    localStorage.setItem('accessToken', accessToken)
                }
                else {
                    navigate('/login')
                }
            }
        })
        console.log(props.category)
    }
    useEffect(() => {
        fetchProducts()
    }, [props.category])

    const handleDelete = (id) => {
        if (confirm('Delete Product ? ')) {
            SetLoading(true)
            axios.delete(`${BASE_URL}/admin/deleteProduct?id=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminAccess}`
                }
            }).then((res) => {
                SetLoading(false)
                fetchProducts()
                toast.success('Product Deleted', {
                    position: 'top-right'
                })
            }).catch((err) => {
                SetLoading(false)
                console.log(err)
                if (err.response.data.unauthorized) {
                    const { success, accessToken } = refreshAccess()
                    if (success && accessToken) {
                        localStorage.setItem('accessToken', accessToken)
                    }
                    else {
                        navigate('/login')
                    }
                }
            })
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        SetLoading(true)
        axios.post(`${BASE_URL}/admin/product/search?searchfor=products&search=${e.target.value}&category=${props.category}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminAccess}`
            }
        }).then((res) => {
            SetLoading(false)
            setData(res.data.products)
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
            console.log(err)
        })
    }



    return (

        <>
            <h1 className='overviewHeading'>Products</h1>
            {
                !loading ? update.showForm ? <UpdateProduct id={update.id} /> :
                    update.showAddForm ? <AddProduct />
                        : <div className='userstable'>
                            <div className='btns'>
                                <button onClick={() => {
                                    IsUpdate({ ...update, id: '', showForm: false, showAddForm: true })
                                }}><FaPlus />&nbsp;Add Product</button>
                                <input type="search" onChange={(e) => handleSearch(e)} placeholder='search here' />
                            </div>
                            {
                                data.length > 0 ? Array.isArray(data) && <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Brand</th>
                                            <th>Model</th>
                                            <th>Category</th>
                                            <th>Color</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((user) => {
                                                return (
                                                    <tr>
                                                        <td><img src={user.image} width={40} height={40} /></td>
                                                        <td>{String(user.title).slice(0, 25).padEnd(28, ".")}</td>
                                                        <td>{fixingPrice(user.price)}</td>
                                                        <td>{
                                                            user.discount ? `${user.discount}%` : '-'
                                                        }</td>
                                                        <td>{user.brand}</td>
                                                        <td>{user.model}</td>
                                                        <td>{user.category}</td>
                                                        <td>{user.color}</td>
                                                        <td>
                                                            <div className='editDelete'>
                                                                <button onClick={() => {
                                                                    IsUpdate({ ...update, id: user._id, showForm: true })
                                                                }}><FaEdit /></button>
                                                                <button onClick={() => handleDelete(user._id)}><MdDelete /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table> : <div className='notfound' style={{ height: '70vh' }}>
                                    <h1>No Data available</h1>
                                </div>
                            }
                        </div> : <div style={{ height: '70vh', display: 'grid', placeContent: 'center' }}>
                    <div className="loader" style={{
                        background:'rgb(1, 1, 78)'
                    }}></div>
                </div>
            }
        </>
    )
}

export default Products