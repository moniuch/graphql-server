const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		year: { type: GraphQLString },
		genre: {
			type: GenreType,
			resolve(parent) {
				const { genreId } = parent;
				return Genre.findById(genreId);
			},
		},
		author: {
			type: AuthorType,
			resolve(parent) {
				const { authorId } = parent;
				return Author.findById(authorId);
			},
		},
		similar: {
			type: GraphQLList(BookType),
			args: { exclude: { type: GraphQLID } },
			resolve(parent, args) {
				const { authorId, genreId } = parent;
				const { exclude } = args;
				return Book.find({ $and: [{ authorId }, { genreId }, { _id: { $ne: exclude } }] });
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		books: {
			type: GraphQLList(BookType),
			args: { exclude: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = parent;
				const { exclude } = args;

				if (exclude) {
					return Book.find({ $and: [{ authorId: id }, { _id: { $ne: exclude } }] });
				} else {
					return Book.find({ authorId: id });
				}
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
			args: { exclude: { type: GraphQLID } },
			resolve(parent, args) {
				const { id } = parent;
				const { exclude } = args;

				if (exclude) {
					return Book.find({ $and: [{ genreId: id }, { _id: { $ne: exclude } }] });
				} else {
					return Book.find({ genreId: id });
				}
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
			args: { exclude: { type: GraphQLID } },
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
				firstName: { type: GraphQLNonNull(GraphQLString) },
				lastName: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const { firstName, lastName } = args;
				const author = new Author({ firstName, lastName });
				return author.save();
			},
		},

		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				year: { type: GraphQLString },
				genreId: { type: GraphQLNonNull(GraphQLID) },
				authorId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const { authorId, name, genreId } = args;
				const book = new Book({ name, genreId, authorId });
				return book.save();
			},
		},

		updateBook: {
			type: BookType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLNonNull(GraphQLString) },
				year: { type: GraphQLString },
				genreId: { type: GraphQLNonNull(GraphQLID) },
				authorId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const { authorId, name, genreId, id } = args;
				return Book.findOneAndUpdate({ _id: id }, { name, genreId, authorId }, { upsert: true, 'new': true });
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
