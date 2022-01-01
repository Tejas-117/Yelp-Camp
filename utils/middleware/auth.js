const Campground = require('../../models/campground');
const Review = require('../../models/review');

// to check user is logged in
function isLoggedIn(req, res, next){
   if(!req.isAuthenticated()){
      // save the url to provide 'return to' behaviour after login
      req.session.returnTo = req.originalUrl; 

      req.flash('error', 'You must be signed in!');
      return res.redirect('/login');
   }

   next();
}

// to check the permissions enabled for the logged in user;
async function isAuthor(req, res, next){
   const { id } = req.params;
   const campground = await Campground.findById(id);

   if(campground && req.user && JSON.stringify(campground.owner) !== JSON.stringify(req.user._id)){
      req.flash('error', 'Not authorised to perform the operation.');
      return res.redirect(`/campgrounds/${id}`);
   } 

   next();
}

async function isReviewAuthor(req, res, next){
   const { id,reviewId } = req.params;
   const review = await Review.findById(reviewId);

   if(req.user && JSON.stringify(review.owner) !== JSON.stringify(req.user._id)){
      req.flash('error', 'Not authorised to perform the operation.');
      return res.redirect(`/campgrounds/${id}`);
   } 

   next();
}

module.exports = { isLoggedIn, isAuthor, isReviewAuthor }