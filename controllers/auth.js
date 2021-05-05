const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

const tokenAuth = (req, res, next) => {

        const token = req.headers["authorization"];

        if(!token) {
                console.log(token);
                return res.status(401).send({ auth: false, message: "Bad Request" });
        }

        try {
                jwt.verify(token, process.env.JWTENCRYPTION, (err, tokenBody) => {
                        if(err) {
                                return req.status(500).send({ message: "Server Error." });
                        }
        
                        if(!tokenBody.id) {
                                return res.status(401).send({ auth: false, message: "Bad Request." });
                        }
        
                        User.findOne({ uid: tokenBody.id }, function(err, user) {
                                if(err) {
                                        return req.status(500).send({ message: "Server Error." });
                                }
                                try {
                                        if(user) {
                                                req.user = user;
                                                next();
                                        } else {
                                                return res.status(403).send({ auth: false, message: "Bad Request" });
                                        }
                                } catch(err) {
                                        return req.status(500).send({ message: "Server Error." });
                                }
                        });
                });
        } catch(err) {
                return req.status(500).send({ message: "Server Error." });
        }
};

const getJWT = (data) => {
        return jwt.sign({ id: data }, process.env.JWTENCRYPTION);
};

module.exports = { tokenAuth, getJWT };