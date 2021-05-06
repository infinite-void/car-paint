const dotenv = require("dotenv");
const { getJWT } = require("./auth");
dotenv.config();

const adminAuth = (req, res, next) => {
        try {
                if(req.body.user === process.env.adminuser &&
                        req.body.pass === process.env.adminpass) {
                                return res.status(200).send({
                                        message: "Login Successful",
                                        token: getJWT(process.env.adminauth)
                                });
                        } else {
                                return res.status(401).send({
                                        message: "Invalid Request or Invalid Credentials."
                                });
                        }
        } catch(err) {
                return res.status(500).send({ message: "Server Error." });
        }
};

module.exports = { adminAuth };