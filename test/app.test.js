/* eslint-disable no-undef */
const { createTestClient } = require('apollo-server-testing');
const { server } = require('./util');
const gql = require('graphql-tag');

const HELLO = gql`
  query Hello {
    hello
  }
`;

describe('测试query', () => {
  it('测试test', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: HELLO,
      // variables: { id: 1 }
    });
    expect(res).toMatchSnapshot();
  });
});
