import React, { useEffect, useState } from 'react'
import { FaCcDiscover, FaCcMastercard, FaCcVisa, FaMinus, FaPaypal, FaStarHalf } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { manageQuantity } from '../Redux/Reducers'
import { IoMdAdd } from 'react-icons/io'
import { fetchProducts } from '../Redux/Reducers'
import { IoLockClosedOutline, IoLogoVenmo } from 'react-icons/io5'
import { SiAmericanexpress, SiShopify } from 'react-icons/si'
import { addCart } from '../Redux/Reducers'
import { FaStar } from 'react-icons/fa'
import { openCart } from '../components/Navbar'
import ImageGallery from 'react-image-gallery'
import {  fixingPrice } from '../components/RemovingDuplicate'
import { useCart } from '../components/CartProvider'
import { useNavigate } from 'react-router-dom'


const SinglePurchase = () => {
    const dispatch = useDispatch()
    const data = useSelector((state) => state.productReducer.product)
    const [q, Setq] = useState(1)
    const { addToCart, loading } = useCart()
    const images = [];
    let item;
    if (!localStorage.getItem('admin')) {
        item = data[0]
    }
    const navigate = useNavigate()
    if (data.length > 0) {
        for (let i of data) {
            images.push({
                original: i.image,
                thumbnail: i.image
            })
        }
    }
    useEffect(() => {
        if (localStorage.getItem('admin')) {
            navigate('/')
        }
        else {
            dispatch(fetchProducts())
            const right = document.getElementsByClassName('image-gallery-right-nav')
            const left = document.getElementsByClassName('image-gallery-left-nav')
            if (right.length > 0 && left.length > 0) {
                document.getElementsByClassName('image-gallery-right-nav')[0].innerHTML = ''
                document.getElementsByClassName('image-gallery-right-nav')[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>`
                document.getElementsByClassName('image-gallery-left-nav')[0].innerHTML = ''
                document.getElementsByClassName('image-gallery-left-nav')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"/></svg>'
            }
        }
    }, [])
    return (
        <div className='singlePurchase'>
            {
                item ?
                    <><div className='image' style={{}}>
                        {/* <img src={'https://www.stsslings.com/cdn/shop/files/SouthTexasSlings_0004_Layer2_1200x.jpg?v=1683995100'} alt="" /> */}
                        <ImageGallery
                            items={images}
                            showThumbnails={true}
                            showBullets={false}
                            thumbnailPosition='bottom'
                            showPlayButton={false}
                            showFullscreenButton={false}
                            showNav={true} />
                    </div><div className='data'>
                            <h1>{String(item?.title).slice(0, 20).padEnd(23, '.')}</h1>
                            <div style={{ display: 'flex' }}>
                                <p><FaStar /></p>
                                <p><FaStar /></p>
                                <p><FaStar /></p>
                                <p><FaStar /></p>
                                <p><FaStarHalf /></p>
                                <p>6 Reviews</p>
                            </div>
                            <h2>${fixingPrice(item?.price)}</h2>
                            <p>
                                From $26.99/mo or 0% APR with
                                Check your purchasing power
                            </p>

                            <h4>Color : {item?.color}</h4>
                            <h4>Quantity : </h4>
                            <div className='quantityOpt'>
                                <p><button onClick={() => q > 1 ? Setq(q - 1) : ''}>
                                    <FaMinus />
                                </button></p>
                                <p>
                                    <input
                                        type="text" onChange={(e) => {
                                            Setq(parseInt(e.target.value))
                                        }}
                                        value={q} />
                                </p>
                                <p><button onClick={() => Setq(q + 1)}>
                                    <IoMdAdd />
                                </button></p>
                            </div>
                            <div className='btns'>
                                <button onClick={async () => {
                                    await addToCart(item._id, q)
                                    openCart()
                                }}>{
                                        loading ? <div className="loader"></div> : 'BUY NOW'
                                    }</button>
                                <button style={{
                                    backgroundColor: 'blue'
                                }}>Buy with SHOP Pay</button>
                            </div>
                            <p style={{ textAlign: 'center' }}><a href="">MORE PAYMENT OPTIONS</a></p>
                            <div className='bottom'>
                                <br />

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
                        </div></> : <div className="loader"></div>
            }
        </div>

    )
}

export default SinglePurchase