import axios from 'axios'
import React from 'react'
import { useCart } from './CartProvider'

export const refreshAccess = () => {
    const {BASE_URL}  = useCart()
    axios.post(`${BASE_URL}/check/refreshToekn`, {}, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
        }
    }).then((res) => {
        if (res.data.success) {
            return { success: true, accessToken: res.data.accessToken }
        }
    }).catch((err) => {
        if (!err.response.data.success) {
            return { success: false , accessToken : '' }
        }
    })
}

const Access = () => {
    return (
        <div>Access</div>
    )
}

export default Access