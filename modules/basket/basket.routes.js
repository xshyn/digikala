const { Router } = require("express");
const {passport} = require("../auth/auth.gaurd")
const { addToBasket, getUserBasket } = require("./basket.controller");
const router = Router()

router.post("/add" , passport.authenticate("jwt") , addToBasket)
router.get("/" , passport.authenticate("jwt") , getUserBasket)

module.exports = {
    basketRoutes: router
}