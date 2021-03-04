require('module-alias');
const { ApolloServer } = require('apollo-server');
const path = require('path');
const loadFilesSync = require('@graphql-tools/load-files').loadFilesSync;
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const scalar = require('../src/document/scalar');
const context = require('../src/document/context');
const dotenv = require('dotenv');

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, '../src/graphql/gql/**/*.graphql')),
);

const myResolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, `../src/graphql/resolvers/**/*.ts`)),
);
const resolvers = Object.assign(myResolvers, scalar.default);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const PATH_ENV =
  dotenv.config({ path: path.join(process.cwd(), '/bin/.env') }).parsed || {};

module.exports = {
  server,
  PATH_ENV,
};
