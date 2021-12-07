const Order = require("../models/order");
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleWare/catchAsyncError');

//create new order 
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        textPrice,
        shippingPrice,
        totalPrice
             } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        textPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})

//get single Order --login user
exports.getSingleOrder = catchAsyncError( async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "email name")

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//get all Order --login user --only for one user
exports.myOrders = catchAsyncError( async(req, res, next) => {
    const orders = await Order.find({user: req.user._id}) 
     
    res.status(200).json({
        success: true,
        orders
    })
})

//get all Order -- admin
exports.getAllOrders = catchAsyncError( async(req, res, next) => {
    const orders = await Order.find() 
     
    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//update Orders status -- admin
exports.updateOrders = catchAsyncError( async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
    
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }
    
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Order Delivered"
    });
})

async function updateStock(id, quantity){
    const product = await Product.findById(id)

    product.stock -= quantity

    await product.save({ validateBeforeSave: false})
}

//Delete Order -- admin
exports.deleteOrder = catchAsyncError( async(req, res, next) => {
    const order = await Order.findById(req.params.id) 

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404))
    }
     
    order.deleteOne()

    res.status(200).json({
        success: true,
        message: "Order deleted Successfully"
    })
})