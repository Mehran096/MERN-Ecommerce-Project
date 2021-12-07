const app = require("express");
const { getAllProducts, createProducts, updateProduct, getSingleProduct, deleteProduct, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleWare/auth");
const router = app.Router();


//get products 
router.route('/products').get(getAllProducts)
//get products for admin
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts)
//product create
router.route('/admin/product/create').post(isAuthenticatedUser, authorizeRoles("admin"), createProducts)
//product update
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
//product single get
router.route('/product/:id').get(getSingleProduct)
//product reviews
router.route('/review').put(isAuthenticatedUser, createProductReview)
//get product reviews
router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser, deleteReview)


 
module.exports = router
