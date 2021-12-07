const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodeData.id)

    next()
    
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)){
          return  next(new ErrorHandler(`Role: ${req.user.roles} is not allowed to access this resource`, 403))
        }

        next();
      
    }

    
}