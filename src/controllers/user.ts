import User from '@/models/user';
import Idention from 'identicon.js';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import { errMap, ServerError } from '@/plugins/errors';
import { validate as isEmail } from 'email-validator';
import { ipToAddress, PATH_ENV } from '@/plugins';

/**
 * @description
 * 注册账号
 */
export async function addUser(data: UserData) {
  const { username, password, birthday, email, phoneNumber, ip } = data;

  // 校验是否有重复的账号
  const repeatingData = await Promise.all([
    User.findOne({ username }),
    User.findOne({ email }),
    User.findOne({ phoneNumber }),
  ]);
  repeatingData.forEach((v, index) => {
    if (v) {
      if (index === 0) {
        throw new ServerError(errMap.user.U0001);
      } else if (index === 1) {
        throw new ServerError(errMap.user.U0002);
      } else {
        throw new ServerError(errMap.user.U0003);
      }
    }
  });

  // 校验email
  if (email && !isEmail(email)) {
    throw new ServerError(errMap.user.U0004);
  }

  const headImg = `data:image/png;base64,${new Idention(sha1(username).toString(), 64).toString()}`;
  const encryPass = sha256(password + PATH_ENV.ENCRY_USER_STRING).toString();
  const location = await ipToAddress(ip);
  const user = new User({
    headImg,
    createTime: new Date().valueOf(),
    password: encryPass,
    birthday,
    email,
    phoneNumber,
    location,
  });

  const response = await user.save();
  return {
    location: response.location,
    username: response.username,
    id: response.id,
    headImg: response.headImg,
  };
}

/**
 * @description
 * 通过id查询
 */
export async function findByIdUser(id: string) {
  const data = await User.findById(id, ['username', 'headImg']);
  if (!data) {
    throw new ServerError(errMap.user.U0005);
  }
  return data;
}

interface UserData {
  username: string;
  password: string;
  ip: string;
  birthday?: number;
  email?: string;
  // 保留字段
  phoneNumber?: number;
}
