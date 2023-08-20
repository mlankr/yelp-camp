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
	try {
		const userId = req.user._id; // Assuming you're using Passport.js or similar for authentication
		const userCampgrounds = await Campground.find({author: userId}); // Assuming you have a Campground model
		res.render('campgrounds/showMine', {campgrounds: userCampgrounds, pageName: 'My Campgrounds'});
	} catch (error) {
		console.error(error);
	}
};

module.exports.renderNewForm = async (req, res) => {
	res.render('campgrounds/new', {pageName: 'New Campground'})
}

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate({
		path: 'reviews',
		populate: {path: 'author'}
	}).populate('author');
	if (!campground) {
		req.flash('error', 'Campground Not Found!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', {
		campground,
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
	res.render('campgrounds/edit', {campground, pageName: 'Edit Campground'});
}

module.exports.loadNextCampgrounds = async (req, res) => {
	const {limit, offset} = req.body;
	const campgrounds = await Campground.find().limit(limit).skip(offset);
	const compiled = ejs.compile(fs.readFileSync(__dirname + '/../views/partials/campgroundItems.ejs', {
		encoding: 'utf8',
		flag: 'r'
	}));
	const html = compiled({campgrounds});
	res.send(html);
}

module.exports.createCampground = async (req, res) => {
	try {
		const geoData = await geocoder.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
		}).send();
		if (geoData.body.features && geoData.body.features.length > 0) {
			const campground = new Campground(req.body.campground);
			campground.geometry = geoData.body.features[0].geometry;
			campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
			campground.author = req.user._id;
			await campground.save();
			req.flash('success', 'Successfully made a new campground!');
			res.redirect(`/campgrounds/${campground._id}`);
		} else {
			req.flash('error', 'Invalid location data. Please provide a valid location')
			throw new Error('Invalid Location');
		}
	} catch
		(err) {
		res.redirect('/campgrounds/new');
	}
}

module.exports.updateCampground = async (req, res) => {
	try {
		const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {
			new: true,
			runValidators: true
		});
		const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
		campground.images.push(...imgs);
		await campground.save();
		if (req.body.deleteImages) {
			for (let filename of req.body.deleteImages) {
				await cloudinary.uploader.destroy(filename);
			}
			await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
		}
		req.flash('success', 'Successfully updated campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	} catch (err) {
		res.redirect('/campgrounds/' + req.params.id + '/edit');
	}
}

module.exports.deleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted campground!');
	res.redirect(`/campgrounds`);
}
