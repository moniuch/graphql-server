const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
	name: String,
	year: String,
	genreId: String,
	authorId: String,
});

module.exports = mongoose.model('Book', bookSchema);
