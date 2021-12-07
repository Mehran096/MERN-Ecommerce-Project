const app = require("express")
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController")
const { isAuthenticatedUser } = require("../middleWare/auth")
const router = app.Router()
 
router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/stripeapiKey").get(isAuthenticatedUser, sendStripeApiKey)

module.exports = router