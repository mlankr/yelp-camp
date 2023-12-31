const express = require('express');
const router = express.Router();
const {isLoggedIn, isAuthor, validateCampground, validateCampgroundLocation, validateCampgroundDeletion} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");

// image upload
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.get('/mycampgrounds', isLoggedIn, catchAsync(campgrounds.showUserCampgrounds));
router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn,  upload.array('image'), validateCampgroundLocation, validateCampground, catchAsync(campgrounds.createCampground));

router.route('/paginate')
	.post(catchAsync(campgrounds.loadNextCampgrounds));

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampgroundDeletion,  validateCampgroundLocation, validateCampground,  catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;