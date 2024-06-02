const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    yearOfStudying: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Student", StudentSchema);