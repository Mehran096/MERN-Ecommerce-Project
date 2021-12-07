import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { DUProductReducer, newproductReducer, newReviewReducer, productReducer, productReviewsReducer, reviewReducer } from "./reducers/productReducer"
import { productDetailsReducer } from "./reducers/productReducer"
import { userReducer, profileReducer, forgotPasswordReducer, allUsersdReducer, userDetailsdReducer } from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer"
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
 

const reducers = combineReducers({
  productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  newReview: newReviewReducer,
  newProduct: newproductReducer,
  product: DUProductReducer,
  allUsers: allUsersdReducer,
  userDetails: userDetailsdReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
  
})


let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems") 
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  }
}

const middleWare = [thunk]

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middleWare)))

 export default store