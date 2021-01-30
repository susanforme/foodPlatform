import Record from '@/models/record';
import Room from '@/models/room';
import { IUser } from '@/models/user';

/**
 * @description
 * 直接插入聊天记录,当房间不存在的时候创建房间
 */
export async function updateRecord(uploadData: uploadMsg) {
  const { send, receive, message } = uploadData;
  const roomId = [send, receive].sort().reduce((pre, cur) => pre + cur);
  const record = new Record({
    roomId,
    send,
    receive,
    message,
    createTime: new Date().valueOf(),
  });
  const { id } = await record.save();
  await Room.findOneAndUpdate(
    { roomId },
    {
      $push: { record: id },
      user: [send, receive],
      lastActiveTime: new Date().valueOf(),
    },
    { setDefaultsOnInsert: true, upsert: true },
  );
  // 返回聊天记录的id
  return {
    id,
  };
}

/**
 * @description
 * 根据id获取 整个聊天列表
 */
export async function getPersonalChatList(id: string) {
  const data = await Room.find({ user: id }, 'user')
    .populate('user', {
      headImg: 1,
      username: 1,
      id: 1,
    })
    .sort({ lastActiveTime: 1 })
    .limit(10);
  const body = data
    .map((v) => {
      return (v.user as IUser[]).filter((v) => v.id !== id)[0];
    })
    .map((v) => {
      const { username, headImg, id } = v;
      return {
        username,
        headImg,
        id,
      };
    });
  return body;
}

/**
 * @description
 * 查询两个人之间的历史聊天记录,只会返回最近20条,同时需要注意鉴权
 */
export async function queryPersonalHistoryChat(roomId: string, page = 0) {
  const data = await Record.find({ roomId })
    .skip(page * 20)
    .sort({
      createTime: 1,
    })
    .limit(20);

  return data;
}

/**
 * @description
 * 清空该房间,但是聊天记录会保存
 */
export async function deleteRoom(id: string) {
  await Room.findOneAndDelete({ roomId: id });
  return;
}

interface uploadMsg {
  send: string;
  receive: string;
  message: string;
  createTime: string;
  img?: string;
}
