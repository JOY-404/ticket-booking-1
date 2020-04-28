const express = require("express");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const router = express.Router();

//we can store ticket history in another collection
//Update the ticket status (open/close + adding user details)
router.post('/book-ticket', (req, res) => {
    const ticket = new Ticket({ seatNumber: req.body.seatNumber })
    const user = new User(req.body.passengerInfo)

    user.save()
        .then(data => {
            if (data) {
                ticket.passengerInfo = user._id
                ticket.save()
                    .then(data => res.status(200).json(data))
                    .catch(error => {
                        User.findOneAndDelete({ _id: user._id })
                            .then((data) => res.status(400))
                            .catch(error => res.status(400).json({ message: error }))
                    })
            }
        })
        .catch(error => res.status(404).json({ message: error }))
});

// View all closed tickets
router.get('/ticket/view-closed', (req, res) => {
    Ticket.find({ isBooked: true }, (error, data) => {
        if (error) res.status(404).json({ message: error })
        if (data) res.status(200).json(data)
    })
});

// View all open tickets
router.get('/ticket/view-open', (req, res) => {
    Ticket.find({ isBooked: false }, (error, data) => {
        if (error) 
            res.status(404).json({ message: error })
        if (data) 
            res.status(200).json(data)
    })
});

//to reset the server (opens up all the tickets)
router.post('/ticket/reset', (req, res) => {
    //username and password can be used for admin verification
    Ticket.find({ isBooked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) {
            data.forEach(function(ticket){
                ticket.isBooked = false
                ticket.save()
                    .then(data => console.log(`Ticket Opened - ticketID: ${ticket._id}`))
                    .catch(error => console.log(`Failed to Open Ticket - ticketID: ${ticket._id}`))
            });
            res.status(200).json({ message: "success" })
        }
    });
});

// View Ticket Status with ticketID
router.get('/ticket-status/:ticketID', (req, res) => {
    const { ticketID } = req.params
    Ticket.findById(ticketID, function (error, ticket) {
        if (error) res.status(404).json({ message: error })
        if (ticket) {
            if(ticket.isBooked)
                res.status(200).json({ status: "closed" })   
            else
                res.status(200).json({ status: "open" })
        }
    })
});

// View Details of person owning the ticket with ticketID
router.get('/ticket/details/:ticketID', (req, res) => {
    const { ticketID } = req.params
    Ticket.findById(ticketID, function (error, ticket) {
        if (error) res.status(404).json({ message: err })
        if (ticket) {
            User.findById(ticket.passengerInfo, function (error, user) {
                if (error) 
                    res.status(404).json({ message: error })
                if (user) 
                    res.status(200).json(user)
            })
        }
    })
})

module.exports = router;