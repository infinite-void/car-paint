const { v4: uuidv4 } = require("uuid");
const url = require("url");
const sha1 = require("js-sha1");
const quickencrypt = require("quick-encrypt");
const fs = require("fs");
const { environment } = require("../config/environment");
const { forgotPasswordMail } = require("../utils/mailer");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

const publicKey = fs.readFileSync(__dirname + process.env.PUBLICKEY, "utf-8");
const privateKey = fs.readFileSync(__dirname + process.env.PRIVATEKEY, "utf-8");

const forgotPassword = (req, res, next) => {
        const email = req.body.email;

        User.findOne({ email: email }, function(err, user) {
                if(err) {
                        return res.status(500).send({ message: "Server Error." });
                }

                if(!user) {
                        return res.status(401).send({ message: "User not registered." });
                }

                if(user.pwd === null) {
                        res.status(401).send({ message: "User register with Google Signin. Signin with Google." });
                }

                try {
                        user.vsalt = uuidv4();
                        const link = environment[process.env.NODE_ENV].url 
                                        + "api/user/forgotpasswordlink" + url.format({
                                                query: {
                                                        user: quickencrypt.encrypt(user.email, publicKey),
                                                        key: quickencrypt.encrypt(user.vsalt, publicKey)
                                                }
                                        });
                        user.save( function(err, user) {
                                try {
                                        setTimeout(() => {
                                                user.vsalt = null;
                                                user.save();
                                        }, 5 * 60 * 1000);
                                        forgotPasswordMail(user.email, link);
                                        return res.status(200).send({
                                                message: "Password reset link has been sent to registered email. Link valid for 5 minutes."
                                        });
                                } catch(err) {
                                        return res.status(500).send({ message: "Server Error." });
                                }
                        });
                } catch(err) {
                        return res.status(500).send({ message: "Server Error." });
                }
        });
};

const forgotPasswordLink = (req, res, next) => {
        const user = quickencrypt.decrypt(req.query.user, privateKey);
        const key = quickencrypt.decrypt(req.query.key, privateKey);

        User.findOne({ email: user }, function(err, user) {
                if(err) {
                        return res.status(500).send({ message: "Server Error." });
                }

                if(!user) {
                        return res.status(401).send({ message: "User not registered." });
                }

                if(user.pwd === null) {
                        return res.status(401).send({ message: "User register with Google Signin. Signin with Google." });
                }

                try {
                        if(user.vsalt === key) {
                                return res.status(200).send({ 
                                        message: "User verified. Reset password.",
                                        user: req.query.user,
                                        key: req.query.key 
                                });
                        } else {
                                return res.status(401).send({ message: "Link Expired." });
                        }
                } catch(err) {
                        return res.status(500).send({ message: "Server Error." });
                }
        });
};

const resetPassword = (req, res, next) => {
        const user = quickencrypt.decrypt(req.body.user, privateKey);
        const key = quickencrypt.decrypt(req.body.key, privateKey);

        User.findOne({ email: user }, function(err, user) {
                if(err) {
                        return res.status(500).send({ message: "Server Error." });
                }

                if(!user) {
                        return res.status(401).send({ message: "User not registered." });
                }

                if(user.pwd === null) {
                        return res.status(401).send({ message: "User register with Google Signin. Signin with Google." });
                }

                try {
                        if(user.vsalt === key) {
                                const pwdhash = sha1.hex(req.body.pwd);
                                user.vsalt = null;
                                user.pwd = pwdhash;
                                user.save( function(err, user) {
                                        if(err) {
                                                return res.status(500).send({ message: "Server Error." });
                                        }

                                        return res.status(200).send({ 
                                                message: "Password Reset Successful. Signin again to continue." 
                                        });
                                });
                                
                        } else {
                                return res.status(401).send({ message: "Link Expired." });
                        }
                } catch(err) {
                        return res.status(500).send({ message: "Server Error." });
                }
        });
};

module.exports = { forgotPassword, forgotPasswordLink, resetPassword };