const { Router } = require("express");
const { sendOtp, checkOtp, verifyRefreshToken } = require("./auth.controller");

const router = Router()

router.post("/send-otp", sendOtp)
router.post("/check-otp", checkOtp)
router.post("/refresh-token", verifyRefreshToken)

module.exports = {
    authRoutes: router
}