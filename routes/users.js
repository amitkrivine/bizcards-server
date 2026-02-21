const express = require("express");
const joi = require("joi");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/User");
const { checkUserBody } = require("./userValidation");
const router = express.Router();


//////////////// register
router.post("/", async (req, res) => {
    try {
        // joi validation
        const { error } = checkUserBody.validate(req.body);
        if (error) return res.status(400).send(error);
        // check if user exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exists");
        // create new user object
        user = new User({...req.body, isAdmin: false});
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
        await user.save();
        // create token
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin, isBusiness: user.isBusiness }, process.env.JWTKEY);
        // return token and status (unspecified in project requirements)
        res.status(201).send(token);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});


//////////////// login
const checkLoginBody = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().required().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9].*[0-9].*[0-9].*[0-9])(?=.*[!@#$%^&*_-]).{8,}$/)
});

router.post("/login", async (req, res) => {
    try {
        // joi validation
        const { error } = checkLoginBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // check if user exists
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Wrong email or password");
        // check if user is blocked
        if (user.blockedUntil && user.blockedUntil > new Date()) {
            return res.status(403).send("Account is temporarily blocked. Try again later.");
        }
        // compare password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            // increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            // block user if 3 failed attempts
            if (user.failedLoginAttempts >= 3) {
                user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                user.failedLoginAttempts = 0;
            }
            await user.save();
            return res.status(400).send("Wrong email or password");
        };
        // reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.blockedUntil = null;
        await user.save();
        // create token
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin, isBusiness: user.isBusiness }, process.env.JWTKEY);
        // return token and status to client
        res.status(200).send(token);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// get all users
router.get("/", auth, async (req, res) => {
    try {
        // check if user is admin
        if (!req.payload.isAdmin) return res.status(401).send("Access denied");
        // get users from DB
        const users = await User.find();
        if (!users) return res.status(404).send("no users found");
        // return status and users to client
        res.status(200).send(users)

    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
});

//////////////// get user by id
router.get("/:id", auth, async (req,res) => {
    try {
        // check if user is admin
        // if not, allow user to get only his own details
        const isAdmin = req.payload.isAdmin;
        const isSelf = (req.payload._id == req.params.id);
        if (!isAdmin && !isSelf) {
            return res.status(403).send("Access denied");
        }
        // get user from DB
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        // return status and user
        res.status(200).send(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
})

//////////////// edit user by id
router.put("/:id", auth, async (req,res) => {
    try {
        // allow registered user to update only their own details
        if (req.payload._id != req.params.id) return res.status(401).send("Access denied");
        // joi validation
        const { error } = checkUserBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // find and update user
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).send("User not found");
        // return updated user
        res.status(200).send(user);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// edit user's "isBusiness" status by id
router.patch("/:id", auth, async (req,res) => {
    try {
        // allow registered user to update only their own details
        if (req.payload._id != req.params.id) return res.status(401).send("Access denied");
        // find and update user's isBusiness status
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness },
            { new: true }
        );
        if (!user) return res.status(404).send("User not found");
        // return updated user
        res.status(200).send(user);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});


///////////// delete user by id
router.delete("/:id", auth, async (req,res) => {
    try {
        // check if user is admin
        // if not, allow user to get only his own details
        const isAdmin = req.payload.isAdmin;
        const isSelf = (req.payload._id == req.params.id);
        if (!isAdmin && !isSelf) {
            return res.status(403).send("Access denied");
        }
        // find and delete user
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send("User not found");
        // return deleted user
        res.status(200).send(user);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

module.exports = router;