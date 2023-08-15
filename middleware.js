const express = require("express");
const Campground = require("./models/campground");
const Review = require("./models/review");
const {campgroundSchema, reviewSchema, userSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // store requested url
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are currently not signed in. Please sign in first and try again.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have the permission!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have the permission!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        // const message = error.details.map(el => el.message).join(', ');
        error.details.forEach(currentError => {
            req.flash('error', currentError.message)
        })
        if (req.method === 'POST' || req.method === 'DELETE') {
            return res.redirect('/campgrounds/new');
        } else {
            return res.redirect('/campgrounds/' + req.params.id);
        }
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    // if (!req.body.review) throw new ExpressError('Invalid Campground Data', 400);
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        req.flash('error', message)
        return res.redirect('/campgrounds/' + req.params.id);
    }
    next();
}

module.exports.validateRegistrationInfo = (req, res, next) => {
    const {error} = userSchema.validate(req.body);
    if (error) {
        error.details.forEach(currentError => {
            req.flash('error', currentError.message);
        })
        return res.redirect('/register');
    }
    next();
}