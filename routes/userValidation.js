const joi = require("joi");

// name
const nameSchema = joi.object({
    first: joi.string().min(2).required(),
    middle: joi.string().allow(null, ""),
    last: joi.string().min(2).required()
});

// image
const imageSchema = joi.object({
    url: joi.string().min(14).allow(null, ""),
    alt: joi.string().min(2).allow(null, ""),
});

// address
const addressSchema = joi.object({
    state: joi.string().allow(null, ""),
    country: joi.string().required().min(2),
    city: joi.string().required().min(2),
    street: joi.string().required().min(2),
    houseNumber: joi.number().allow(null),
    zip: joi.string().allow(null, ""),
});

/// combined user
const checkUserBody = joi.object({
    name: nameSchema.required(),
    phone: joi.string().required().regex(/^(?:\+972|0)(?:5\d|7[2-9]|[2-4]|8|9)[-\s]?\d{3}[-\s]?\d{4}$/),
    email: joi.string().email().required().min(5),
    password: joi.string().required().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9].*[0-9].*[0-9].*[0-9])(?=.*[!@#$%^&*_-]).{8,}$/),
    image: imageSchema.required(),
    address: addressSchema.required(),
    isBusiness: joi.boolean().required(),
});

module.exports = { checkUserBody };