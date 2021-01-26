const express = require("express");
const router = express.Router();
const User = require("../model/usersModel");
const bcrypt = require("bcrypt");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../config/config").secretOrKey;
// const passport = require("../config/passport");
const passport = require("passport")

//User registaton
router.post("/register", (req, res) => {
    //checking validation for registation
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log(JSON.stringify(errors));
    console.log(isValid);
    if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
    }

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then((user) => res.json(user))
                .catch((err) => res.json(err));
        });
    });
});
router.post('/login', (req, res) => {
    //validation
    const { errors, isValid } = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //login check with mongoDB
    const email = req.body.email;
    const password = req.body.password;
    //findOne mathod will give only 1 rec if it is getting or else nothing
    User.findOne({ email }).then((user) => {
        if (!user) {
            errors.email = "User not Found";
            return res.status(400).json(errors);
        }

        //time to check the the password
        //password is encrypted using bcrypt lib
        //1. decrypt the password and compare
        //2. compare both in as it is way ==>db password will in encrypted formate and our provided password will be in nomao english content
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                if (isMatch) {
                    //genrate the token ===>jwk
                    // payload data
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    };
                    jwt.sign(payload,secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    //share the token with client
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                        });
                    });
                    // return res.send(user)
                } else {
                    errors.password = "wrong password";
                    return res.status(400).json(errors);
                }
            });
    })
})
//get current user details
//@Route GET api/user/current
//@desc:return the current user details
//@access:private (it require token  then and only then it shoud be accessible)

router.get("/current",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email:req.user.email
     });
  });

module.exports = router;