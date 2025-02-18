import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useCart } from '../components/CartProvider'

const Profile = () => {
    const [user, setuser] = useState({})
    const [loading, SetLoading] = useState(false)
    const { logout, BASE_URL } = useCart()
    const navigate = useNavigate()
    const id = useParams().id
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        window.scrollTo(0, 0)
        if (localStorage.getItem('userId')) {
            SetLoading(true)
            axios.post(`${BASE_URL}/auth/profile?id=${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }).then((res) => {
                SetLoading(false)
                setuser(res.data.user)
            }).catch((err) => {
                SetLoading(false)
                console.log(err)
            })
        }
        else {
            navigate('/login')
        }
    }, [])
    const LogOut = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
        toast.success('Successfully Logout', {
            position: 'top-right'
        })
        logout()
        navigate('/')
    }
    return (
        <div style={{
            display: 'grid',
            placeContent: 'center', height: '100vh', marginTop: '50px', backgroundColor: 'rgba(0,0,0,.5)'
        }}>
            {
                loading ? <div className="loader"></div> : <div className="profile">
                    <h1><FaUser /></h1>
                    <div>
                        <h4>{`Name : ${user.firstname} ${user.lastname}`}</h4>
                        <h4>{`Email : ${user.email}`}</h4>
                        <button onClick={() => {
                            navigate('/user/order/orderhistory')
                        }} style={{
                            backgroundColor: 'transparent', color: 'black'
                        }}>Order history <FaArrowRight /></button>
                        <button onClick={LogOut}>Logout</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Profile