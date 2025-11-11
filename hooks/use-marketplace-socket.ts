import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addListing, updateListing, removeListing } from '@/store/slices/marketplace/listingsSlice';
import { addOrder, updateOrder } from '@/store/slices/marketplace/ordersSlice';

let socket: Socket | null = null;

export function useMarketplaceSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io({
        path: '/api/socketio',
      });

      socket.on('connect', () => {
        console.log('Connected to marketplace socket');
        // Join marketplace rooms
        socket?.emit('join', 'marketplace:listings');
        socket?.emit('join', 'marketplace:orders');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from marketplace socket');
      });
    }

    // Listen for listing events
    socket.on('listing:created', (listing) => {
      dispatch(addListing(listing));
    });

    socket.on('listing:updated', (listing) => {
      dispatch(updateListing(listing));
    });

    socket.on('listing:deleted', (data) => {
      dispatch(removeListing(data));
    });

    // Listen for order events
    socket.on('order:created', (order) => {
      dispatch(addOrder(order));
    });

    socket.on('order:statusChanged', (order) => {
      dispatch(updateOrder(order));
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('listing:created');
        socket.off('listing:updated');
        socket.off('listing:deleted');
        socket.off('order:created');
        socket.off('order:statusChanged');
      }
    };
  }, [dispatch]);

  return socket;
}
