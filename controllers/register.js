const { v4: uuidv4 } = require("uuid");
const sha1 = require("js-sha1");
const url = require("url");
const fs = require("fs");
const quickencrypt = require("quick-encrypt");
const { environment } = require("../config/environment");
const { registrationMail } = require("../utils/mailer");
const { getJWT } = require("./auth");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

const publicKey = fs.readFileSync(__dirname + process.env.PUBLICKEY, "utf-8");
const privateKey = fs.readFileSync(__dirname + process.env.PRIVATEKEY, "utf-8");


const register = (req, res, next) => {
        User.findOne({ email: req.body.email }, function(err, user)  {
                if(err) {
                        return res.status(500).send({ message: "Server Error." });
                }
                if(user) {
                        return res.status(401).send({ message: "User with same email already exists." });
                } else {
                        try {
                                const psalt = uuidv4();
                                const vsalt = uuidv4();
                                        
                                const pwdhash = sha1.hex(req.body.pwd);
                                        
                                const record = {
                                        uid: null,
                                        email: req.body.email,
                                        phone: req.body.phone,
                                        name: req.body.name,
                                        pwd: pwdhash,
                                        psalt: psalt,
                                        vsalt: vsalt
                                };

                                const newUser = new User(record);
                                newUser.save(function(err, doc) {
                                        if(err) {
                                                return res.status(500).send({ message: "Server Error." });
                                        }
                                        
                                        try {
                                                const link = environment[process.env.NODE_ENV].url 
                                                                + "api/user/verify" + url.format({
                                                                        query : {
                                                                                user: quickencrypt.encrypt(doc.email, publicKey),
                                                                                key: quickencrypt.encrypt(doc.vsalt, publicKey)
                                                                        }
                                                                });
                                                registrationMail(doc.email, link);
                                                return res.status(200).send({ message: "Registration Successful. Check your email to proceed" });    
                                        } catch(err) {
                                                console.log(err);
                                                return res.status(500).send({ message: "Server Error." });
                                        }      
                                });
                        } catch(err) {
                                return res.status(500).send({ message: "Server Error." });
                        }
                }
        });              
};

const verify = (req, res, next) => {

        try {
                const id = quickencrypt.decrypt(req.query.user, privateKey);
                const key = quickencrypt.decrypt(req.query.key, privateKey);
                User.findOne({ email: id }, function(err, user) {
                        if(!user) {
                                return res.status(401).send({ message: "User not found" });
                        } else {
                                if(user.vsalt === key) {
                                        user.uid = uuidv4();
                                        user.vsalt = null;

                                        user.save( function(err, user) {
                                                if(err) {
                                                        return res.status(500).send({ message: "Server Error." });        
                                                }
                                                
                                                try {
                                                        return res.status(200).send({
                                                                message: "User mail successfully verfied.",
                                                                email: user.email,
                                                                name: user.name,
                                                                auth: true,
                                                                token: getJWT(user.uid) 
                                                        });
                                                } catch(e) {
                                                        return res.status(500).send({ message: "Server Error." });        
                                                }
                                        });
                                        
                                } else {
                                        return res.status(403).send({ message: "Bad Request" });
                                }
                        }
                });
        } catch(e) {
                return res.status(500).send({ message: "Server Error." });
        }
};

module.exports = { register, verify };