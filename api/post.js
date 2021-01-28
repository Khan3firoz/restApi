const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

//post model
const Post = require('../model/postModel')

//profile model
const Profile = require('../model/profileModels')

//validation
const validatePostInput = require('../validation/post')
//@route GET api/posts
//@desc Get posts
//@access Public
router.get("/test", (req, res) => {
    res.json({ msg: " hello from the post" });
});
//@route GET api/posts
//@desc Get posts
//@access Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ data: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostfound: ' No post found' }))
});

//@route GET api/posts
//@desc Get posts by id
//@access Public
router.get('/:id', (req, res) => {
    Post.findById(req,pramas.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostfound: ' No post found with this ID' }))
});

//@route Post api/posts
//@desc Get posts by id
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);
        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.body.id
        });
        newPost.save().then(post=>res.json(post))
    })



module.exports = router;