const app = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUSerProfile, getAllUSers, getAdminDetails, updateUSerRoles, deleteUser } = require("../controllers/userController");
const router = app.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../middleWare/auth");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,  updateUserPassword)
router.route("/me/update").put(isAuthenticatedUser, updateUSerProfile)
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUSers)
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminDetails)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUSerRoles).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


module.exports = router;