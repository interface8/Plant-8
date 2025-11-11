"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, Clock, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNotificationsSocket } from "@/hooks/use-notifications-socket";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface NotificationsListProps {
  initialNotifications: Notification[];
  unreadCount: number;
}

export default function NotificationsList({ initialNotifications, unreadCount: initialUnreadCount }: NotificationsListProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  
  // Connect to real-time notifications
  const { notification: newNotification, clearNotification } = useNotificationsSocket(session?.user?.id);

  // Handle new notifications from socket
  useEffect(() => {
    if (newNotification) {
      setNotifications(prev => [
        {
          id: newNotification.id,
          type: newNotification.type,
          title: newNotification.title,
          message: newNotification.message,
          read: newNotification.read,
          link: newNotification.link,
          createdAt: new Date(newNotification.createdAt).toISOString(),
        },
        ...prev
      ]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.success(newNotification.title, {
        description: newNotification.message,
      });
      
      clearNotification();
    }
  }, [newNotification, clearNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case "TASK_UPDATE":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "INVESTMENT_UPDATE":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "PAYMENT":
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      case "SYSTEM":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBorderColor = (type: string, read: boolean) => {
    if (read) return "border-gray-300";
    
    switch (type) {
      case "TASK_UPDATE":
        return "border-blue-500";
      case "INVESTMENT_UPDATE":
        return "border-green-500";
      case "PAYMENT":
        return "border-purple-500";
      case "SYSTEM":
        return "border-orange-500";
      default:
        return "border-gray-500";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (!res.ok) throw new Error("Failed to mark all as read");

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="space-y-3">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3 md:space-y-4 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const NotificationContent = (
              <div
                className={`border-l-4 ${getBorderColor(notification.type, notification.read)} pl-3 md:pl-4 py-2 ${
                  !notification.read ? "bg-blue-50/30" : ""
                } rounded-r hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            if (notification.link) {
              return (
                <Link key={notification.id} href={notification.link}>
                  {NotificationContent}
                </Link>
              );
            }

            return <div key={notification.id}>{NotificationContent}</div>;
          })
        )}
      </div>
    </div>
  );
}
