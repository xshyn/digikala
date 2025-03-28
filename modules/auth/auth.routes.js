const { Router } = require("express");
const { sendOtp } = require("./auth.controller");

const router = Router()

router.post("/send-otp" , sendOtp)

module.exports = {
    authRoutes: router
}