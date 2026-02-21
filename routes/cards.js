const express = require("express");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");
const { checkCardBody } = require("./cardValidation");
const router = express.Router();

//////////////// get all cards
router.get("/", async (req, res) => {
    try {
        // get cards from DB
        const cards = await Card.find();
        if (!cards) return res.status(404).send("no cards found");
        // return cards
        res.status(200).send(cards);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// get all cards by user id
router.get("/my-cards", auth, async (req, res) => {
    try {
        // get user id from token
        const userId = req.payload._id;
        if (!userId) return res.status(401).send("user not signed in");
        // get cards from DB
        const cards = await Card.find({ user_id: userId });
        if (!cards) return res.status(404).send("no cards found");
        // return cards
        res.status(200).send(cards);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// get card by id
router.get("/:id", async (req, res) => {
    try {
        // get card from DB
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).send("card not found");
        // return card
        res.status(200).send(card);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// create new card
///////// generate unique bizNumber
const generateBizNumber = async () => {
    try {
        let bizNumber;
        let card;
        
        do {
            bizNumber = Math.floor(1000000 + Math.random() * 9000000);
            card = await Card.findOne({ bizNumber: bizNumber });
        } while (card);
        return bizNumber;

    } catch (error) {
        console.log(error);
        throw new Error("Error generating bizNumber");
    }
}

///////// create request
router.post("/", auth, async (req, res) => {
    try {
        // check if user is a business user
        if (!req.payload.isBusiness) return res.status(403).send("Not a business user");
        // joi validation
        const { error } = checkCardBody.validate(req.body);
        if (error) return res.status(400).send(error);
        // create new card object
        const card = new Card({ ...req.body, user_id: req.payload._id, likes: [], bizNumber: await generateBizNumber() });
        await card.save();
        // return card
        res.status(201).send(card);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

///////// edit by id request
router.put("/:id",auth, async (req, res) => {
    try {
        // only allow user who created the card to edit it
        const cardToUpdate = await Card.findById(req.params.id);
        if (!cardToUpdate) return res.status(404).send("card not found");
        if (cardToUpdate.user_id != req.payload._id) return res.status(401).send("Access denied");
        // joi validation
        const { error } = checkCardBody.validate(req.body);
        if (error) return res.status(400).send(error);
        // update card
        const card = await Card.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!card) return res.status(404).send("card not found");
        // return updated card
        res.status(200).send(card);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

//////////////// like a card
router.patch("/:id", auth, async (req, res) => {
    try {
        // get card by id
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).send("card not found");
        // check if user is signed in
        const userId = req.payload._id;
        if (!userId) return res.status(401).send("user not signed in");
        // check if user already liked the card
        const index = card.likes.indexOf(userId);
        if (index === -1) {
            // like the card
            card.likes.push(userId);
        } else {
            // unlike the card
            card.likes.splice(index, 1);
        }
        // save the card and return it with status
        await card.save();
        res.status(200).send(card);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
})


//////////////// delete card by id
router.delete("/:id", auth, async (req, res) => {
    try {
        // check if user is admin
        if (!req.payload.isAdmin) {
            const cardToDelete = await Card.findById(req.params.id);
            if (!cardToDelete) return res.status(404).send("card not found");
            // if user is not an admin, only allow user who created the card to delete it
            if (cardToDelete.user_id != req.payload._id) return res.status(401).send("Access denied");
        }
        // delete card
        const deletedCard = await Card.findByIdAndDelete(req.params.id);
        if (!deletedCard) return res.status(404).send("card not found");
        // return deleted card
        res.status(200).send(deletedCard);

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

module.exports = router;