const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotPasswordInput = require("../../validation/forgotPassword");
const validateResetPasswordInput = require("../../validation/resetPassword");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST api/users/forgotPassword
// @desc    Sends the user a code to reset their password
// @access  Public
router.post("/forgotPassword", (req, res) => {
  const { errors, isValid } = validateForgotPasswordInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      errors.email = "There is no user with this email";
      return res.status(400).json(errors);
    } else {
      //Create reset hex token and register it to the user
      const token = crypto.randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; //Expire the reset token after one hour
      user.save();

      //Create Email Transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: keys.emailFrom,
          pass: keys.emailPassword
        }
      });

      const mailOptions = {
        from: `fidelcastrator@gmail.com`,
        to: `${user.email}`,
        subject: `Link to Reset Password`,
        text: `This is test text. Here's your link: \n\n http://localhost:3000/reset/${token}`
      };

      transporter.sendMail(mailOptions, function(err, response) {
        if (err) {
          errors.email = err;
          return res.status(400).json(errors);
        }
        res.json({
          reset: "Check your inbox for a password reset email"
        });
      });
    }
  });
});

// @route   GET api/users/resetPassword/:token
// @desc    Checks if a token exists and hasn't expired
// @access  Public
router.get("/resetPassword/:token", (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token }).then(user => {
    if (!user || user.resetPasswordExpires < Date.now()) {
      res.status(404).json({ valid: false });
    } else {
      res.json({
        valid: true
      });
    }
  });
});

// @route   POST api/users/resetPassword/:token
// @desc    Reset the user's password based on the token sent to them in the reset email
// @access  Public
router.post("/resetPassword/:token", (req, res) => {
  const { errors, isValid } = validateResetPasswordInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ resetPasswordToken: req.params.token }).then(user => {
    if (!user) {
      res.status(404).json({ profile: "There is no profile for this user" });
    } else {
      //Create reset hex token and register it to the user
      const token = crypto.randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; //Expire the reset token after one hour
      user.save();

      //Create Email Transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: keys.emailFrom,
          pass: keys.emailPassword
        }
      });

      const mailOptions = {
        from: `fidelcastrator@gmail.com`,
        to: `${user.email}`,
        subject: `Link to Reset Password`,
        text: `This is test text. Here's your link: \n\n http://localhost:3000/reset/${token}`
      };

      transporter.sendMail(mailOptions, function(err, response) {
        if (err) {
          errors.email = err;
          return res.status(400).json(errors);
        }
        res.json({
          reset: "Check your inbox for a password reset email"
        });
      });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
