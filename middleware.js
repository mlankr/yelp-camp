const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const Campground = require("./models/campground");
const Review = require("./models/review");
const {campgroundSchema, reviewSchema, userSchema} = require("./schema");
const {validateCampgroundLocation} = require("./utils/validator");


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

module.exports.validateReview = async (req, res, next) => {
	const {error} = reviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map(el => el.message).join(', ');
		req.flash('error', message)
		req.flash('reviewText', req.body.review.body)
		return res.redirect('/campgrounds/' + req.params.id);
	}
	next();
}

module.exports.validateRegistrationInfo = (req, res, next) => {
	const {error} = userSchema.validate(req.body);
	if (error) {
		req.flash('username', req.body.username);
		req.flash('email', req.body.email);
		error.details.forEach(currentError => {
			req.flash('error', currentError.message);
		})
		return res.redirect('/register');
	}
	next();
}

module.exports.validateCampgroundDeletion = async (req, res, next) => {
	const campground = await Campground.findById(req.params.id);
	const imagesToDelete = req.body.deleteImages || [];
	const totalCurrentImages = campground.images;

	if (totalCurrentImages.length > 0 && imagesToDelete.length > 0 && totalCurrentImages.length === imagesToDelete.length) {
		req.flash('error', 'Multiple images not deleted! Please ensure that at least one image remains undeleted.');
		return res.redirect('/campgrounds/' + req.params.id + '/edit');
	}
	next();
}

module.exports.validateCampgroundLocation = async (req, res, next) => {
	const isCampgroundValid = await validateCampgroundLocation(req.body.campground.location, geocoder);
	if (isCampgroundValid.length <= 0) {
		req.flash('error', `'${req.body.campground.location}' is invalid location data. Please provide a valid one!`)
		req.flash('title', req.body.campground.title);
		req.flash('price', req.body.campground.price);
		req.flash('description', req.body.campground.description);
		req.flash('location', req.body.campground.location);

		if (req.method === 'POST') {
			return res.redirect('/campgrounds/new');
		} else {
			return res.redirect('/campgrounds/' + req.params.id + '/edit');
		}
	}
	next();
}

module.exports.validateCampground = async (req, res, next) => {
	const {error} = campgroundSchema.validate(req.body);
	if (error) {
		error.details.forEach(currentError => {
			req.flash('error', currentError.message)
		})
		if (req.method === 'POST') {
			return res.redirect('/campgrounds/new');
		} else {
			return res.redirect('/campgrounds/' + req.params.id);
		}
	}
	next();
}
