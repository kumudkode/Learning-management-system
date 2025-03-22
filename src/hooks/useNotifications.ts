"use client";

import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // In a real application, you would fetch notifications from an API
  useEffect(() => {
    // Mock data for demonstration
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New course available",
        message: "Check out our new course on React Native development!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        type: "info",
      },
      {
        id: "2",
        title: "Assignment due soon",
        message: "Your JavaScript Fundamentals assignment is due tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        type: "warning",
      },
      {
        id: "3",
        title: "Account verified",
        message: "Your account has been successfully verified.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        type: "success",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
}
