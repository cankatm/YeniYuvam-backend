require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const schema = require('./schema/schema');

const app = express();

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wgzdi.mongodb.net/YeniTuvam?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error: ', err.message));

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => console.log(`Server started at port ${4000}`));
