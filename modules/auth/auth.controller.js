const createHttpError = require("http-errors")
const { User, Otp } = require("../user/user.model")
const otpGenerator = require('otp-generator')

async function sendOtp(req, res, next) {
    try {
        const { mobile } = req.body
        let user = await User.findOne({ where: { mobile } })
        if (!user) user = await User.create({ mobile })

        let otp = await Otp.findOne({ where: { userId: user.id } })

        if (otp) {
            const now = new Date()
            const isExpired = otp.expires.getTime() > now.getTime()
            
            if (isExpired) throw createHttpError(400, "last otp has not expired yet")
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

module.exports = {
    sendOtp
}