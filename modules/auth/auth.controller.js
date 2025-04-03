const createHttpError = require("http-errors")
const { User, Otp } = require("../user/user.model")
const otpGenerator = require('otp-generator')
const { config } = require("dotenv")
const jwt = require("jsonwebtoken")
config()

async function sendOtp(req, res, next) {
    try {
        const { mobile } = req.body
        let user = await User.findOne({ where: { mobile } })
        if (!user) user = await User.create({ mobile })

        let otp = await Otp.findOne({ where: { userId: user.id } })

        if (otp) {
            const now = new Date()
            const isNotExpired = otp.expires.getTime() > now.getTime()

            if (isNotExpired) throw createHttpError(400, "last otp has not expired yet")
            else {
                await otp.destroy()
            }
        }
        otp = await Otp.create({
            userId: user.id,
            code: otpGenerator.generate(5, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        })
        return res.json({
            message: "otp generated successfully",
            code: otp.code,
        })

    } catch (error) {
        next(error)
    }
}
async function checkOtp(req, res, next) {
    try {
        const { mobile, code } = req.body
        let user = await User.findOne({ where: { mobile } })
        if (!user) throw createHttpError(401, "not found user account")
        const otp = await Otp.findOne({ where: { userId: user.id } })
        if (otp?.code !== code) throw createHttpError(401, "otp code is invalid")
        if (otp?.expires < new Date()) throw createHttpError(401, "otp is expired")

        const { accessToken, refreshToken } = generateToken({ userId: user.id })

        return res.json({
            message: "logged in successfully",
            accessToken,
            refreshToken
        })

    } catch (error) {
        next(error)
    }
}

async function verifyRefreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw {}

        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (verified?.userId) {
            const user = await User.findByPk(verified.userId)
            if (!user) throw {}

            const { accessToken, refreshToken } = generateToken({ userId: user.id })

            return res.json({
                message: "token refreshed",
                accessToken,
                refreshToken
            })
        }

    } catch (error) {
        next(createHttpError(401, "login to your account"))
    }
}
function generateToken(payload) {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "7d"
    })
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    })
    return { accessToken, refreshToken }

}

module.exports = {
    sendOtp,
    checkOtp,
    verifyRefreshToken
}