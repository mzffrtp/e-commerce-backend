const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const genErr = require("../utils/genErr");

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.findOne({ email })
    if (user) return next(genErr(400, "User is already registered, please login!"))

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name: email, hashedPassword })

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

exports.forgotPassword = async (req, res) => {

};

exports.resetPassword = async (req, res) => {

};