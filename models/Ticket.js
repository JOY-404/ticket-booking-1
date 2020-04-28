const mongoose = require("mongoose");
const User = require("../models/User");

const TicketSchema = new mongoose.Schema({
    seatNumber: { 
    	type: Number, 
    	min: 1, 
    	max: 40, 
        required: true
    },
    isBooked: { 
    	type: Boolean, 
    	default: true 
    },
    date: { 
    	type: Date, 
    	default: Date.now() 
    },
    passengerInfo: { 
    	type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
});

module.exports = mongoose.model("Ticket", TicketSchema);