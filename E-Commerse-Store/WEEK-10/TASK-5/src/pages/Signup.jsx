import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import axios from 'axios'
import { toast } from 'react-toastify'
import { login } from '../Redux/Reducers'
import { useDispatch } from 'react-redux'
import { useCart } from '../components/CartProvider'

const Signup = () => {
    const dispatch = useDispatch()
    const [loading, SetLoading] = useState(false)
    const { loginCart, BASE_URL } = useCart()
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        if (token && refreshToken) {
            toast.warning('You Already logged in', {
                position: 'top-right'
            })
            navigate('/')
        }
    }, [])

    const validation = Yup.object({
        firstname: Yup.string().matches(/^[A-Za-z]+$/, 'First name must not contain numbers').required('firstname is required'),
        lastname: Yup.string().matches(/^[A-Za-z]+$/, 'Last name must not contain numbers').required('lastname is required'),
        email: Yup.string().email('Invalid Format').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters long')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters').required('password is required')
    })
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: validation,
        onSubmit: (values) => {
            SetLoading(true)
            axios.post(`${BASE_URL}/auth/signup`, values).then((res) => {
                console.log(res.data)
                localStorage.setItem('accessToken', res.data.accessToken)
                localStorage.setItem('refreshToken', res.data.refreshToekn)
                localStorage.setItem('userId', res.data.id)
                toast.success('Successfully Signup', {
                    position: 'top-right'
                })
                SetLoading(false)
                loginCart()
                navigate('/')
            }).catch((err) => {
                SetLoading(false)
                console.log(err)
                toast.error(err.response.data.message, {
                    position: 'top-right'
                })
            })
            // navigate('/')
        }
    })
    const ImageLink = 'https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1692255251854-xbox.jpg'
    const navigate = useNavigate()
    return (
        <div style={{ display: 'flex', justifyContent: 'end', flexWrap: 'wrap-reverse', marginTop: '100px' }}>
            <div className='loginBox'>
                <div className='loginForm'>
                    <form action="">
                        <h1>Sign Up</h1>
                        <div className='inputs'>
                            <input type="text" style={
                                formik.errors.firstname && {
                                    border: '2px solid red'
                                }
                            } onChange={formik.handleChange} name='firstname' placeholder='First Name' />
                            {formik.errors.firstname &&
                                <span>
                                    {formik.errors.firstname}
                                </span>
                            }
                            <input type="text" style={
                                formik.errors.lastname && {
                                    border: '2px solid red'
                                }
                            } onChange={formik.handleChange} name='lastname' placeholder='Last Name' />

                            {formik.errors.lastname &&
                                <span>{formik.errors.lastname}
                                </span>
                            }
                            <input type="email" style={
                                formik.errors.email && {
                                    border: '2px solid red'
                                }
                            } onChange={formik.handleChange} name='email' placeholder='Email' />
                            {formik.errors.email &&
                                <span>{formik.errors.email}</span>
                            }
                            <input type="password" style={
                                formik.errors.password && {
                                    border: '2px solid red'
                                }
                            } placeholder='Password' onChange={formik.handleChange} name='password' />
                            {formik.errors.password &&
                                <span>{formik.errors.password}</span>
                            }

                        </div>
                        <button className='loginbtn' style={{ marginTop: '20px' }} onClick={formik.handleSubmit}>{
                            loading ? <div className="loader"></div> : 'SIGNUP'
                        }</button>
                        <p style={{ textAlign: 'center' }}>Already Have An Account? <span><Link className='links2' to='/login'>Login</Link></span></p>
                    </form>
                </div>
            </div>
            <div className='sideImage'><img src={ImageLink} alt="" /></div>
        </div>
    )
}

export default Signup