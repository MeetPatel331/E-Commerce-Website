import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaCcDiscover, FaCcMastercard, FaCcVisa, FaMinus } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaPaypal } from "react-icons/fa";
import { SiAmericanexpress, SiShopify } from 'react-icons/si';
import { IoLogoVenmo } from 'react-icons/io5';
import { GiBreakingChain } from "react-icons/gi";
import { CiStar } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { addCart } from '../Redux/Reducers';
import { useDispatch, useSelector } from 'react-redux';
import { openCart, closeNav } from '../components/Navbar';
import { fixingPrice } from '../components/RemovingDuplicate';
import { fetchSingleProduct } from '../Redux/Reducers';
import { useCart } from '../components/CartProvider';

const Product = () => {
    const id = useParams().id
    const data = useSelector((state) => state.productReducer.singleProduct)
    const loading = useSelector((state) => state.productReducer.loading)
    const dispatch = useDispatch()
    const [quantity, Setquantity] = useState(1)
    const { BASE_URL, addToCart } = useCart()
    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(fetchSingleProduct(id))
    }, [])


    const decreament = () => {
        if (quantity != 1) {
            Setquantity(quantity - 1)
        }
    }
    const increament = () => {
        Setquantity(quantity + 1)
    }
    return (
        <div style={{
            display: 'flex', flexDirection: 'column'
        }}>
            {
                loading ? <div style={{ display: 'grid', placeContent: 'center', height: '100vh', }}>
                    <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
                </div> : <>
                    <div className='productPage'>
                        <div className='productImage'>
                            <img src={data?.image} alt="" />
                        </div>
                        <div className='productCard'>
                            <h2 className='title'>{data?.title}</h2>
                            <span>$ {fixingPrice(data?.price)}</span>
                            <p className='des'>{data?.description}</p>
                            <div>
                                <p className='color'>Color : {data?.color}</p>
                                <div className='quantity'>

                                    <div className='quantityOpt'>

                                        <p><button onClick={decreament}>{<FaMinus />}</button></p>
                                        <p>
                                            <input type="text" onChange={(e) => {
                                                Setquantity(parseInt(e.target.value))
                                            }} value={quantity} />
                                        </p>
                                        <p><button onClick={increament}>{<IoMdAdd />}</button></p>
                                    </div>
                                </div>
                            </div>
                            <div className='product-btns'>
                                <button onClick={() => {
                                    addToCart(data._id, quantity)
                                    openCart()
                                }}>ADD TO CART</button>
                                <button className='exp'>Buy with  <FaPaypal /></button>
                            </div>
                            <span style={{
                                textAlign: 'center', marginBlock: '15px', textDecoration: 'underline', cursor: 'pointer'
                            }}>MORE PAYMENT OPTIONS</span>
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
                        </div>
                    </div>
                    <div className='services' style={{
                        gridTemplateColumns: 'auto auto auto', gap: '5%', justifyContent: 'space-evenly'
                    }} >
                        <div className='post' style={{ display: 'flex' }}>
                            <div className='icon'>{<GiBreakingChain />}</div>
                            <div>
                                <p >Limited Lifetime Warranty
                                    <span style={{ display: 'block' }}>
                                        Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                    </span></p>
                            </div>
                        </div>
                        <div className='post'>
                            <div className='icon'>{<CiStar />}</div>
                            <div>
                                <p>Made in the U.S.A
                                    <span style={{ display: 'block' }}>
                                        Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                    </span></p>
                            </div>
                        </div>
                        <div className='post'>
                            <div className='icon'>{<SiTicktick />}</div>
                            <div>
                                <p>Fully Adjustable
                                    <span style={{ display: 'block' }}    >
                                        Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                    </span></p>
                            </div>
                        </div>
                    </div>
                </>
            }

        </div>
    )
}

export default Product