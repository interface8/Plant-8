import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

interface NotificationSocketData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  metadata: any;
  createdAt: Date;
}

export function useNotificationsSocket(userId: string | undefined) {
  const [notification, setNotification] = useState<NotificationSocketData | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    if (!socket) {
      socket = io({
        path: '/api/socketio',
      });

      socket.on('connect', () => {
        console.log('Connected to notifications socket');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from notifications socket');
      });
    }

    // Join user-specific notification room
    socket.emit('join', `notifications:${userId}`);

    // Listen for new notification events
    const handleNewNotification = (data: NotificationSocketData) => {
      console.log('Received new notification:', data);
      setNotification(data);
    };

    socket.on('notification:new', handleNewNotification);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('notification:new', handleNewNotification);
        socket.emit('leave', `notifications:${userId}`);
      }
    };
  }, [userId]);

  return { notification, clearNotification: () => setNotification(null) };
}
