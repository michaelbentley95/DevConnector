const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  //Sets data.name to an empty string if it wasn't set. This is because Validator.isEmpty only works on strings and not null or undefined.
  data.partNumber = isEmpty(data.partNumber) ? "" : data.partNumber;
  data.description = isEmpty(data.description) ? "" : data.description;
  data.weight = isEmpty(data.weight) ? "" : data.weight;
  data.MG3 = isEmpty(data.MG3) ? "" : data.MG3;

  if (Validator.isEmpty(data.partNumber)) {
    errors.partNumber = "Part Number is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  }

  if (!isEmpty(data.list)) {
    if (!Validator.isFloat(data.list, { min: 0 })) {
      errors.list = "List price must be a number greater than 0";
    }
  }

  if (!isEmpty(data.repair)) {
    if (!Validator.isFloat(data.repair, { min: 0 })) {
      errors.repair = "Repair price must be a number greater than 0";
    }
  }

  if (!isEmpty(data.exchange)) {
    if (!Validator.isFloat(data.exchange, { min: 0 })) {
      errors.exchange = "Exchange price must be a number greater than 0";
    }
  }

  if (!isEmpty(data.credit)) {
    if (!Validator.isFloat(data.credit, { min: 0 })) {
      errors.credit = "Credit must be a number greater than 0";
    }
  }

  if (!Validator.isFloat(data.weight, { min: 0 })) {
    errors.weight = "Weight must be a number greater than 0";
  }

  if (Validator.isEmpty(data.weight)) {
    errors.weight = "Weight is required";
  }

  if (Validator.isEmpty(data.MG3)) {
    errors.MG3 = "MG3 is required";
  }

  if (!isEmpty(data.image)) {
    if (!Validator.isURL(data.image)) {
      errors.image = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
