/* eslint-disable no-undef */
const { createTestClient } = require('apollo-server-testing');
const { server, PATH_ENV } = require('./util');
const mongoose = require('mongoose');
// casual https://github.com/boo1ean/casual 随机数据生成
const casual = require('casual');
const USER = require('./gql/user');
const ARTICLE = require('./gql/article');

beforeAll(() => {
  mongoose.connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  });
});

describe('user用户gql', () => {
  it('查询用户', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: USER.user,
      variables: { id: '600a74a4ed1dbf3e20d570c7' },
    });
    // 生成快照
    expect(res.data).toMatchSnapshot();
  });
  it('注册账号', async () => {
    const { mutate } = createTestClient(server);
    const createUserRes = await mutate({
      mutation: USER.CREATE_USER,
      variables: {
        data: {
          username: casual.username,
          password: casual.password,
          birthday: 1611294692576,
          email: casual.email,
        },
      },
    });
    expect(createUserRes.data).toMatchSnapshot();
  });
  it('登录通过email,用户名', async () => {
    const { mutate } = createTestClient(server);
    const createUserRes = await mutate({
      mutation: USER.LOGIN,
      variables: {
        data: {
          username: '托尔斯泰',
          email: '',
          password: '123456',
        },
      },
    });
    expect(createUserRes.data).toMatchSnapshot();
  });
});
