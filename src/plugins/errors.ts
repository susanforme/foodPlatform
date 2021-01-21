import { ApolloError } from 'apollo-server';

export class ServerError extends ApolloError {
  constructor(public errMsg: ErrMsg) {
    super(errMsg.msg, errMsg.code);
    // 输出错误
    console.log(errMsg);
  }
}

export const errMap = {
  user: {
    U0001: { msg: '用户名已经存在', code: 'U0001' },
    U0002: { msg: 'email已经存在', code: 'U0002' },
    U0003: { msg: '手机号已存在', code: 'U0003' },
    U0004: { msg: 'email格式错误', code: 'U0004' },
  },
};

Object.freeze(errMap);

interface ErrMsg {
  code: string;
  msg: string;
}