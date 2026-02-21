const joi = require("joi");

// image schema
const imageSchema = joi.object({
    url: joi.string().min(14).allow(null, ""),
    alt: joi.string().min(2).allow(null, ""),
});

// address schema
const addressSchema = joi.object({
    state: joi.string().allow(null, ""),
    country: joi.string().required().min(2),
    city: joi.string().required().min(2),
    street: joi.string().required().min(2),
    houseNumber: joi.number().allow(null),
    zip: joi.string().allow(null, ""),
});

// combined card schema
const checkCardBody = joi.object({
    title: joi.string().required().min(2),
    subtitle: joi.string().min(2).allow(null, ""),
    description: joi.string().min(2).allow(null, ""),
    phone: joi.string().required().regex(/^(?:\+972|0)(?:5\d|7[2-9]|[2-4]|8|9)[-\s]?\d{3}[-\s]?\d{4}$/),
    email: joi.string().email().required().min(5),
    web: joi.string().min(5).allow(null, ""),
    image: imageSchema.required(),
    address: addressSchema.required(),
});

module.exports = { checkCardBody };