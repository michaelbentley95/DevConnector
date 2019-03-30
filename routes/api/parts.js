const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Part model
const Part = require("../../models/Part");
//Profile model
const Profile = require("../../models/Profile");

//Validation
const validatePartInput = require("../../validation/part");

// @route   GET api/parts/test
// @desc    Tests part route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Parts Works" }));

// @route   GET api/parts
// @desc    Get parts
// @access  Public
router.get("/", (req, res) => {
  Part.find()
    .sort({ partNumber: -1 })
    .then(parts => res.json(parts))
    .catch(err => res.status(404).json({ nopartsfound: "No parts found" }));
});

//TODO: Get Part by PartNum

// @route   POST api/part
// @desc    Create or Edit a part
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePartInput(req.body);

    // Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const partFields = {};
    partFields.user = req.user.id;
    if (req.body.partNumber) profileFields.partNumber = req.body.partNumber;
    if (req.body.description) profileFields.description = req.body.description;
    if (req.body.weight) profileFields.weight = req.body.weight;
    if (req.body.shippingConcern)
      profileFields.shippingConcern = req.body.shippingConcern;
    if (req.body.specialNotes)
      profileFields.specialNotes = req.body.specialNotes;
    if (req.body.MG3) profileFields.MG3 = req.body.MG3;
    if (req.body.image) profileFields.image = req.body.image;
    if (req.body.notice) profileFields.notice = req.body.notice;

    // Pricing
    partFields.pricing = {};
    if (req.body.list) profileFields.pricing.list = req.body.list;
    if (req.body.repair) profileFields.pricing.repair = req.body.repair;
    if (req.body.exchange) profileFields.pricing.exchange = req.body.exchange;
    if (req.body.credit) profileFields.pricing.credit = req.body.credit;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //If profile exists, then Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ success: "true" }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

module.exports = router;
