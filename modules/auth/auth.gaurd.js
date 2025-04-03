const { config } = require('dotenv');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../user/user.model');
const passport = require('passport');
config()
var opts = {

}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

async function verifyCallback(payload, done) {
    try {
        const user = await User.findByPk(payload.userId);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}
const strategy = new Strategy({
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()

}, verifyCallback)
passport.use("jwt", strategy);