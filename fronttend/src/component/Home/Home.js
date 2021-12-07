import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/all"
import MetaData from '../layout/MetaData';
import "./Home.css";
import ProductCard from './ProductCard';
import { clearErrors, getProduct } from '../../actions/productAction';
import {useDispatch, useSelector} from "react-redux"
import Loader from '../layout/Loader/Loader';
import {useAlert} from "react-alert"


 
const Home = () => {
    //dispatch
    const dispatch = useDispatch()
    //useSelector
    const {products, loading, error } = useSelector(state => state.productReducer)
    //alert for errors
    const alert = useAlert()

    //useEffect
    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, error])
    //return
    return (
        <Fragment>
            {
                loading ? (
                   <Loader/>
                ) : (
                    <Fragment>
                    <MetaData title = "Home Page"/>
                    <div className="banner">
                    <p>Welcome to Ecommerce</p>
                    <h1>FIND AMAZING PRODUCTS BELOW</h1>
                        <a href="#container">
                            <button>
                                Scroll <CgMouse/>
                            </button>
                        </a>
                    </div>
                    <h2 className="homeHeading">Featured Products</h2>
                    <div className="container" id="container">
                        {
                            products && products.map(product => (
                                <ProductCard product = {product} key = {product._id}/>
                            ))
                        }
                            
                    </div>
                    </Fragment>
                )
            }
        </Fragment>
    )
}

export default Home
