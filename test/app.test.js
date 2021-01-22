/* eslint-disable no-undef */
const { createTestClient } = require('apollo-server-testing');
const { server, PATH_ENV } = require('./util');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

// casual https://github.com/boo1ean/casual 随机数据生成

const user = gql`
  # mutation createUser($data: RegisterData!) {
  #   createUser(data: $data) {
  #     username
  #     headImg
  #     email
  #     createTime
  #     birthday
  #     id
  #   }
  # }
  # {
  #   "data":{
  #    "username":"托尔斯泰",
  #     "password":"123456",
  #     "birthday":1611294692576
  #   }
  # }
  query getUser($id: ID!) {
    user(id: $id) {
      username
    }
  }
`;

beforeAll(() => {
  mongoose.connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  });
});

describe('测试query', () => {
  it('测试user', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: user,
      variables: { id: '600a74a4ed1dbf3e20d570c7' },
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
