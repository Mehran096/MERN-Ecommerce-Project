const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleWare/catchAsyncError');
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const senToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

//Register user
exports.registerUser = catchAsyncError( async (req, res, next) => {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale"
        })

        const {name, email, password, roles} = req.body

        const user = await User.create({
            name, email, password, roles,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })

       senToken(user, 201, res)
})

//Login User

exports.loginUser = catchAsyncError( async(req, res, next) => {
    const {email, password} = req.body

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 401))
    }

    const user  = await User.findOne({ email }).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password"), 401)
    }

    const isPasswordMatched = await user.comparePassword(password)
    //const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    } 

    senToken(user, 200, res)

    
})

//Logout User

exports.logout = catchAsyncError( async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

//Forgot Password
exports.forgotPassword = catchAsyncError( async(req, res, next) => {

const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host")}/password/reset/${resetToken}`;
  //const  resetPasswordUrl = `req.protocol}://${req.get("host")`

  const message = `Your password reset token is d :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
})

// reset password
exports.resetPassword = catchAsyncError( async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now()},
  })

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not matched", 400))
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  senToken(user, 200, res)
})

//get user details
exports.getUserDetails = catchAsyncError(async(req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({ success: true, user })
})

//update user password
exports.updateUserPassword = catchAsyncError(async(req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    //const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect", 401))
    } 

    if(req.body.newPassword !== req.body.confirmPassword){
      return next(new ErrorHandler("Password does not matched", 400))
    }
  
    user.password = req.body.newPassword;
    await user.save()
    senToken(user, 200, res)
})

//update user profile
exports.updateUSerProfile = catchAsyncError(async(req, res, next) => {
  const newUSerData = {
    name: req.body.name,
    email: req.body.email
  }

  //cloudnary later
  if(req.body.avatar !== ""){
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale"
    })
    newUSerData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUSerData, {new: true, runValidators: true, useFindAndModify: false})

  res.status(200).json({success: true})
})

//get All Users --admin
exports.getAllUSers = catchAsyncError(async(req, res, next) => {
  const users = await User.find();
  res.status(200).json({success: true, users})
})

//get Details Users --admin
exports.getAdminDetails = catchAsyncError(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
  }
  res.status(200).json({success: true, user})
})

//update user role -- admin
exports.updateUSerRoles = catchAsyncError(async(req, res, next) => {
  const newUSerData = {
    name: req.body.name,
    email: req.body.email,
    roles: req.body.roles
  }

  
  const user = await User.findByIdAndUpdate(req.params.id, newUSerData, {new: true, runValidators: true, useFindAndModify: false})

  res.status(200).json({success: true})
})

//Delete Users --admin
exports.deleteUser = catchAsyncError(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400))
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne()
  res.status(200).json({success: true,  message: "User deleted Successfully"})
})






// exports.loginUser = catchAsyncError( async(req, res, next) => {
//     const {email, password} = req.body

//     //checking if user has given password and email both

//     if(!email || !password){
//         return next(new ErrorHandler("Please enter email and password", 401))
//     }

//     const user  = await User.findOne({ email }).select("+password")

//     if(!user){
//         return next(new ErrorHandler("Invalid Email or Password"), 401)
//     }

//     //const isPasswordMatched = user.comparePassword(password)
//     const isPasswordMatched = await bcrypt.compare(password, user.password)

//     if(isPasswordMatched){
//         const token = user.getJWTToken();

//     return    res.status(200).json({
//             success: true,
//             token,
//             user

//         })
//     }else{
//         return next(new ErrorHandler("Invalid Email or Password", 401))
//     }

    
 