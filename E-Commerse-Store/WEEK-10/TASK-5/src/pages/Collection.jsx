import React, { useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import img from '../images/watch.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLimitedProducts } from '../Redux/Reducers'
import { addToCart, fixingPrice, removeDuplicate } from '../components/RemovingDuplicate'
import { useNavigate } from 'react-router-dom'
import { addCart } from '../Redux/Reducers'
import { openCart, closeNav } from '../components/Navbar'
import { useCart } from '../components/CartProvider'

const Collection = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading2 = useSelector((state) => state.productReducer.loading)
  const [loadingIndex, SetLoadingIndex] = useState(null)
  let data = useSelector((state) => state.productReducer.sliderImage)
  const { addToCart, loading } = useCart()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (localStorage.getItem('admin')) {
      navigate('/')
    }
  }, [])
  useEffect(() => {
    dispatch(fetchLimitedProducts())
  }, [dispatch])
  data = removeDuplicate(data)

  return (
    <>
      {
        !loading2 ? <>
          <div className='collection'>
            <div className='collection-bg' style={{ backgroundImage: `url(${img})` }}>
              <div className='content'>
                <p><FaHome />&nbsp;/ Collection</p>
                <h1>Our Collection</h1>
                <p>Get Your South Texas Sling Today!</p>
              </div>
            </div>
            <div className='collection-items'>
              {
                data && data.map((item, index) => {
                  return (
                    <div key={index} className='collection-card'>
                      <div>
                        <img src={item.image} alt="" onClick={() => {
                          navigate(`/product/${item._id}`)
                        }} />
                      </div>
                      <h1>{String(item.title).slice(0, 35)}</h1>
                      <span>{`Colour : ${item.color}`}</span>
                      <p> {`$ ${fixingPrice(item.price)}`}</p>
                      <button className='collection-btn' onClick={async () => {
                        SetLoadingIndex(index)
                        await addToCart(item._id, 1)
                        SetLoadingIndex(null)
                        openCart()
                      }}>{
                          index === loadingIndex ? <div className="loader"></div> : 'Add To Cart'
                        }</button>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </> : <div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
          <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
        </div>
      }
    </>
  )
}

export default Collection