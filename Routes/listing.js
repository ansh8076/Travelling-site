const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const req = require('express/lib/request.js');
const upload = multer({ storage });



//for index and after posting data index route - create route
router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//show route Update route and delete route
router.route("/:id").get(wrapAsync(listingController.showListings)).put(isOwner, isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing)).delete( isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;