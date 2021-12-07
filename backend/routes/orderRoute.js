const app = require("express")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrders, deleteOrder } = require("../controllers/orderController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleWare/auth")
const router = app.Router()


//for user
router.route('/create/order').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser,  getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser, myOrders)
//for admin
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateOrders).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
 
module.exports = router