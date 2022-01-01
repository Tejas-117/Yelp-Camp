const express = require('express');
const app = express();
const router = express.Router({ mergeParams: true });

// utils
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../utils/middleware/validate');
const { isLoggedIn, isAuthor, isReviewAuthor } = require('../utils/middleware/auth');

// schemas
const Campground = require('../models/campground');
const Review = require('../models/review');

// routes
const campgroundRoutes = require('../routes/campgrounds');

// controllers
const reviews = require('../controllers/reviews');

// Reviews Routes
router.post('/', isLoggedIn ,validateReview, catchAsync(reviews.createReview))

router.get('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(reviews.deleteReview))

module.exports = router;