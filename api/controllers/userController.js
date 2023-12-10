const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const genErr = require("../utils/genErr");
const cloudinary = require('cloudinary').v2;
const crypto = require("crypto");
const { sendMail } = require("../utils/sendMail");

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body

    const avatar = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 130,
        croph: "scale"
    })

    const user = await User.findOne({ email })
    if (user) return next(genErr(400, "User is already registered, please login!"))

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.secure_url
        }
    })

    //! token
    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }

    res.status(201).cookie("accessToken", token, cookieOptions).json({
        message: "User registered succesfully!",
        newUser,
        token
    })



};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) return next(genErr(400, "User not found!"))


    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return next(genErr(400, "Wrong password or email"))

    //! token
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }

    res.status(200).cookie("accessToken", token, cookieOptions).json({
        message: "User loged in succesfully!",
        user,
        token
    })
};

exports.logout = async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now())
    }
    res.status(200).cookie("accessToken", null, cookieOptions).json({
        message: "User loged in succesfully!",
    })
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) return next(genErr(404, "No account for this user!"))

    //!token for resetting password
    const resetToken = crypto.randomBytes(20).toString("hex");

    //! token to db as encrypted
    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    //! token expiring after a short time
    user.resetPasswordTokenExpires = Date.now() + 5 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    const passwordresetUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`

    try {
        await sendMail({
            email: user.email,
            subject: "Reset Password",
            text: "Here is your reset password link. Please rest your passsword in 10 minutes! Hava a nice day " + passwordresetUrl
        })

        res.status(200).json({
            status: "success",
            message: "reset url was send to user!"
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpires = undefined

        await user.save({ validateBeforeSave: false });
        next(genErr(500, "Error at reset password sending mail"))
    }

};

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpires: { $gt: Date.now() }
    })

    if (!user) return next(genErr(400, "Unvalid token!"))

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save()

    //! token
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }

    res.status(200).cookie("accessToken", token, cookieOptions).json({
        message: "password reseted successfully",
        user,
        token
    })
};

exports.userDetail = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        message: "Here is user details",
        user,
    })
}