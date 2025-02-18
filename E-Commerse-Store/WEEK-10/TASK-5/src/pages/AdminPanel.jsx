import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowCircleRight, FaArrowRight, FaDatabase, FaUser, FaUsers } from 'react-icons/fa'
import Users from './Users'
import Products from './Products'
import Overview from './Overview'
import { FaCircleDot } from 'react-icons/fa6'
import Orders from './Orders'
import { toast } from 'react-toastify'
import { useCart } from '../components/CartProvider'

const AdminPanel = () => {
    const navigate = useNavigate()
    const [isAdmin, SetisAdmin] = useState(false)
    const [categories, SetCategory] = useState([])
    const [category, SetcurrCategory] = useState('')
    const { BASE_URL, handleAdminLogin } = useCart()
    const updayeStatus = localStorage.getItem('updateStatus')
    const [tab, SetTab] = useState({
        users: false, products: false, overview: true, orders: false
    })
    let categorytoShow = ''
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
            console.log(err)
        })
    }
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        window.scrollTo(0, 0)
        if (localStorage.getItem('admin')) {
            if (accessToken && refreshToken) {
                axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((res) => {
                    if (res.data.success) {
                        if (localStorage.getItem('updateStatus')) {
                            SetTab({ ...tab, users: false, products: true })
                            localStorage.removeItem('updateStatus')
                        }
                        SetisAdmin(true)
                        fetchProducts()
                        console.log('success')
                    }
                }).catch((err) => {
                    axios.post(`${BASE_URL}/check/refreshToekn`, {}, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${refreshToken}`
                        }
                    }).then((res) => {
                        if (res.data.success) {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            SetisAdmin(true)
                            fetchProducts()
                            console.log('success')
                        }
                    }).catch((err) => {
                        console.log(err)
                        navigate('/login')
                    })
                })
            }
            else {
                navigate('/login')
            }
        }
        else {
            toast.warning('Unauthorized Page', {
                position: 'top-right'
            })
            navigate('/')
        }
    }, [])
    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('admin')
        handleAdminLogin()
        navigate('/')
    }
    useEffect(() => {
        if (updayeStatus) {
            SetTab({ ...tab, products: true, users: false, overview: true, orders: false })
        }
    },[updayeStatus])
    return (
        <div className='admin'>
            {
                isAdmin ?
                    <div className='panel'>
                        <div className="panelTab">
                            <div className='adminprofile'>
                                <div><img src="https://img.freepik.com/premium-vector/3d-simple-user-icon-isolated_169241-6922.jpg?ga=GA1.1.841956205.1736584141&semt=ais_hybrid" width={100} height={100} alt="" /></div>
                                <h5>Hello admin@123!</h5>
                            </div>
                            <br />
                            <button className={tab.overview ? 'active' : ''} onClick={() => SetTab({ ...tab, users: false, products: false, overview: true, orders: false })}><FaCircleDot />&nbsp;Overview</button>
                            <button className={tab.users ? 'active' : ''} onClick={() => SetTab({ ...tab, users: true, products: false, overview: false, orders: false })}><FaUsers />&nbsp;Users</button>
                            {/* <button className={tab.products ? 'active' : ''} onClick={() => SetTab({ ...tab, products: true, users: false, overview: false   })}><FaDatabase />&nbsp;Products</button> */}
                            <select name="" id="" onChange={(e) => {
                                SetcurrCategory(e.target.value);
                                categorytoShow = e.target.value;
                                SetTab({ ...tab, products: true, users: false, overview: false, orders: false })
                            }}>
                                <option value="" selected disabled hidden>Products</option>
                                <option value="all">All Products</option>
                                {
                                    categories.map((c) => {
                                        return (
                                            <option value={c}>{String(c).toUpperCase()}</option>
                                        )
                                    })
                                }
                            </select>
                            <button onClick={logout}>Logout&nbsp;&nbsp;<FaArrowRight /></button>
                            <button className={tab.orders ? 'active' : ''} onClick={() => SetTab({ ...tab, users: false, products: false, overview: false, orders: true })}>Orders</button>
                        </div>
                        <div className="panelContent">
                            {
                                tab.users ? <Users /> : tab.products ? <Products category={category ? category : 'all'} /> : tab.overview ? <Overview /> : tab.orders ? <Orders /> : ''
                            }
                        </div>
                    </div> : ""
            }
        </div>
    )
}

export default AdminPanel