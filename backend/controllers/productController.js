const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleWare/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require("cloudinary")

//create Product --Admin
exports.createProducts = catchAsyncError(async(req, res) => {
        let images = []
        if(typeof req.body.images === "string"){
          images.push(req.body.images)
        }else{
          images = req.body.images
        }

        const imagesLink = []
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
          })
          imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
          })
        }
        req.body.images = imagesLink
        req.body.user = req.user.id
        const product = await Product.create(req.body);
        res.status(201).json({success: true, product})
})




//get all product
exports.getAllProducts = catchAsyncError( async(req, res) => {

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  // let products = await apiFeature.query;

  // let filteredProductsCount = products.length;
 
  // apiFeature

  const products = await apiFeature.query;
  //console.log(products)


  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    
  });
 
    // const resultPerPage = 8
    // const productCount = await Product.countDocuments()

    // const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter()

    // let products = await apiFeatures.query
    // let filterProductCount = products.length
    // apiFeatures.pagination(resultPerPage)
    // products =  await apiFeatures.query;
    // res.status(200).json({success: true, products, productCount, resultPerPage, filterProductCount})
}
    
)

//get all product for Admin
exports.getAdminProducts = catchAsyncError( async(req, res) => {
  
  const products = await Product.find()
  //console.log(products)
  res.status(200).json({
    success: true,
    products,
    
  });
     
}
    
)

//update product -- Admin
exports.updateProduct = catchAsyncError(async(req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
// Images Start Here
let images = [];

if (typeof req.body.images === "string") {
  images.push(req.body.images);
} else {
  images = req.body.images;
}

if (images !== undefined) {
  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
}

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true, useFindAndModify: false})

    res.status(200).json({ success: true,  msg: "product updated Successfully", product})
})

//get single product
exports.getSingleProduct = catchAsyncError(async(req, res, next) => {
    const id = req.params.id
   
    const product = await Product.findById(id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({ success: true,  product})
     
    
})

//delete product -- Admin
exports.deleteProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

     // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id, {
      folder: "products",
    });
  }
  
    await product.deleteOne()
    res.status(200).json({ success: true,  message: "product deleted Successfully" })
     
})

//create new review or update the review
exports.createProductReview = catchAsyncError(async(req, res, next) => {
    const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    //avg += 
    avg = avg + rev.rating;
  });

  product.ratings = avg / product.numberOfReviews

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
})

//get All Reviews of a product
exports.getProductReviews = catchAsyncError(async(req, res, next) => {
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("Product not found", 404) )
  }

  res.status(200).json({success: true, reviews: product.reviews})
})

//Delete Review
exports.deleteReview = catchAsyncError(async(req, res, next) => {
  const product = await Product.findById(req.query.productId)

  if(!product){
    return next(new ErrorHandler("Product not found", 404) )
  }

  const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString())

  let avg = 0;

   reviews.forEach((rev) => {
    //avg += 
    avg = avg + rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numberOfReviews = reviews.length
  
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numberOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({success: true, message: "Reviews Deleted Successfully"})

})



// exports.createProducts = catchAsyncError(async(req, res, next) => {
//     try {
//         const product = await Product.create(req.body);
//         res.status(201).json({success: true, product})
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message})
//     }
   
// }

// )