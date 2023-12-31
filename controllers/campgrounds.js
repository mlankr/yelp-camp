const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const ejs = require('ejs');
const fs = require('fs');

const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find().limit(5).skip(0);
	const allCampgrounds = await Campground.find();
	res.render('campgrounds/', {campgrounds, allCampgrounds, pageName: 'Campgrounds'});
}

module.exports.showUserCampgrounds = async (req, res) => {
	const userId = req.user._id; // Assuming you're using Passport.js or similar for authentication
	const userCampgrounds = await Campground.find({author: userId}); // Assuming you have a Campground model
	res.render('campgrounds/showMine', {campgrounds: userCampgrounds, pageName: 'My Campgrounds'});
};

module.exports.renderNewForm = async (req, res) => {
	const title = req.flash('title') || '';
	const price = req.flash('price') || '';
	const description = req.flash('description') || '';
	const location = req.flash('location') || '';
	const imagePaths = req.flash('imagePaths') || '';
	res.render('campgrounds/new', {title, price, description, location, imagePaths, pageName: 'New Campground'})
}

module.exports.showCampground = async (req, res) => {
	const reviewText = req.flash('reviewText') || '';
	const campground = await Campground.findById(req.params.id).populate({
		path: 'reviews', populate: {path: 'author'}
	}).populate('author');
	if (!campground) {
		req.flash('error', 'Campground Not Found!');
		return res.redirect('/campgrounds');
	}
	// Clearing the flash message after displaying it
	req.flash();
	res.render('campgrounds/show', {
		campground,
		reviewText,
		pageName: 'Show Campground',
		numberOfDays: Math.round(Math.abs(((new Date()).getTime() - (campground.createdDate).getTime()) / (24 * 60 * 60 * 1000)))
	});
}

module.exports.renderEditForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash('error', 'Campground Not Found!');
		return res.redirect('/campgrounds');
	}
	// Clearing the flash message after displaying it
	req.flash();
	res.render('campgrounds/edit', {campground, pageName: 'Edit Campground'});
}

module.exports.loadNextCampgrounds = async (req, res) => {
	const {limit, offset} = req.body;
	const campgrounds = await Campground.find().limit(limit).skip(offset);
	const compiled = ejs.compile(fs.readFileSync(__dirname + '/../views/partials/campgroundItems.ejs', {
		encoding: 'utf8', flag: 'r'
	}));
	const html = compiled({campgrounds});
	res.send(html);
}

module.exports.createCampground = async (req, res) => {
	try {
		const geoData = await geocoder.forwardGeocode({
			query: req.body.campground.location, limit: 1
		}).send();
		const campground = new Campground(req.body.campground);
		campground.geometry = geoData.body.features[0].geometry;
		campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
		campground.author = req.user._id;
		await campground.save();
		req.flash('success', 'A new campground created successfully!');
		res.redirect(`/campgrounds/${campground._id}`);
	} catch (err) {
		req.flash('error', "Something went wrong!");
		req.flash('title', req.body.campground.title);
		req.flash('price', req.body.campground.price);
		req.flash('description', req.body.campground.description);
		req.flash('location', req.body.campground.location);
		res.redirect('/campgrounds/new');
	}
}

module.exports.updateCampground = async (req, res) => {
	try {
		const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {
			new: true, runValidators: true
		});
		const imagesToDelete = req.body.deleteImages || [];
		const allImagesToUpload = req.files.map(f => ({url: f.path, filename: f.filename}));
		const geoData = await geocoder.forwardGeocode({
			query: req.body.campground.location, limit: 1
		}).send();

		for (let filename of imagesToDelete) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({$pull: {images: {filename: {$in: imagesToDelete}}}});
		campground.images.push(...allImagesToUpload);
		campground.geometry = geoData.body.features[0].geometry
		await campground.save();

		req.flash('success', 'Campground updated successfully!');
		return res.redirect(`/campgrounds/${campground._id}`);
	} catch (err) {
		req.flash('error', "Something went wrong!");
		return res.redirect('/campgrounds/' + req.params.id + '/edit');
	}
}

module.exports.deleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Campground deleted successfully!');
	res.redirect(`/campgrounds`);
}