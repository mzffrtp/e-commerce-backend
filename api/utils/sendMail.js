const nodemailer = require("nodemailer");
const dotenv = require("dotenv")

//! Transporter
exports.sendMail = async (options) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.NM_USER,
            pass: process.env.NM_PASS
        }
    })

    //! Email
    const mailOptions = {
        from: "e-commerce customer service, <reset-password@e-commerce.com>",
        to: options.email,
        subject: options.subject,
        text: options.text
    };

    //! Send email
    await transport.sendMail(mailOptions)
};



