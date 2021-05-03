const { v4: uuidv4 } = require("uuid");
const { getJWT } = require("./auth");

const User = require("../models/user");

const googleSignin = (req, res, next) => {
        try {
                const email = req.user._json.email;
                User.findOne({ email: email }, function (err, user) {
                        if(err) {
                                return res.status(500).send({ message: "Server Error." });
                        }
                        if(user) {
                                if(user.uid === null)
                                        return res.status(401).send({
                                                auth: false,
                                                message: "User registered. Check your mail for verification."
                                        });
                                else 
                                        return res.status(200).send({
                                                message: "User login successful.",
                                                email: user.email,
                                                name: user.name,
                                                auth: true,
                                                token: getJWT(user.uid) 
                                        });
                        }

                        const record = {
                                uid: uuidv4(),
                                email: email,
                                pwd: null,
                                name: req.user._json.name
                        };

                        const newUser = new User(record);
                        newUser.save( function (err, user) {
                                if(err)
                                        return res.status(500).send({ message: "Server Error." });
                                return res.status(200).send({
                                        message: "User Registration Successful.",
                                        email: user.email,
                                        name: user.name,
                                        auth: true,
                                        token: getJWT(user.uid) 
                                })
                        });
                });
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

module.exports = { googleSignin };