import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCart } from '../components/CartProvider'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: '', password: ''
    })
    const [error, setError] = useState('')
    const {BASE_URL} = useCart()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data)
        axios.post(`${BASE_URL}/auth/adminLogin`, data).then((res) => {
            localStorage.setItem('adminAccessToken', res.data.accessToken)
            toast.success('SuccessFully Login ! ', {
                position: 'top-right'
            })
            navigate('/admin')
        }).catch((err) => {
            console.log(err)
            setError(err.response.data.message)
        })
    }
    const ImageLink = 'https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1692255251854-xbox.jpg'
    return (
        <div style={{ display: 'flex', justifyContent: 'end', flexWrap: 'wrap-reverse' }}>
            <div className='loginBox'>
                <div className='loginForm'>
                    <form action="">
                        <h1>Login</h1>
                        <div className='inputs'>
                            <input type="email" name='email' placeholder='Email' onChange={(e) => setData({ ...data, email: e.target.value })} />
                            <input type="password" name='password' placeholder='Password' onChange={(e) => setData({ ...data, password: e.target.value })} />
                        </div>
                        <br/>
                         <small style={{ textAlign: 'center', color: 'red',padding:'10px' }}>{
                            error && error
                        }</small>
                        <button className='loginbtn' onClick={(e) => handleSubmit(e)}>LOGIN</button>
                     </form>
                </div>
            </div>
            <div className='sideImage'><img src={ImageLink} alt="" /></div>
        </div>
    )
}

export default AdminLogin