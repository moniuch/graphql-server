const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: {
			type: GenreType,
			resolve(parent, args) {
				const { genreId } = parent;
				return Genre.findById(genreId);
			},
		},
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

const GenreType = new GraphQLObjectType({
	name: 'Genre',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				const { id } = parent;
				return Book.find({ genreId: id });
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
		genre: {
			type: GenreType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = args;
				return Genre.findById(id);
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
		genres: {
			type: GraphQLList(GenreType),
			resolve() {
				return Genre.find({});
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
				genreId: { type: GraphQLNonNull(GraphQLID) },
				authorId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const { authorId, name, genreId } = args;
				const book = new Book({ name, genreId, authorId });
				return book.save();
			},
		},

		addGenre: {
			type: GenreType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const { name } = args;
				const genre = new Genre({ name });
				return genre.save();
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
