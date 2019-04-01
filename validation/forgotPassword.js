const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateForgotPasswordInput(data) {
  let errors = {};

  //Sets data.name to an empty string if it wasn't set. This is because Validator.isEmpty only works on strings and not null or undefined.
  data.email = isEmpty(data.email) ? "" : data.email;

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
