import { UploadRecordData } from '@/controllers/chat';
import { Socket, Server } from 'socket.io';
import { getRoomId } from '.';

export default function setWs(socketServer: Server) {
  socketServer.on('connection', (socket: Socket) => {
    socket.on('chat', (data: UploadRecordData) => {
      const userIds = [data.send, data.receive];
      const roomId = getRoomId(userIds);
      socket.join(roomId);
      // 广播
      socketServer.to(roomId).emit('back', {
        status: 1,
        data: { ...data, createTime: new Date().toLocaleString() },
      });
      // 这里存入数据库,并且注意错误处理
    });
    socket.on('disconnect', () => {
      console.log(`username的客户端已经断开${new Date().toLocaleString()}`);
    });
  });
}
