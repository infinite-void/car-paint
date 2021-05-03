const express = require("express");
const passport = require("passport");

const router = express.Router();
require("../controllers/googleauth.js")(passport);

const register = require("../controllers/register");
const login = require("../controllers/login");
const gsignin = require("../controllers/googlesignin");
const resetpass = require("../controllers/resetpass");
const { reset } = require("nodemon");

router.post("/register", register.register);
router.get("/verify", register.verify);

router.post("/signin", login.signin);

router.post("/forgotpass", resetpass.forgotPassword);
router.get("/forgotpasswordlink", resetpass.forgotPasswordLink);
router.post("/resetpass", resetpass.resetPassword);


router.get("/googlesignin",
        passport.authenticate("google", { 
                scope : ["profile", "email"] 
        })
);

router.get("/google/callback",
        passport.authenticate("google", { 
                failureRedirect: "/api/user/googleautherror" 
        }),
        (err, req, res, next) => {
                if(err) {
                        console.log(err);
                        res.redirect("/api/user/googlesignin");
                }
                else
                        next();
        },
        gsignin.googleSignin
);

router.get("/googleautherror", (req, res) => {
        res.status(401).send({ message: "Google Authentication Error. Try Again." });
});


module.exports = router;