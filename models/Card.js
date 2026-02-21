const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
    },
    subtitle: {
        type: String,
        required: true,
        minLength: 2,
    },
    description: {
        type: String,
        required: true,
        minLength: 2,
    },
    phone: {
        type: String,
        required: true,
        match: [/^(?:\+972|0)(?:[2-9]|5[0-9])[-\s]?\d{3}[-\s]?\d{4}$/, "Must use Israeli phone number"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
    },
    web: {
        type: String,
    },
    image: {
        type: new mongoose.Schema({
            url: {
                type: String,
                default: "https://static.thenounproject.com/png/944120-200.png"
            },
            alt: {
                type: String,
                default: "business image"
            }
        }),
        required: true,
    },
    address: {
        type: new mongoose.Schema({
            state: {
                type: String,
            },
            country: {
                type: String,
                required: true,
                minLength: 2,
            },
            city: {
                type: String,
                required: true,
                minLength: 2,
            },
            street: {
                type: String,
                required: true,
                minLength: 2,
            },
            houseNumber: {
                type: Number,
                required: true,
            },
            zip: {
                type: String,
            }
        }),
        required: true,
    },
    likes: [{
        type: String,
        default: []
    }],
    user_id: {
        type: String,
        required: true
    },
    bizNumber: {
        type: Number,
        required: true,
        unique: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;