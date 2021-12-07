import React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import "./Cart.css"
import CartItemCard from './CartItemCard'
import { useSelector, useDispatch } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartAction'
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";


const Cart = ({history}) => {
    //useSelector
    const {cartItems} = useSelector(state => state.cart)
    //dispatch
    const dispatch = useDispatch()
     
    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1
        if(stock <= quantity){
            return
        }
        dispatch(addItemToCart(id, newQty))
    }

    const deccreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1
        if(1 >= quantity){
            return
        }
        dispatch(addItemToCart(id, newQty))
    }

    //delete card Item
    const deleteCartItems = (id) => {
        const confirm = window.confirm("Do You really want to remove")
        if(confirm) {
            dispatch(removeItemFromCart(id))
        }
        
    }

    //checkOut handler
    const checkOutHandler = () => {
        history.push("/login?redirect=shipping")
    }
    return (
        <Fragment>
            {
            cartItems.length === 0 ? 
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div> : <Fragment>
             <div className="cartPage">
                 <div className="cartHeader">
                     <p>Product</p>
                     <p>Quantity</p>
                     <p>Subtotal</p>
                 </div>
                 {
                     cartItems && cartItems.map((item) => (
                    <div className="cartContainer" key={item.product}>
                        <CartItemCard deleteCartItems={deleteCartItems} item={item}/>
                        <div className="cartInput">
                            <button onClick={() => deccreaseQuantity(item.product, item.quantity)}>-</button>
                            <input type="number" value={item.quantity} readOnly/>
                            <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                        </div>
                        <p className="cartSubtotal">
                            {`₹${item.price * item.quantity}`}
                        </p>
                 </div>
                     ))
                 }
                 <div className="cartGrossProfit">
                     <div></div>
                     <div className="cartGrossProfitBox">
                         <p>Gross Total</p>
                         <p>{`₹${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                     </div>
                     <div></div>
                     <div className="checkOutBtn">
                         <button onClick={checkOutHandler}>Check Out</button>
                     </div>
                 </div>
             </div>
        </Fragment>
            }
        </Fragment>
    )
}

export default Cart
