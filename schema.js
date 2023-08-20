const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');


const stringExtension = (joi) => {
	return {
		type: 'string',
		base: joi.string(),
		messages: {
			'string.escapeHTML': '{{#label}} should not contain any html tags!'
		},
		rules: {
			escapeHTML: {
				validate(value, helpers) {
					const clean = sanitizeHtml(value, {
						allowedTags: [],
						allowedAttributes: {}
					});
					if (clean === value) {
						return;
					}
					return helpers.error('string.escapeHTML', {value});
				}
			}
		}
	}
};

const Joi = BaseJoi.extend(stringExtension);


module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		price: Joi.number().required().min(0),
		description: Joi.string().required().escapeHTML(),
		location: Joi.string().required().escapeHTML()
	}).required(),
	deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5).messages({
			"number.min": `"{#key}" is required and should be at least one star.`
		}),
		body: Joi.string().required().escapeHTML()
	}).required()
});

module.exports.userSchema = Joi.object({
	username: Joi.string().trim().min(3).required().escapeHTML(),
	email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required().messages({
		"string.pattern.base": "Invalid email address! {#email} must be valid",
		"any.required": `{#label} is a required`
	}).escapeHTML(),
	password: Joi.string().trim().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).required().messages({
		"string.pattern.base": "Invalid password! {#label} must have minimum eight characters, at least one uppercase letter, one lowercase letter and one digit",
		"any.required": `{#label} is a required`
	}).escapeHTML()
});