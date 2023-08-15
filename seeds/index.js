const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Database Connected!!!')
    })
    .catch(err => {
        console.log('Error: ', err)
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

function randomImages(num) {
    if (num < 100) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102115/YelpCamp/tvcflggxvisflvxkw76g_zqzkon.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw76g_zqzkon'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102112/YelpCamp/tvcflggxvisflvxkw71g_xj4tio.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw71g_xj4tio'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102113/YelpCamp/tvcflggxvisflvxkw70g_rhit5t.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw70g_rhit5t'
                }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102112/YelpCamp/tvcflggxvisflvxkw71g_xj4tio.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw71g_xj4tio'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102113/YelpCamp/tvcflggxvisflvxkw70g_rhit5t.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw70g_rhit5t'
                }];
        }
    } else if (num >= 100 && num < 250) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102105/YelpCamp/tvcflggxvisflvxkw67g_n2hl75.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw67g_n2hl75'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102107/YelpCamp/tvcflggxvisflvxkw69g_ueddb6.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw69g_ueddb6'
                },];
        } else {
            return [
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102108/YelpCamp/tvcflggxvisflvxkw66g_pvscqt.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw66g_pvscqt'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102107/YelpCamp/tvcflggxvisflvxkw69g_ueddb6.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw69g_ueddb6'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102105/YelpCamp/tvcflggxvisflvxkw67g_n2hl75.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw67g_n2hl75'
                },];
        }
    } else if (num >= 250 && num < 400) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102103/YelpCamp/tvcflggxvisflvxkw75g_f9cidm.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw75g_f9cidm'
            }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw73g_axxume.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw73g_axxume'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw72g_nxv2hl.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw72g_nxv2hl'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102115/YelpCamp/tvcflggxvisflvxkw76g_zqzkon.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw76g_zqzkon'
                }];
        }
    } else if (num >= 400 && num < 550) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw60g_rnpmuu.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw60g_rnpmuu'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102100/YelpCamp/tvcflggxvisflvxkw61g_oaarng.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw61g_oaarng'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw62g_xlvehd.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw62g_xlvehd'
                }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102100/YelpCamp/tvcflggxvisflvxkw61g_oaarng.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw61g_oaarng'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102113/YelpCamp/tvcflggxvisflvxkw70g_rhit5t.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw70g_rhit5t'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw72g_nxv2hl.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw72g_nxv2hl'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102108/YelpCamp/tvcflggxvisflvxkw66g_pvscqt.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw66g_pvscqt'
                }];
        }
    } else if (num >= 550 && num < 700) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102107/YelpCamp/tvcflggxvisflvxkw69g_ueddb6.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw69g_ueddb6'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw73g_axxume.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw73g_axxume'
                }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw64g_fe0wf8.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw64g_fe0wf8'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102095/YelpCamp/tvcflggxvisflvxkw63g_zql3bq.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw63g_zql3bq'
                }];
        }
    } else if (num >= 700 && num < 850) {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102095/YelpCamp/tvcflggxvisflvxkw63g_zql3bq.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw63g_zql3bq'
            }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw72g_nxv2hl.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw72g_nxv2hl'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102108/YelpCamp/tvcflggxvisflvxkw66g_pvscqt.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw66g_pvscqt'
                }];
        }
    } else {
        if (num % 2 === 0) {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102113/YelpCamp/tvcflggxvisflvxkw70g_rhit5t.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw70g_rhit5t'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw62g_xlvehd.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw62g_xlvehd'
                },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102101/YelpCamp/tvcflggxvisflvxkw72g_nxv2hl.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw72g_nxv2hl'
                }];
        } else {
            return [{
                url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw62g_xlvehd.jpg',
                filename: 'YelpCamp/tvcflggxvisflvxkw62g_xlvehd'
            },
                {
                    url: 'https://res.cloudinary.com/ally12345/image/upload/v1647102099/YelpCamp/tvcflggxvisflvxkw64g_fe0wf8.jpg',
                    filename: 'YelpCamp/tvcflggxvisflvxkw64g_fe0wf8'
                }];
        }
    }
}

function randomAuthor(num) {
    if (num < 100) {
        return '622dfc56dc3086212dca7f1f';
    } else if (num >= 100 && num < 250) {
        return '622dfd20dc3086212dca8118';
    } else if (num >= 250 && num < 400) {
        return '622dfd83dc3086212dca8311';
    } else if (num >= 400 && num < 550) {
        return '622dfee1dc3086212dca850a';
    } else if (num >= 550 && num < 700) {
        return '622dff13dc3086212dca8703';
    } else if (num >= 700 && num < 850) {
        return '622dff80dc3086212dca88fc';
    } else {
        return '622dffaddc3086212dca8af5';
    }
}

//     https://api.unsplash.com/photos/random?collections=483251&client_id=wqoCzFWFUbgeL565SIhw2zXekJZCaMg81-E37aMbfJ4

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * cities.length) + 1;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            images: randomImages(random1000),
            price, // same as price: price
            createdDate: new Date(+new Date() + (Math.floor(parseInt(price) / 4) + 1) * 24 * 60 * 60 * 1000),
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.At vero eos et accusam et justo duo dolores et ea rebum!',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            author: randomAuthor(random1000)
        })
        await camp.save();
    }
}

seedDB()
    .then(() => mongoose.connection.close())
    .catch(err => console.log('Error after seedDB(): ', err))