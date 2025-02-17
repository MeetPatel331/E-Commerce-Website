import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { c } from './Cart'
import { FaAngleRight, FaCcDiscover, FaCcMastercard, FaCcVisa, FaMinus, FaPaypal } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'
import { manageQuantity } from '../Redux/Reducers'
import { IoLockClosedOutline, IoLogoVenmo } from 'react-icons/io5'
import { SiAmericanexpress, SiShopify, SiTicktick } from 'react-icons/si'
import { TbTruckDelivery } from 'react-icons/tb'
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { deleteItemfromCart } from '../Redux/Reducers'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { fixingPrice, updateCart } from '../components/RemovingDuplicate'
import axios from 'axios'
import { useCart } from '../components/CartProvider'
import { toast } from 'react-toastify'

const FullCart = () => {
    const [data, setData] = useState([])
    const [loading, SetLoading] = useState(false)
    const navigate = useNavigate()
    const [text, SetText] = useState(false)
    const { cart, total, updateCartItem, removeFromCart } = useCart()
    const [quantity, setCartQuantity] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
        if (localStorage.getItem('admin')) {
            navigate('/')
        }
        SetLoading(true)
        setTimeout(() => {
            SetLoading(false)
            setData(cart)
            let q = 0;
            for (let i of cart) {
                q += i.quantity
            }
            setCartQuantity(q)
        }, 700)
    }, [])
    useEffect(() => {
        setData(cart)
        let q = 0;
        for (let i of cart) {
            q += i.quantity
        }
        setCartQuantity(q)
    }, [cart])

    const checkout = () => {
        if (localStorage.getItem('userId')) {
            navigate('/checkout')
        }
        else {
            toast.warning('Login to checkout', {
                position: 'top-right'
            })
            navigate('/login')
        }
    }

    return (

        <div className='fullCart'>
            {
                !loading ?
                    <>
                        {
                            data.length === 0 ? <div className='EmptyCart'>
                                <h1>Your Cart is empty</h1>
                                <button onClick={() => {
                                    navigate('/products')
                                }}>CONTINUE SHOPPING</button>
                                <h2>Have an Account ? </h2>
                                <p><span>Log in </span>to check faster</p>
                            </div> :
                                <div className='mainCart'>
                                    <div className='cart-items'>
                                        <div className='header2'>
                                            <h2>Your Cart({quantity})</h2>
                                            <h2 style={{ cursor: 'pointer' }} onClick={() => {
                                                navigate('/products')
                                            }}>CONTINUE SHOPPING <FaAngleRight /> </h2>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>SubTotal</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data && data.map((item, index) => {
                                                        return <tr key={index}>
                                                            <td><img src={item.image} width={40} height={40} alt="fhf" /></td>
                                                            <td id='title'>{String(item.title).slice(0, 15).padEnd(18, '.')} <br /> {item.color} </td>
                                                            <td>${fixingPrice(item.price)}</td>
                                                            <td>
                                                                <div className='quantityOpt' style={{ marginLeft: '25%' }}>
                                                                    <p>
                                                                        <button onClick={() => {
                                                                            if (item.quantity > 1) {
                                                                                updateCartItem(item._id, item.quantity - 1);
                                                                            }
                                                                            else if (item.quantity === 1) {
                                                                                removeFromCart(item._id);
                                                                            }
                                                                        }}>
                                                                            <FaMinus />
                                                                        </button>
                                                                    </p>
                                                                    <p>
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            value={item.quantity}
                                                                        />
                                                                    </p>
                                                                    <p>
                                                                        <button onClick={() =>
                                                                            updateCartItem(item._id, item.quantity + 1)
                                                                        }>
                                                                            <IoMdAdd />
                                                                        </button>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td>${(parseInt(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
                                                            <td style={{ cursor: 'pointer' }} onClick={() => {
                                                                removeFromCart(item._id);
                                                            }}>{<MdDelete />}</td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='cart-pricing'>
                                        <h2>Cart Total</h2>
                                        <div className='price'>
                                            <div>
                                                <h4>SubTotal : </h4>
                                                <h4>${total.toFixed(2)}</h4>
                                            </div>
                                            <span style={{ display: 'block', width: '100%', height: '2px', backgroundColor: "gray" }}></span>
                                            <div style={{ color: '#A97A5B' }}>
                                                <h2>Total : </h2>
                                                <h2>${total.toFixed(2)}</h2>
                                            </div>
                                        </div>

                                        <p style={{ color: 'gray', fontWeight: '500' }}>Taxes and shipping calculated at checkout</p>
                                        <span onClick={() => SetText(!text)} style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '5%', paddingBlock: '10px', borderBottom: '1px solid gray' }}><IoDocumentTextOutline />&nbsp;Order special instructions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <MdKeyboardArrowDown style={{ fontSize: '22px' }} /></span>
                                        {
                                            text ?
                                                <textarea style={{ padding: '15px', borderRadius: '10px', border: 'none', margin: '10px' }} name="" placeholder='order instructions' id=""></textarea> : ""
                                        }
                                        <button className='bottomBtns' onClick={() => checkout()}>CHECKOUT</button>
                                        <div className='bottom'>
                                            <br />
                                            <span style={{ textAlign: 'center' }}><IoLockClosedOutline />&nbsp;Guaranteed Safe Checkout</span>
                                            <div className='paying' style={{
                                                display: 'grid',
                                                placeContent: 'center'
                                            }}>
                                                <ul>
                                                    <li><SiAmericanexpress /></li>
                                                    <li><FaCcDiscover /></li>
                                                    <li><FaCcMastercard /></li>
                                                    <li><FaPaypal /></li>
                                                    <li><SiShopify /></li>
                                                    <li><IoLogoVenmo /></li>
                                                    <li><FaCcVisa /></li>
                                                </ul>
                                            </div>
                                            <br /><br />
                                        </div>
                                        <div className='bottomHeading' style={{ backgroundColor: 'transparent', color: '#A97A5B', fontWeight: 'bold' }}>
                                            <span><TbTruckDelivery />&nbsp;Free Shipping</span>
                                            <span><SiTicktick />&nbsp;Limited LifeTime Warranty</span>
                                        </div>
                                    </div>
                                </div>
                        }
                    </> : <div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
                        <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
                    </div>
            }
        </div>
    )
}

export default FullCart