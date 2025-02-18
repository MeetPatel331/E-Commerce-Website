import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaHistory } from 'react-icons/fa'
import { FaDownload } from 'react-icons/fa6'
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import { fixingPrice } from '../components/RemovingDuplicate'
import { useCart } from '../components/CartProvider'


const generatePDF = (cart) => {
    console.log(cart)
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice / Bill', 14, 20);
    doc.setFontSize(12);
    doc.text(`Email: ${cart.userEmail}`, 14, 30);
    doc.setFontSize(12);
    doc.text(`Date: ${cart.order_time}`, 14, 40);

    const tableColumn = ['Product Name', 'Quantity', 'Price', 'Total'];
    const tableRows = [];

    cart.items.forEach(async (item) => {
        const total = item.quantity * item.price;
        tableRows.push([item.productName, item.quantity, `$${fixingPrice(item.price)}`, `$${fixingPrice(total)}`]);
    });
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
    });
    doc.setFontSize(14);
    doc.text(`Total: $${(cart.total).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save('Invoice.pdf');
}

const OrderHistory = () => {
    const { BASE_URL } = useCart()
    const [data, SetData] = useState([])
    const token = localStorage.getItem('accessToken')
    const [loading, SetLoading] = useState(false)
    useEffect(() => {
        SetLoading(true)
        axios.post(`${BASE_URL}/order/getorderhistory`, { userId: localStorage.getItem('userId') }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            SetLoading(false)
            SetData(res.data)
            console.log(res.data)
        }).catch((err) => {
            SetLoading(false)
            console.log(err)
        })
    }, [])
    return (
        <>
            <div className='history'>
                <h1 className='overviewHeading'><FaHistory />&nbsp;Order History</h1>
                {
                    loading ? <div className="loader"></div> : <div className='userstable'>

                        {
                            data.length > 0 ?
                                data && <table>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Order</th>
                                            <th>Quantity</th>
                                            <th>Order Time</th>
                                            <th>Total</th>
                                            <th></th>
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
                                                        <td><button className='download' onClick={() => generatePDF(user)}><FaDownload /></button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table> : <div className='notfound' style={{ height: '70vh' }}>
                                    <h1>No Order history exist</h1>
                                </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default OrderHistory