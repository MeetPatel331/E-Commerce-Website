import React, { useEffect, useState } from 'react'
import img from '../images/watch.jpg'
import { TbTruckDelivery } from "react-icons/tb";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { IoEarthOutline } from "react-icons/io5";
import { BiMessageAltAdd } from "react-icons/bi";
import { fetchLimitedProducts, fetchProducts } from '../Redux/Reducers';
import { useDispatch, useSelector } from 'react-redux';
import { removeDuplicate } from '../components/RemovingDuplicate';
import SinglePurchase from './SinglePurchase';
import { Link } from 'react-router-dom';
import GunRack from './GunRack';
import 'react-slideshow-image/dist/styles.css'


const Home = () => {
    const dispatch = useDispatch()
    let data = useSelector((state) => state.productReducer.sliderImage)
    const [loading, SetLoading] = useState(false)
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])
    useEffect(() => {
        window.scrollTo(0,0)
        SetLoading(true)
        setTimeout(() => {
            SetLoading(false)
        },300)
    }, [])

    data = removeDuplicate(data)
    const images = ['https://www.stsslings.com/cdn/shop/files/banner_1.jpg?v=1715751530&width=750',
        'https://www.stsslings.com/cdn/shop/files/banner_2.jpg?v=1715751532&width=750', 'https://www.stsslings.com/cdn/shop/files/banner_3.jpg?v=1715751531&width=750', 'https://www.stsslings.com/cdn/shop/files/banner_4.jpg?v=1715751532&width=750'
    ]
    const imgs = [
        {
            original: images[0],
            thumbnail: images[0]
        },
        {
            original: images[1],
            thumbnail: images[1]
        },
        {
            original: images[2],
            thumbnail: images[2]
        },
        {
            original: images[3],
            thumbnail: images[3]
        }
    ]


    const [index, SetIndex] = useState(0)
    return (
        <div>
            {
                !loading ?
                    <>
                        <section className='slider'>

                            <div
                                className='slide'
                                style={{
                                    backgroundImage: `url(${images[index]})`
                                }}
                            >
                                <div className='desc'>
                                    <h1>High Quality Full Grain Leather Gun Racks</h1>
                                    <Link to='/products' className='btn'>Shop now</Link>
                                </div>
                                <div className='buttons'>
                                    <button className={index === 0 ? 'active' : ''} onClick={() => SetIndex(0)}></button>
                                    <button className={index === 1 ? 'active' : ''} onClick={() => SetIndex(1)}></button>
                                    <button className={index === 2 ? 'active' : ''} onClick={() => SetIndex(2)}></button>
                                    <button className={index === 3 ? 'active' : ''} onClick={() => SetIndex(3)}></button>
                                </div>
                            </div>
                            {/* <ImageGallery items={imgs} showBullets={true} showThumbnails={false} showIndex={true}/> */}
                        </section>
                        <div className='services'>
                            <div className='post'>
                                <div className='icon'>{<BiMessageAltAdd />}</div>
                                <div>
                                    <p>Limited Lifetime Warranty
                                        <span>
                                            Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                        </span></p>
                                </div>
                            </div>
                            <div className='post'>
                                <div className='icon'>{<IoEarthOutline />}</div>
                                <div>
                                    <p>Made in the U.S.A
                                        <span>
                                            Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                        </span></p>
                                </div>
                            </div>
                            <div className='post'>
                                <div className='icon'>{<HiAdjustmentsHorizontal />}</div>
                                <div>
                                    <p>Fully Adjustable
                                        <span>
                                            Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                        </span></p>
                                </div>
                            </div>
                            <div className='post'>
                                <div className='icon'>{<TbTruckDelivery />}</div>
                                <div>
                                    <p>Free Shipping
                                        <span>
                                            Consectetur adipi elit <br /> lorem ipsum dolor sit amet.
                                        </span></p>
                                </div>
                            </div>
                        </div>
                        <SinglePurchase />
                        <GunRack />
                    </> : <div style={{ display: 'grid', placeContent: 'center', height: '100vh', }}>
                        <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
                    </div>
            }
        </div>
    )
}

export default Home