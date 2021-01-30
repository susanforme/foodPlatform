import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { execute, subscribe } from 'graphql';
import { chatRoots, chatSchema } from '@/document/chat';

export function setWs(wsServer: ws.Server) {
  useServer(
    {
      schema: chatSchema,
      roots: chatRoots,
      execute,
      subscribe,
      onConnect() {
        console.log('connect');
        setTimeout(() => {}, 5000);
      },
      onSubscribe(ctx, message) {
        console.log('subscribe', message);
      },
      onDisconnect() {
        console.log('disconnect');
      },
    },
    wsServer,
  );
  wsServer.on('connection', (socket) => {
    console.log(socket.url);
  });
}
