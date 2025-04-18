const { Router } = require("express");
const {passport} = require("../auth/auth.gaurd")
const { addToBasketHandler } = require("./basket.controller");
const router = Router()

router.post("/add" , passport.authenticate("jwt") , addToBasketHandler)

module.exports = {
    basketRoutes: router
}