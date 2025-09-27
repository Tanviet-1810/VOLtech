import React from 'react';
import AppSection from '../../components/shared/app-section/AppSection';
import NotificationList from '../../components/shared/notification/NotificationList';
import useNotificationContext from '../../contexts/notification/useNotificationContext';
// import useAuthContext from '../../contexts/auth/useAuthContext';
import styles from './NotificationPage.module.scss';

export default function NotificationPage() {
  const { notifications } = useNotificationContext();

  return (
    <AppSection className={styles.Notification}>
      <NotificationList notifications={notifications} />
      {notifications.length === 0 && (
        <div className={styles.emptyMessage}>
          Bạn chưa có thông báo nào
        </div>
      )}
    </AppSection>
  );
}
