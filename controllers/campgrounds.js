const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');

// for maps;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
   const campgrounds = await Campground.find({})
   res.render('campgrounds/index', {campgrounds: campgrounds})
};

module.exports.renderNewForm = async (req,res) => {
   res.render('campgrounds/new');
};

module.exports.createCampground = async (req,res,next) => {   
   const campground = new Campground(req.body.campground);

   // add images and owner;
   campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
   campground.owner = req.user._id;

   // add map geometry property
   const geoData = await geoCoder.forwardGeocode({
      query: campground.location,
      limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;

   await campground.save();

   req.flash('success', 'Successfully created a campground!!');
   res.redirect(`campgrounds/${campground._id}`)   ;
};

module.exports.showCampground = async (req, res) => {
   const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "owner" } }) //populating multiple paths!  
      .populate("owner"); 

   if(!campground){
      req.flash('error', 'Campground not found.')
      return res.redirect('/campgrounds')
   }
   res.render('campgrounds/show', { campground })
};

module.exports.renderEditForm = async(req,res) => {
   const { id } = req.params;
   const campground = await Campground.findById(id)

   if(!campground){
      req.flash('error', 'Campground not found.')
      return res.redirect('/campgrounds')
   }

   res.render('campgrounds/edit', {campground})
};

module.exports.updateCampground = async (req,res) => {
   const { id } = req.params;
   const data = req.body;

   const campground = await Campground.findByIdAndUpdate(id, {...data});

   // get all images and create objects;
   const uploadImages = req.files.map(file => ({ url: file.path, filename: file.filename }));
   campground.images.push(...uploadImages);
   await campground.save();

   // to delete images
   if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
         await cloudinary.uploader.destroy(filename);
      }

      await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
   }

   req.flash('success', 'Successfully updated a campground.');
   res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req,res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);

   req.flash('success', 'Deleted a campground.')
   res.redirect('/campgrounds')
};