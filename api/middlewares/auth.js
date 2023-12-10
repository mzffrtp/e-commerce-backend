const User = require("../models/userModel");
const genErr = require("../utils/genErr");
const jwt = require("jsonwebtoken")

exports.authMid = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return next(genErr(403, "No access!"))

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) return next(genErr(403, "PLease login for Unvalid access token!"))

    req.user = await User.findById(decodedToken.id)
    next();
};

//!restrict to
exports.roleChecked = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(genErr(403, "no permission for ti´his action"))
        next();
    }
}

