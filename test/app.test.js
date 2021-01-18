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
    // 生成快照
    expect(res.data).toMatchSnapshot();

    /*
     * 这是mutation的代码
     * const { mutate } = createTestClient(server);
     * const res = await mutate({
     *  mutation: BOOK_TRIPS,
     *  variables: { launchIds: ['1', '2'] },
     * });
     * expect(res).toMatchSnapshot();
     */
  });
});
