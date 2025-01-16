const Listing = require('../Models/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    //checks if the current user is logged in or not
    res.render("./listings/new.ejs");
};
module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist.");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    console.log(req.file);
    try {
        let url = req.file?.path || ''; // Use optional chaining and fallback to empty string
        let filename = req.file?.filename || ''; // Fallback to empty string

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();

        req.flash("success", "New listing created.");
        res.redirect("/listings");
    } catch (err) {
        next(err); // Pass errors to the error handler
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist.");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_100,w_250,e_blur:80");
    res.render("./listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        //for url and filename
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success", "Listing updated.");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing was Deleted.");
    res.redirect("/listings");
};