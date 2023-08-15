const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/register', {pageName: 'Register'});
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', {pageName: 'Login'});
}

module.exports.registerUser = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp-Camp!')
            res.redirect('campgrounds/');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to Yelp-Camp!');
    // const redirectUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    res.redirect('/campgrounds');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/');
}