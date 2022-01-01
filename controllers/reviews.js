const Review = require('../models/review');
const Campground  = require('../models/campground');

module.exports.createReview = async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   const review = new Review(req.body.review);
   review.owner = req.user._id;

   campground.reviews.push(review);
   await campground.save();
   await review.save();

   req.flash('success', 'Created a review.')
   res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
   const { id, reviewId } = req.params;
   
   await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   
   req.flash('success', 'Deleted a review.');
   res.redirect(`/campgrounds/${id}`);
};