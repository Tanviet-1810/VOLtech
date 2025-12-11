import React from 'react';
import NotificationIcon from '../../../shared/notification/NotificationIcon.jsx';
import styles from '../header.module.scss';
import useNotificationContext from '../../../../contexts/notification/useNotificationContext.jsx';
import useAuthContext from '../../../../contexts/auth/useAuthContext.jsx';

export default function NotificationButton() {
  const { hasUnread } = useNotificationContext();
  const { isAuth, user } = useAuthContext();

  if (!isAuth || !user) return null;

  return (
    <div className={styles.notificationButton}>
      <NotificationIcon hasUnread={hasUnread} />
    </div>
  );
}
