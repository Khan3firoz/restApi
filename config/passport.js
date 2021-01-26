const JwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model("users")
const secretKey = require("../config/config").secretOrKey;
const options = {};

//token and secret key in term of json object.
options.secretOrKey = secretKey;
options.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id).then((user) => {

            //we can check thet here user is existing or not based on id
            if (user) {
                return done(null,user)
            } else {
                return done(null,false)
            }
        }).catch((err)=>console.log(err));
    }))
}