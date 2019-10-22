const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;
const _ = require('lodash');

const books = [
	{ name: 'Name of the Wind', authorId: '1', genre: 'Fantasy', id: '1' },
	{ name: 'The Final Empire', authorId: '2', genre: 'Fantasy', id: '2' },
	{ name: 'The Long Earth', authorId: '3', genre: 'Sci-Fi', id: '3' },
	{ name: 'The Hero of Ages', authorId: '2', genre: 'Fantasy', id: '4' },
	{ name: 'The Colour of Magic', authorId: '3', genre: 'Fantasy', id: '5' },
	{ name: 'The Light Fantastic', authorId: '3', genre: 'Fantasy', id: '6' },
];

const authors = [
	{ name: 'Patrick Rothfuss', age: 44, id: '1' },
	{ name: 'Brandon Sanderson', age: 42, id: '2' },
	{ name: 'Terry Pratchett', age: 66, id: '3' },
];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(authors, { id: parent.authorId });
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
				return _.filter(books, { authorId: parent.id });
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
				return _.find(books, { id });
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = args;
				return _.find(authors, { id });
			},
		},
		books: {
			type: GraphQLList(BookType),
			resolve() {
				return books;
			},
		},
		authors: {
			type: GraphQLList(AuthorType),
			resolve() {
				return authors;
			},
		},
	},
});


module.exports = new GraphQLSchema({
	query: RootQuery,
});
