const express = require("express");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const router = express.Router();

//we can store ticket history in another collection
//create a new ticket
router.post('/book-ticket', (req, res) => {
    const ticket = new Ticket({ seatNumber: req.body.seatNumber })
    const user = new User(req.body.passengerInfo)

    user.save()
        .then(data => {
            if (data) {
                ticket.passengerInfo = user._id
                ticket.save()
                    .then(data => res.status(200).json(data))
                    .catch(err => {
                        User.findOneAndDelete({ _id: user._id })
                            .then((data) => res.status(400))
                            .catch(err => res.status(400).json({ message: err }))
                    })
            }
        })
        .catch(err => res.status(404).json({ message: err }))
});

// get list of all closed tickets
router.get('/ticket/view-closed', (req, res) => {
    Ticket.find({ isBooked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
});

// get list of all closed tickets
router.get('/ticket/view-open', (req, res) => {
    Ticket.find({ isBooked: false }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
});

module.exports = router;