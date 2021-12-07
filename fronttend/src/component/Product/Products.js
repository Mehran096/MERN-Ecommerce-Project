import React, { Fragment, useEffect, useState } from 'react'
 
import MetaData from '../layout/MetaData';
import "./Product.css";
import ProductCard from '../Home/ProductCard';
import { clearErrors, getProduct } from '../../actions/productAction';
import {useDispatch, useSelector} from "react-redux"
import Loader from '../layout/Loader/Loader';
import {useAlert} from "react-alert"
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];


const Products = ({match}) => {
    //useSate
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)
    //dispatch
    const dispatch = useDispatch()
    //useSelector
    const {products, loading, error,  productsCount, resultPerPage } = useSelector(state => state.productReducer)
   
    //alert for errors
    const alert = useAlert()
    //params
    const keyword = match.params.keyword
    //onchange for pagination
    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    //onchange for price
    const priceHandler = (e, newPrice) => {
        setPrice(newPrice)
    }
    //count
    //let count = filteredProductsCount;
  
    //useEffect
    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, error, keyword, currentPage, price, category, ratings])
    
    //return
    return (
        <Fragment>
           {loading ? <Loader/> : 
                <Fragment>
                <MetaData title="ECOMMERCE PRODUCT"/>
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {
                            products && products.map((product) => (
                                <ProductCard product={product} key={product._id}/>
                            ))
                        }
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={25000}
                        /> 

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {
                                categories.map((category) => (
                                    <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                    >
                                        {category}
                                    </li>
                                ))
                            }
                        </ul>
                        <fieldset>
                        <Typography component="legend">Ratings Above</Typography>
                        <Slider
                            value={ratings}
                            onChange={(e, newRating) => {
                                setRatings(newRating)
                            }}
                            aria-labelledby="continous-slider"
                            valueLabelDisplay="auto"
                            min={0}
                            max={5}
                        />
                        </fieldset>

                    </div>



                    {resultPerPage < productsCount && (
                    <div className="paginationBox">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>
                    )}
                </Fragment>
           }
        </Fragment>
    )
}

export default Products
