import io from 'socket.io-client';
import { setSocket } from './socketSlice';
import { setOnlineUsers } from './userSlice';

const socketMiddleware = store => next => action => {
  if (action.type === 'socket/connect') {
    const socket = io('http://localhost:8000', {
      query: { userId: action.payload.userId },
    });

    socket.on('getOnlineUsers', onlineUsers => {
      store.dispatch(setOnlineUsers(onlineUsers));
    });

    store.dispatch(setSocket(socket));

    return () => {
      socket.close();
    };
  }

  if (action.type === 'socket/disconnect') {
    const socket = store.getState().socket.socket;
    if (socket) {
      socket.close();
      store.dispatch(setSocket(null));
    }
  }

  return next(action);
};

export default socketMiddleware;
