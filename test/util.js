const { ApolloServer } = require('apollo-server');
const path = require('path');

const loadFilesSync = require('@graphql-tools/load-files').loadFilesSync;
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, '../src/graphql/gql/**/*.graphql')),
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, `../src/graphql/resolvers/**/*.ts`)),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = {
  server,
};
