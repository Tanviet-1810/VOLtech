import React, { useState, useEffect } from 'react';
import NotificationContext from './NotificationContext';
import { getNotifications, markNotificationRead, createNotification } from '../../services/api/v1/notification-api.service';
import useAuthContext from '../auth/useAuthContext';

export default function NotificationContextProvider({ children }) {
  const { isAuth, user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!isAuth || !user) return;
    setLoading(true);
    getNotifications()
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setNotifications(data);
        setHasUnread(data.some(n => !n.read));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuth, user]);

  const addNotification = async (notif) => {
    if (!isAuth || !user) return;
    const newNotif = {
      message: typeof notif === 'string' ? notif : notif.message,
      userId: user._id,
      activityId: notif.activityId,
      activityName: notif.activityName,
    };
    await createNotification(newNotif);
    const res = await getNotifications();
    let data = [];
    if (res.ok) {
      data = await res.json();
    }
    setNotifications(data);
    setHasUnread(data.some(n => !n.read));
  };

  const markAsRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setHasUnread(notifications.some(n => !n.read));
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, hasUnread, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
