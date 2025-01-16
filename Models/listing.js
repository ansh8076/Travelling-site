const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");
const { type } = require("express/lib/response.js");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,
  // categories:{
  //   type:Array,
  //   enum:["mountains","farms","Rooms","Beach","Historical","Camping","Amazing view","Snow area","Top cities","Amazing pools","Spiritual"],
  // },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
     type:Schema.Types.ObjectId,
     ref:"User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id : {$in: listing.reviews} });
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;