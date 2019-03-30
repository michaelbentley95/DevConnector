const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const PartSchema = new Schema({
  partNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricing: {
    list: {
      type: Number
    },
    repair: {
      type: Number
    },
    exchange: {
      type: Number
    },
    credit: {
      type: Number
    }
  },
  weight: {
    type: Number,
    required: true
  },
  shippingConcern: {
    type: Boolean,
    required: true,
    default: false
  },
  specialNotes: {
    type: Boolean,
    required: true,
    default: false
  },
  MG3: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  notice: {
    type: String
  },
  successor: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Part = mongoose.model("part", PartSchema);
