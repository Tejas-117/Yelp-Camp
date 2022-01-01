const mongoose = require("mongoose");
const Review = require('./review');

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200'); 
})

// to include virtuals when document is converted into json;
const options = { toJSON: { virtuals: true }};

const campSchema = new mongoose.Schema({
  title: String,
  images: [ imageSchema ],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, options);

campSchema.virtual('properties.popupMarkup').get(function(){
  const markup = `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
                   <p>${this.description.substr(0, 30)}...</p>`;

  return markup;
})

// middleware that runs after a campground is deleted
campSchema.post("findOneAndDelete", async function (item) {
  if (item) {
    const ans = await Review.deleteMany({ _id: { $in: item.reviews } });    
  }
});

const Campground = mongoose.model("Campground", campSchema);

module.exports = Campground;
