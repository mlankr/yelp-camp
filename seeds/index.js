const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places, usernames, emails} = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const {func} = require("joi");
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
	.then(() => {
		console.log('Database Connected!!!')
	})
	.catch(err => {
		console.log('Error: ', err)
	});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function randomImages(num) {
	const images = [{
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102115/YelpCamp/tvcflggxvisflvxkw76g_zqzkon.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw76g_zqzkon'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102112/YelpCamp/tvcflggxvisflvxkw71g_xj4tio.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw71g_xj4tio'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102113/YelpCamp/tvcflggxvisflvxkw70g_rhit5t.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw70g_rhit5t'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102105/YelpCamp/tvcflggxvisflvxkw67g_n2hl75.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw67g_n2hl75'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102107/YelpCamp/tvcflggxvisflvxkw69g_ueddb6.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw69g_ueddb6'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102108/YelpCamp/tvcflggxvisflvxkw66g_pvscqt.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw66g_pvscqt'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102103/YelpCamp/tvcflggxvisflvxkw75g_f9cidm.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw75g_f9cidm'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw73g_axxume.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw73g_axxume'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw72g_nxv2hl.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw72g_nxv2hl'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw60g_rnpmuu.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw60g_rnpmuu'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102100/YelpCamp/tvcflggxvisflvxkw61g_oaarng.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw61g_oaarng'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw62g_xlvehd.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw62g_xlvehd'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw64g_fe0wf8.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw64g_fe0wf8'
	}, {
		url: 'https://res.cloudinary.com/cloudwiz/image/upload/v1647102095/YelpCamp/tvcflggxvisflvxkw63g_zql3bq.jpg',
		filename: 'YelpCamp/tvcflggxvisflvxkw63g_zql3bq'
	}];

	let selectedImages = [];
	// Shuffle the images array for better randomization
	const shuffledImages = shuffleArray(images);

	const rangeConfig = [
		{range: [0, 100], count: 2},
		{range: [100, 200], count: 6},
		{range: [200, 300], count: 3},
		{range: [300, 400], count: 2},
		{range: [400, 500], count: 1},
		{range: [500, 600], count: 1},
		{range: [600, 700], count: 5},
		{range: [700, 800], count: 2},
		{range: [800, 900], count: 4},
		{range: [900, 1000], count: 3},
	];

	for (const config of rangeConfig) {
		const [min, max] = config.range;
		if (num >= min && num < max) {
			selectedImages = shuffledImages.slice(0, config.count);
			break;
		}
	}

	return shuffleArray(selectedImages);
}

const seedAuthorsAndIds = async () => {
	for (let i = 0; i < 10; i++) {
		const username = usernames[i];
		const email = emails[i];
		const password = username + randomNum(9999);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = new User({username, email, salt, hash: hashedPassword})
		await user.save();
	}
	const users = await User.find();
	return users.map(user => user._id.toString());
}

function randomNum(num) {
	return Math.floor(Math.random() * num);
}

//     https://api.unsplash.com/photos/random?collections=483251&client_id=wqoCzFWFUbgeL565SIhw2zXekJZCaMg81-E37aMbfJ4

const seedDB = async () => {
	await Campground.deleteMany({});
	await Review.deleteMany({});
	await User.deleteMany({});

	const authors = await seedAuthorsAndIds(); // Await the result

	for (let i = 0; i < 200; i++) {
		const random1000 = randomNum(cities.length);
		const price = randomNum(20) + 10;
		const camp = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			images: randomImages(random1000),
			price, // same as price: price
			createdDate: new Date(+new Date() + (Math.floor(parseInt(price) / 4) + 1) * 24 * 60 * 60 * 1000),
			description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.At vero eos et accusam et justo duo dolores et ea rebum!',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: {
				type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude]
			},
			author: authors[randomNum(10)]
		})
		await camp.save();
	}
}

seedDB()
	.then(() => mongoose.connection.close())
	.catch(err => console.log('Error after seedDB(): ', err))