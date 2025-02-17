import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { fetchProducts } from '../Redux/Reducers'
import { removeDuplicate } from '../components/RemovingDuplicate'
import { filterArray } from '../components/RemovingDuplicate'

const Mobiles = () => {
    const dispatch = useDispatch()
    let data = useSelector((state)=>state.productReducer.product)
    useEffect(()=>{
        dispatch(fetchProducts())
    },[dispatch])

    data = removeDuplicate(data)
    data = filterArray(data)
     
  return (
    <div className='mobiles'>
        {
            data && data.map((item,index)=>{
                return (
                    <div key={index}>
                        <img src={item.image} alt="mobile" />
                        <div>
                            <h2>{item.model}</h2>
                            <h2 className='price'>{`$ ${item.price}`}</h2>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Mobiles