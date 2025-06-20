const Listing=require("../models/listing");


module.exports.index=async(req,res) => {
   const allListings= await Listing.find({});
   res.render("listings/index.ejs" ,{allListings});
};

module.exports.renderNewForm=(req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
         req.flash("error","Listing you requested does not exist!");
         res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};


module.exports.renderEditForm=async(req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
         req.flash("error","Listing you requested does not exist!");
         res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs" ,{listing,originalImageUrl});
};



module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Update fields from form
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;


    // If new image uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Save updated listing
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async(req,res) => {
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};