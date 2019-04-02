const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Part model
const Part = require("../../models/Part");

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
    if (req.body.partNumber) partFields.partNumber = req.body.partNumber;
    if (req.body.description) partFields.description = req.body.description;
    if (req.body.weight) partFields.weight = req.body.weight;
    if (req.body.shippingConcern)
      partFields.shippingConcern = req.body.shippingConcern;
    if (req.body.specialNotes) partFields.specialNotes = req.body.specialNotes;
    if (req.body.MG3) partFields.MG3 = req.body.MG3;
    if (req.body.image) partFields.image = req.body.image;
    if (req.body.notice) partFields.notice = req.body.notice;
    if (req.body.successor) partFields.successor = req.body.successor;

    // Pricing
    partFields.pricing = {};
    if (req.body.list) partFields.pricing.list = req.body.list;
    if (req.body.repair) partFields.pricing.repair = req.body.repair;
    if (req.body.exchange) partFields.pricing.exchange = req.body.exchange;
    if (req.body.credit) partFields.pricing.credit = req.body.credit;

    // Check if partNumber exists
    Part.findOne({ partNumber: partFields.partNumber }).then(part => {
      if (part) {
        errors.partNumber = "That Part Number already exists";
        res.status(400).json(errors);
      }

      //Save Part
      new Part(partFields).save().then(part => res.json(part));
    });
  }
);

//TODO: Delete Part

module.exports = router;
