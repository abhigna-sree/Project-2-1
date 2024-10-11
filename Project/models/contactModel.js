const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    concern: String
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
