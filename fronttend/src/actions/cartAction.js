import axios from "axios";
import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

//add to card
export const addItemToCart = (id, quantity) => async (dispatch, getstate) => {
    
        const {data} = await axios.get(`/product/${id}`)
        dispatch({
            type: ADD_TO_CART, 
            payload: {
             product:data.product._id,
             name: data.product.name,
             price: data.product.price,
             image: data.product.images[0].url,
             stock: data.product.stock,
             quantity
            }
            })
    localStorage.setItem("cartItems", JSON.stringify(getstate().cart.cartItems))
}

//remove to card
export const removeItemFromCart = (id) => async (dispatch, getstate) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id
    })
    localStorage.setItem("cartItems", JSON.stringify(getstate().cart.cartItems))
}

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
  
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };