const Campground = require("../models/campground");
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const {review} = req.body;
    const {id} = req.params;
    const newReview = new Review(review);
    const campground = await Campground.findById(id);
    newReview.author = req.user;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect('/campgrounds/' + id);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect('/campgrounds/' + id);
}