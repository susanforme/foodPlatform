import { pubSub } from '@/plugins';
import { buildSchema } from 'graphql';
// Construct a schema, using GraphQL schema language
export const chatSchema = buildSchema(`
  type Chat {
    receive: ID!
    send: ID!
    message: String!
  }

  type Query {
    chats: [Chat]
  }

  type Mutation {
    sendMessage(data:ChatData!): Chat
  }

  type Subscription {
    messageSent: Chat
  }

  input ChatData{
    receive: ID!
    send: ID!
    message: String!
  }
`);

const chats: any[] = [];
const CHAT_CHANNEL = 'CHAT_CHANNEL';
// The roots provide resolvers for each GraphQL operation
export const chatRoots = {
  Query: {
    chats() {
      return chats;
    },
  },
  Mutation: {
    sendMessage(_: any, args: any) {
      const { receive, send, message } = args;
      const chat = {
        receive,
        send,
        message,
      };
      pubSub.publish(CHAT_CHANNEL, {
        messageSent: chat,
      });
      return chat;
    },
  },
  subscription: {
    messageSent() {
      return pubSub.asyncIterator(CHAT_CHANNEL);
    },
  },
};
