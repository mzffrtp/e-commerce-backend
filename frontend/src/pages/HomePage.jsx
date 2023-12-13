import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from '../redux/productSlice'

const HomePage = () => {
    const dispatch = useDispatch()
    const { products, loading } = useSelector(state => state.products)

    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch])

    console.log("urunler anasyafa-->", products, loading);
    return (
        <div>HomePage</div>
    )
}

export default HomePage