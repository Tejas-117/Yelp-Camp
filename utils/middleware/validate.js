const ExpressError = require('../expressError')
const { campgroundSchema, reviewSchema } = require('../schemas')

// to validate campground using joi
function validateCampground(req, res, next){
   const { error } = campgroundSchema.validate(req.body)
   if(error){
      const msg = error.details.map(ele => ele.message).join(',')
      throw new ExpressError(msg, 400)
   }
   else {
      next()
   }
}

// to validate review using joi
function validateReview(req, res, next) {
   const { error } = reviewSchema.validate(req.body)
   if(error){
      const msg = error.details.map(ele => ele.message).join(',')
      throw new ExpressError(msg, 400)
   }
   else {
      next()
   }
}


module.exports = { validateCampground, validateReview }