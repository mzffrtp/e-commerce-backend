const mongoose = require("mongoose");
const validator = require("validator")

const userSChema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name should not be blank!"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "e-mail shouldn´t be blank"],
        lowerCase: true,

    },
    password: {
        type: String,
        required: [true, "password should not be blank!"],
        minLength: [6, "password should not be at least 6 characters!"],
    },
    avatar: {
        public_id: {
            type: String,
            default: "defaultpic.jpeg"
        },
        url: {
            type: String,
            required: false
        }
    },
    role: {
        type: String,
        enum: ["user", "admin", "guest"],
        default: "guest",
    },
}, { timestamps: true })

const User = mongoose.model("User", userSChema);
module.exports = User