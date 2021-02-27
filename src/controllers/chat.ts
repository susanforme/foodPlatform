import Record from '@/models/record';
import Room from '@/models/room';
import { IUser } from '@/models/user';
import { getNotEmptyArray, getRoomId } from '@/plugins';

/**
 * @description
 * 直接插入聊天记录,当房间不存在的时候创建房间
 */
export async function updateRecord(uploadRecordData: UploadRecordData) {
  const { send, receive, message, img } = uploadRecordData;
  const roomId = getRoomId([send, receive]);
  const record = new Record({
    roomId,
    send,
    receive,
    message,
    img,
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
  const data = await Room.find(
    { user: id },
    {
      user: 1,
      record: { $slice: -1 },
    },
  )
    .populate('user', {
      headImg: 1,
      username: 1,
      id: 1,
    })
    .populate('record', {
      message: 1,
      createTime: 1,
      img: 1,
    })
    .sort({ lastActiveTime: 1 })
    .limit(10);
  const body = getNotEmptyArray(
    data.map((v) => {
      const other = (v.user as IUser[]).filter((v) => v.id !== id)[0];
      if (v && other) {
        const { username, headImg, id: userId } = other;
        return {
          user: {
            username,
            headImg,
            id: userId,
          },
          record: v.record[0] || {},
        };
      }
    }),
  );
  return body;
}

/**
 * @description
 * 查询两个人之间的历史聊天记录,只会返回20条,同时需要注意鉴权
 */
export async function queryPersonalHistoryChat(roomId: string, page = 1) {
  const data = await Record.find({ roomId })
    .skip((page - 1) * 20)
    .sort({
      createTime: -1,
    })
    .limit(20);

  return data.sort((a, b) => a.createTime - b.createTime);
}

/**
 * @description
 * 清空该房间,但是聊天记录会保存
 */
export async function deleteRoom(id: string) {
  await Room.findOneAndDelete({ roomId: id });
  return;
}

export interface UploadRecordData {
  send: string;
  receive: string;
  message: string;
  img?: string;
}
