import { updateRecord, UploadRecordData } from '@/controllers/chat';
import { Server } from 'socket.io';
import { getRoomId, now } from '.';

export default function setWs(socketServer: Server) {
  socketServer.on('connection', (socket) => {
    console.log(`ws连接开启`);

    socket.on('chat', (data: UploadRecordData) => {
      const { send, receive, message, img } = data;
      const userIds = [send, receive];
      const roomId = getRoomId(userIds);
      socket.join(roomId);
      // 广播
      socketServer.to(roomId).emit('back', {
        data: { ...data, createTime: new Date().valueOf() },
      });
      // 这里存入数据库,并且注意错误处理
      updateRecord({ send, receive, message, img })
        .then(() => {
          console.log(`${now()},${send}发送的消息存入数据库`);
        })
        .catch(() => {
          console.log(`${now()},聊天记录保存失败`);
        });
    });
    socket.on('disconnect', () => {
      console.log(`username的客户端已经断开${new Date().toLocaleString()}`);
    });
  });
}
