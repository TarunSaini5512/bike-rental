const router = require("express").Router();
const AuthController = require("../controller/auth.controller");
const { verifyAccessToken, verifyRole } = require("../middleware/auth.middleware");
const { validateSignup } = require("../middleware/validation.middleware");


router.post("/signup", validateSignup, AuthController.signup);

router.post("/verify-otp", AuthController.verifyOtp);

router.post("/signin", AuthController.signin);

router.post("/login", AuthController.login);

router.post("/resend-otp", AuthController.resendOtp);

router.post("/email-validity-checks", AuthController.emailValidityChecks);

router.post("/activate", verifyAccessToken, AuthController.activateAccount);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", verifyAccessToken, AuthController.resetPassword);

router.delete("/delete",verifyAccessToken,verifyRole(["ADMIN"]),AuthController.deleteAccount);


module.exports = router;
