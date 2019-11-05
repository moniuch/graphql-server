const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');

// allow cors
app.use(cors());

mongoose.connect('mongodb+srv://artur:test123@cluster0-nndtz.mongodb.net/test?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('connected to database'))
	.catch(err => console.log(err));

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true,
}));

app.listen(4000, () => {
	console.log('now listening on port 4000');
});
