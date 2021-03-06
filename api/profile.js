const express = require("express");
const router = express.Router();
const validateProfileInput = require("../validation/profile")
const validateExperienceInput = require("../validation/experience")
const validateEducationInput = require("../validation/education")
const passport = require("passport")
const Profile = require("../model/profileModels");
const { findOne } = require("../model/profileModels");
const profile = require("../validation/profile");

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
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                {new:true}
            ).then((profile)=> res.json(profile))
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
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name','email'])
        .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for the user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=> res.status(404).json(err))
});
//getall

router.get("/all",
    (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name','email'])
        .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for the user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=> res.status(404).json(err))

});
//based on handle retrieve the record
router.get("/handle/:handle", passport.authenticate("jwt", { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name','email'])
        .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for the user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=> res.status(404).json(err))
});

router.get("/user/:_id",
    (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name','email'])
        .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for the user'
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=> res.status(404).json(err))

});
//delete
// router.delete("/user/:user_id", passport.authenticate("jwt", { session: false }), (req, res) => {
//     Profile.findOne({ user: req.user.id }).then((profile)=> {
//         const removeIndex = profile.user.map(item => item.id).indexOf(req.params.user_id)
//         profile.user.splice(removeIndex, 1)
//         profile.save().then((profile) => res.json(profile));
//     });

// })
//add exp

router.post("/experience", passport.authenticate("jwt", { session: false }), (req, res) => {
    //validate the data
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile)=> {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        //add exp in array
        profile.experience.unshift(newExp);
        profile.save().then((profile) => res.json(profile));
    });
})
//delete exp
router.delete("/experience/:exp_id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile)=> {
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1)
        profile.save().then((profile) => res.json(profile));
    });

})
//add edu
router.post("/education", passport.authenticate("jwt", { session: false }), (req, res) => {
    //validate the data
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile)=> {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        //add exp in array
        profile.education.unshift(newEdu);
        profile.save().then((profile) => res.json(profile));
    });
})
//delete edu
router.delete("/education/:edu_id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile)=> {
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)
        profile.save().then((profile) => res.json(profile));
    });

})

module.exports = router;