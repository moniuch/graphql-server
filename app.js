const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://artur:test123@cluster0-nndtz.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true,
}));

app.listen(4000, () => {
	console.log('now listening on port 4000');
});
