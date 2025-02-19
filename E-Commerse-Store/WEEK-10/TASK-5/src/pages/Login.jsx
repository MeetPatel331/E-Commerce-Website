import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCart } from '../components/CartProvider'
import { useDispatch } from 'react-redux'


const Login = () => {
    const navigate = useNavigate()
    const [loading, SetLoading] = useState(false)
    const { loginCart, BASE_URL, handleAdminLogin } = useCart()
    const [data, setData] = useState({
        email: '', password: ''
    })
    const [error, setError] = useState('')
    useEffect(() => {
        window.scrollTo(0, 0)
        const token = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        if (token && refreshToken) {
            toast.warning('You Already logged in', {
                position: 'top-right'
            })
            navigate('/')
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        SetLoading(true)
        axios.post(`${BASE_URL}/auth/login`, data).then((res) => {
            if (res.data.role === 'admin') {
                localStorage.setItem('accessToken', res.data.accessToken)
                localStorage.setItem('refreshToken', res.data.refreshToekn)
                localStorage.setItem('admin', 'true')
                toast.success('SuccessFully Login ! ', {
                    position: 'top-right'
                })
                handleAdminLogin()
                navigate('/admin')
                SetLoading(false)
            }
            else {
                localStorage.setItem('accessToken', res.data.accessToken)
                localStorage.setItem('refreshToken', res.data.refreshToekn)
                localStorage.setItem('userId', res.data.id)
                toast.success('SuccessFully Login ! ', {
                    position: 'top-right'
                })
                loginCart()
                handleAdminLogin()
                navigate('/')
                SetLoading(false)
            }
        }).catch((err) => {
            console.log(err)
            SetLoading(false)
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
                        <span style={{ textAlign: 'right', paddingBlock: '10px' }}><Link className='links2'>Forogot Password?</Link></span>
                        <small style={{ textAlign: 'center', color: 'red' }}>{
                            error && error
                        }</small>
                        <button className='loginbtn' onClick={(e) => handleSubmit(e)}>{
                            loading ? <div className="loader"></div> : 'LOGIN'
                        }</button>
                        <p style={{ textAlign: 'center' }}>Don't Have An Account? <span><Link to='/signup' className='links2'>Create An Account</Link></span></p>
                    </form>
                </div>
            </div>
            <div className='sideImage'><img src={ImageLink} alt="" /></div>
        </div>
    )
}

export default Login