import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaArrowDown, FaArrowUp, FaCartArrowDown, FaPlus } from 'react-icons/fa'
import { IoMdTime } from 'react-icons/io'
import { MdEmail } from 'react-icons/md'
import { useCart } from '../components/CartProvider'
const Orders = () => {
    const [data, SetData] = useState([])
    const token = localStorage.getItem('accessToken')
    const {BASE_URL}=useCart()
    const sortUp = () => {
        let info = []
        info = data.sort((a, b) => a.total - b.total)
        SetData(data.sort((a, b) => a.total - b.total))
    }
    const sortDown = () => {
        const info = data.sort((a, b) => {
            return b.total - a.total
        })
        SetData(info)
    }
    useEffect(() => {
        axios.post(`${BASE_URL}/order/getorders`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            SetData(res.data.orders)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <>
            <h1 className='overviewHeading'><FaCartArrowDown/>&nbsp;    Orders</h1>
            {
                <div className='userstable'>
                    {
                        data.length > 0 ?
                            data && <table>
                                <thead>
                                    <tr>
                                        <th><MdEmail/>&nbsp;Email</th>
                                        <th>Order</th>
                                        <th>Quantity</th>
                                        <th><IoMdTime />&nbsp;Order Time</th>
                                        <th >Total&nbsp;<FaArrowUp style={{
                                            cursor: 'pointer'
                                        }} onClick={sortUp} />&nbsp;<FaArrowDown style={{
                                            cursor: 'pointer'
                                        }} onClick={() => sortDown()} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((user) => {
                                            return (
                                                <tr>
                                                    <td>{user.userEmail}</td>
                                                    <td style={{
                                                        textAlign: 'center',
                                                    }}>{user.items.map((order) => {
                                                        return <p>{String(order.productName).slice(0, 105)}</p>
                                                    })}</td>
                                                    <td>{user.items.map((order) => {
                                                        return <p>{order.quantity}</p>
                                                    })}</td>
                                                    <td>{user.order_time}</td>
                                                    <td style={{
                                                        fontWeight: 'bold'
                                                    }}>${parseFloat(user.total).toFixed(2)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table> : <div className='notfound' style={{ height: '70vh' }}>
                                <h1>No Orders</h1>
                            </div>
                    }
                </div>
            }
        </>
    )
}

export default Orders