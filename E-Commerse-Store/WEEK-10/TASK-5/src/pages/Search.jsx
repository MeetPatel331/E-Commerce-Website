import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addCart } from '../Redux/Reducers'
import { openCart } from '../components/Navbar'
import { fixingPrice, removeDuplicate } from '../components/RemovingDuplicate'
import { fetchProducts } from '../Redux/Reducers'

const Search = () => {
    const query = useParams().q;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let search = []
    let data = useSelector((state) => state.productReducer.product)
    let loading = useSelector((state) => state.productReducer.loading)
    data = removeDuplicate(data)
    for (let i of data) {
        if (String(i.title).toLowerCase().includes(String(query).toLowerCase())) {
            search.push(i)
        }
    }
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])


    return (
        <div>
            {
                !loading ? <> {
                    search.length > 0 ? <div className='search-items'>
                        {
                            search && search.map((item, index) => {
                                return (
                                    <div key={index} className='collection-card'>
                                        <div>
                                            <img src={item.image} alt="" onClick={() => {
                                                navigate(`/product/${item.id}`)
                                            }} />
                                        </div>
                                        <p>{String(item.title).slice(0, 15)}<br />
                                            {`$ ${fixingPrice(item.price)}`}<br />{`Colour : ${item.color}`}
                                        </p>
                                        <button className='collection-btn' onClick={() => {
                                            dispatch(addCart({ ...item, ['quantity']: 1 }));
                                            openCart()
                                        }}>Add To cart</button>
                                    </div>
                                )
                            })
                        }
                    </div> : <div style={{ height: '100vh', display: 'grid', placeContent: 'center', color: 'red' }}>
                        <h1>No Search result for {query}</h1>
                    </div>
                }</> : <div style={{ display: 'grid', placeContent: 'center', height: '100vh', }}>
                    <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
                </div>
            }

        </div>
    )
}

export default Search