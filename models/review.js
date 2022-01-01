const mongoose = require('mongoose')
const Campground = require('../models/campground')

const reviewSchema = new mongoose.Schema({
   body: { type: String },
   rating: { type: Number },
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   }
})

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;