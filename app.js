if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config();
}

// dependencies
const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const Joi = require('joi');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')

// utils
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { validateReview, validateCampground } = require('./utils/middleware/validate');

// validation-schemas and models
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const { campgroundSchema, reviewSchema } = require('./utils/schemas.js');

// routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// database connection
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/yelp-campDB';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('DB connected'))

// MIDDLEWARE
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname ,'public')));
app.use(express.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/assets/favicon.ico'));

const secret = process.env.SECRET || 'somesecret';
const store = new MongoStore({
   mongoUrl: dbUrl,
   secret,
   touchAfter: 24 * 60 * 60,
});

store.on('error', (e) => {
   console.log('Session Store error', err);
})

const sessionConfig = {
   store,
   name: "Session",
   secret,
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24 * 7), //maxAge of one week
      maxAge: 1000 * 60 * 60 * 24 * 7 ,
   }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.currentUser = req.user;
   next();
})
app.use(mongoSanitize({
   replaceWith: '_'
}))

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// ROUTES
app.get("/", (req,res) => {
   res.render('campgrounds/home');
})

app.all('*', (req,res,next) => { 
   next(new ExpressError('Page not found', 404));
})

// custom error handler
app.use((err, req, res, next) => {
   const { statusCode=500 , message='Something went wrong' } = err;   

   res.status(statusCode).render('error', { err });
})

app.listen(process.env.PORT || 3000, () => console.log('Server connected'))