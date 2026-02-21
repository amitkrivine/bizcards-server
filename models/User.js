const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: new mongoose.Schema({
            first: {
                type: String,
                required: true,
                minLength: 2,
            },
            middle: {
                type: String,
            },
            last: {
                type: String,
                required: true,
                minLength: 2,
            }
        }),
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
    },
    password: {
        type: String,
        required: true,
        match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9].*[0-9].*[0-9].*[0-9])(?=.*[!@#$%^&*_-]).{8,}$/, "password must contain 8 characters, one uppercase, one lowercase, four numbers, and one special case character"]
    },
    phone: {
        type: String,
        required: true,
        match: [/^(?:\+972|0)(?:[2-9]|5[0-9])[-\s]?\d{3}[-\s]?\d{4}$/, "Must use Israeli phone number"]
    },
    image: {
        type: new mongoose.Schema({
            url: {
                type: String,
                default: "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
            },
            alt: {
                type: String,
                default: "user image",
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
    isAdmin: {
        type: Boolean,
        required: true,
    },
    isBusiness: {
        type: Boolean,
        required: true,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    blockedUntil: {
        type: Date,
        default: null
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const User = mongoose.model("users", userSchema);

module.exports = User;