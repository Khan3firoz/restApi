const express = require("express");
const router = express.Router();
const validateProfileInput = require("../validation/profile")
const passport = require("passport")
const Profile = require("../model/profileModels")

//create profile
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    //validate the data
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    //get data
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skill in a string separted by, ===>need to collect them into in the array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkdin) profileFields.social.linkdin = req.body.linkdin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    //the profile must be created for the existing user==>

    Profile.findOne({ user: req.user.id }).then((profile) => {
        if (profile) {

        }
        else {
            Profile.findOne({ handle: profileFields.handle }).then(
                profile => {
                    if (profile) {
                        errors.handle = "That profile handle exists"
                        res.status(400).json(errors)
                    }
                });
            new Profile(profileFields).save().then((profile) => {
                res.json(profile)
            });
        }

    });
    //user is existing or not
    //if user is existing then
    //profile exists==> update
    //if not exists ==>create new one
}
);
//update
//get
//getall
//delete
//add exp
//delete exp
//add edu
//delete edu

module.exports = router;