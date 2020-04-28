const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    gender: {
        type: String,
        minlength: 1,
        maxlength: 1,
        required: true
    },
    age: Number,
    phone: Number
});

//registering UserSchema inside mongoose
//1st param - name of schema; 2nd param - schema object
module.exports = mongoose.model("User", UserSchema);