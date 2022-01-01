const express = require('express');
const app = express();
const router = express.Router();
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

// utils
const catchAsync = require('../utils/catchAsync');
const { validateCampground } = require('../utils/middleware/validate')
const { isLoggedIn, isAuthor } = require('../utils/middleware/auth');

// schemas
const Campground = require('../models/campground');
const Review = require('../models/review');

// controllers
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index))

router.get('/new',  isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground ,catchAsync(campgrounds.updateCampground))

router.get('/:id/delete', isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCampground))

module.exports = router;