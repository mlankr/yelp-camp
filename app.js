if (process.env.NODE_ENV !== 'PRODUCTION') {
	require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
// database
const dbUrl = process.env.ENVIRONMENT.toLowerCase() === 'production' ? (process.env.DATABASE_URL || 'mongodb://localhost:27017/yelp-camp') : 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
	family: 4,
	}).then(() => {
		console.log('Database Connected!!!')
	})
	.catch(err => {
		console.log('Error: ', err)
	});

const app = express();

// Use the `cors` middleware
const corsOptions = {
	origin: process.env.CORS_ORIGIN,
};
app.use(cors(corsOptions));

// views and view Engine
app.engine('ejs', ejsMate); // use ejs-locals for all ejs templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

// routes
const homeRoutes = require('./routes/home')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const scriptSrcUrls = ["https://api.tiles.mapbox.com/", "https://api.mapbox.com/", "https://kit.fontawesome.com/", "https://cdnjs.cloudflare.com/", "https://cdn.jsdelivr.net/", "https://code.jquery.com/", "https://cdnjs.cloudflare.com/", "https://res.cloudinary.com/cloudwiz/"];
const styleSrcUrls = ["https://cdn.jsdelivr.net/", "https://api.mapbox.com/", "https://api.tiles.mapbox.com/", "https://fonts.googleapis.com/", "https://ka-f.fontawesome.com/", "https://res.cloudinary.com/cloudwiz/"];
const connectSrcUrls = ["https://*.tiles.mapbox.com/", "https://api.mapbox.com/", "https://events.mapbox.com", "https://ka-f.fontawesome.com/", "https://res.cloudinary.com/cloudwiz/"];
const fontSrcUrls = ["https://res.cloudinary.com/cloudwiz/", "https://ka-f.fontawesome.com/"];
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: [],
		connectSrc: ["'self'", ...connectSrcUrls],
		scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
		styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
		workerSrc: ["'self'", "blob:"],
		childSrc: ["blob:"],
		objectSrc: [],
		imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/cloudwiz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
			"https://images.unsplash.com/",],
		fontSrc: ["'self'", ...fontSrcUrls],
		mediaSrc: ["https://res.cloudinary.com/cloudwiz/"]
	},
}));

const secretKey = process.env.SECRET || 'thisisasecretfordevelopment';

const store = new MongoStore({
	mongoUrl: dbUrl, secret: secretKey, touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
	console.log('SESSION STORE ERROR: ', e)
})

const sessionOptions = {
	store, name: 'campground_session', secret: secretKey, resave: false, saveUninitialized: true, cookie: {
		httpOnly: true, // secure: true,
		expires: Date.now() + (1000 * 60 * 60 * 24 * 7), maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

// All Routes
app.use('/', homeRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if (!err.message) {
		err.message = 'Oops! Something Went Wrong';
	}
	res.status(statusCode).render('error', {err, pageName: 'Error', className: 'error-page'});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Serving on Port " + port);
});