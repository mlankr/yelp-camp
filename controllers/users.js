const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
	const username = req.flash('username') || '';
	const email = req.flash('email') || '';
	res.render('users/register', {username, email, pageName: 'Register'});
}

module.exports.renderLoginForm = (req, res) => {
	const username = req.flash('username') || '';
	res.render('users/login', {username, pageName: 'Login'});
}

module.exports.registerUser = async (req, res) => {
	try {
		const {email, username, password} = req.body;
		const user = new User({email, username});
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err => {
			if (err) return next(err);
			req.flash('success', 'Welcome to Yelp-Camp! You have been successfully registered and logged in.')
			res.redirect('campgrounds/');
		});
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/register');
	}
}

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome back to Yelp-Camp! You have successfully logged in.');
	// const redirectUrl = req.session.returnTo || '/campgrounds';
	// delete req.session.returnTo;
	res.redirect('/campgrounds');
}

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'You have been successfully signed out. See you next time!');
	res.redirect('/');
}