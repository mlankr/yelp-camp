module.exports.validateCampgroundLocation = async (locationTxt, geocoder) => {
	let geoData  = [];
	try {
		if (locationTxt) {
			geoData = await geocoder.forwardGeocode({
				query: locationTxt, limit: 1
			}).send();
			return geoData.body.features;
		}
	} catch (err) {
		return geoData;
	}
	return geoData.body.features;
};