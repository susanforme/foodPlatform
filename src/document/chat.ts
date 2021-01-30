import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
export const chatSchema = buildSchema(`
  type Subscription {
    greetings: String
  }
`);

// The roots provide resolvers for each GraphQL operation
export const chatRoots = {
  subscription: {
    greetings: async function* sayHiIn5Languages() {
      for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
        yield { greetings: hi };
      }
    },
  },
};
