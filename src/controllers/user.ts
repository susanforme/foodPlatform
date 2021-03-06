import User from '@/models/user';
import Idention from 'identicon.js';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import { errMap, ServerError } from '@/plugins/errors';
import { validate as isEmail } from 'email-validator';
import { PATH_ENV } from '@/plugins';

const returnData = { password: 0 };

/**
 * @description
 * 注册账号
 */
export async function createUser(data: UserData) {
  const { username, password, birthday, email, phoneNumber, location } = data;

  const checkPromise = [User.findOne({ username })];
  email && checkPromise.push(User.findOne({ email }));

  // 校验是否有重复的账号
  const repeatingData = await Promise.all(checkPromise);
  repeatingData.forEach((v, index) => {
    if (v) {
      if (index === 0) {
        throw new ServerError(errMap.user.U0001);
      } else if (index === 1) {
        throw new ServerError(errMap.user.U0002);
      }
    }
  });

  // 校验email
  if (email && !isEmail(email)) {
    throw new ServerError(errMap.user.U0004);
  }

  const headImg = `data:image/png;base64,${new Idention(
    sha1(username).toString(),
    64,
  ).toString()}`;
  const encryPass = sha256(password + PATH_ENV.ENCRY_USER_STRING).toString();
  const user = new User({
    headImg,
    createTime: new Date().valueOf(),
    password: encryPass,
    birthday,
    email,
    phoneNumber,
    location,
    username,
  });

  const response = await user.save();
  return {
    location,
    username,
    id: response.id,
    headImg,
    createTime: response.createTime,
    email,
    birthday,
  };
}

/**
 * @description
 * 通过id查询
 */
export async function getUserById(id: string) {
  const data = await User.findById(id, returnData);
  if (!data) {
    throw new ServerError(errMap.user.U0005);
  }
  return data;
}

/**
 * @description
 * 通过用户名查询用户
 */
export async function getUserByUsername(username: string) {
  const data = await User.findOne({ username }, returnData);
  if (!data) {
    throw new ServerError(errMap.user.U0005);
  }
  return data;
}

/**
 * @description
 * 更新头像,需要校验是否是本人,id是否相同
 */
export async function updateUserHeadImg(id: string, headImg: string) {
  const data = await User.findByIdAndUpdate(id, { headImg });
  return data;
}

/**
 * @description
 * 删除用户,需要校验是否是本人,id是否相同
 */
export async function deleteUser(id: string) {
  await User.findByIdAndDelete(id);
  return {
    code: '00000',
    msg: '成功删除用户',
  };
}

/**
 * 登录
 * @param body
 */
export async function loginByData(body: LoginData) {
  const { password } = body,
    encryPass = sha256(password + PATH_ENV.ENCRY_USER_STRING).toString();
  const encryData = {
    ...body,
    password: encryPass,
  };
  const data = await User.findOne(encryData, returnData);
  if (!data) {
    throw new ServerError(errMap.user.U0006);
  }
  return data;
}

export async function updateHeadImg(url: string, userId: string) {
  await User.findByIdAndUpdate(userId, { headImg: url });
}

/**
 * @description
 * 修改location
 */
export async function updateUserLocation(id: string, location: string) {
  await User.findByIdAndUpdate(id, {
    location,
  });
}
interface UserData {
  username: string;
  password: string;
  birthday?: number;
  email?: string;
  location: string;
  // 保留字段
  phoneNumber?: string;
}

type LoginData = {
  username?: string;
  email?: string;
  password: string;
};
