const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
	firstName: String,
	lastName: String,
});

module.exports = mongoose.model('Author', authorSchema);
