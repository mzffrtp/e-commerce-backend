const express = require("express");
const { register, login, logout, forgotPassword, resetPassword, userDetail } = require("../controllers/userController");
const { authMid } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/reset/:token", resetPassword);
userRouter.get("/me", authMid, userDetail);


module.exports = userRouter