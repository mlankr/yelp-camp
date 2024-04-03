const express = require('express');
const cors = require('cors');
const router = express.Router();

// Use the `cors` middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

router.get('/', cors(corsOptions), (req, res) => {
    res.render('home', {pageName: 'YelpCamp'});
});

module.exports = router;