const sha1 = require("js-sha1");
const { getJWT } = require("./auth");

const User = require("../models/user");

const signin = (req, res, next) => {
        User.findOne({ email: req.body.email}, function(err, user) {
                if(err) {
                        return res.status(500).send({ message: "Server Error." });
                }
                if(!user) {
                        return res.status(401).send({ 
                                message: "User not registered.", 
                                auth: false
                        });
                }
                try {
                        const pwdhash = sha1.hex(req.body.pwd);
                        if(user.pwd === pwdhash) {
                                return res.status(200).send({
                                        message: "Login Successful.",
                                        auth: true,
                                        email: user.email,
                                        name: user.name,
                                        token: getJWT(user.uid)
                                });
                        } else {
                                return res.status(401).send({ 
                                        message: "Please check your password.",
                                        auth: false
                                });
                        }
                } catch (err) {
                        return res.status(500).send({ message: "Server Error." });
                }
        });
        
};

module.exports = { signin };