const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const _ = require('lodash');

// const books = [
// 	{ name: 'Name of the Wind', authorId: '1', genre: 'Fantasy', id: '1' },
// 	{ name: 'The Final Empire', authorId: '2', genre: 'Fantasy', id: '2' },
// 	{ name: 'The Long Earth', authorId: '3', genre: 'Sci-Fi', id: '3' },
// 	{ name: 'The Hero of Ages', authorId: '2', genre: 'Fantasy', id: '4' },
// 	{ name: 'The Colour of Magic', authorId: '3', genre: 'Fantasy', id: '5' },
// 	{ name: 'The Light Fantastic', authorId: '3', genre: 'Fantasy', id: '6' },
// ];
//
// const authors = [
// 	{ name: 'Patrick Rothfuss', age: 44, id: '1' },
// 	{ name: 'Brandon Sanderson', age: 42, id: '2' },
// 	{ name: 'Terry Pratchett', age: 66, id: '3' },
// ];

const Book = require('../models/book');
const Author = require('../models/author');

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				const { authorId } = parent;
				return Author.findById(authorId);
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				const { id } = parent;
				return Book.find({ authorId: id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = args;
				return Book.findById(id);
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = args;
				return Author.findById(id);
			},
		},
		books: {
			type: GraphQLList(BookType),
			resolve() {
				return Book.find({});
			},
		},
		authors: {
			type: GraphQLList(AuthorType),
			resolve() {
				return Author.find({});
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				age: { type: GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				const { age, name } = args;
				const author = new Author({ name, age });
				return author.save();
			},
		},

		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				genre: { type: GraphQLNonNull(GraphQLString) },
				authorId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const { authorId, name, genre } = args;
				const book = new Book({ name, genre, authorId });
				return book.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
