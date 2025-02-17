import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toastErrorMessage, toastSuccessMessage } from '../components/RemovingDuplicate'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'
import { refreshAccess } from '../components/Access'
import { useCart } from '../components/CartProvider'

const AddUser = () => {
    const [data, setData] = useState({})
    const {BASE_URL}=useCart()
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${BASE_URL}/admin/adduser`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('updateStatus', 'true');
            toastSuccessMessage('User Added')
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
                <h1>Add User</h1>
                <div>
                    <input type="text" name='firstname' value={data.firstname} onChange={(e) => handleChange(e)} placeholder='User Firstname' />
                    <input type="text" name='lastname' value={data.lastname} onChange={(e) => handleChange(e)} placeholder='User Lastname' />
                </div>

                <div>
                    <input type="email" name='email' value={data.email} onChange={(e) => handleChange(e)} placeholder='User Email' />
                    <input type="passoword" name='password' value={data.password} onChange={(e) => handleChange(e)} placeholder='Create Password' />
                </div>

                <button onClick={(e) => handleSubmit(e)}>ADD</button>
                <button className='backbtn' onClick={() => {
                    window.history.back()
                }}><FaArrowLeft />&nbsp;Back</button>
            </form>
        </div>
    )
}

export default AddUser