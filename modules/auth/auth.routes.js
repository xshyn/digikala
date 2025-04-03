const { Router } = require("express");
const { sendOtp, checkOtp, verifyRefreshToken } = require("./auth.controller");
require("./auth.gaurd")
const passport = require("passport");

const router = Router()

router.post("/send-otp", sendOtp)
router.post("/check-otp", checkOtp)
router.post("/refresh-token", verifyRefreshToken)
router.get("/check-login", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    try {
        return res.json(req?.user ?? { msg: "user not found" })
    } catch (error) {
        next(error)
    }
})

module.exports = {
    authRoutes: router
}