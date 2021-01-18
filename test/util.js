const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('../src/config/typeDefs');
const { resolvers } = require('../src/config/resolvers');
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = {
  server,
};
