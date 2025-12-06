import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notification.module.scss';
import { ROUTES } from '../../../const/route.js';
import Button from '../button/Button.jsx';

export default function NotificationItem({ notification }) {
  const navigate = useNavigate();

  const activityId =
    notification.activityId ||
    notification.activity_id ||
    notification.activity?._id;

  const linkTo = activityId ? ROUTES.ACTIVE.withId(activityId) : null;

  const itemClass = notification.read
    ? `${styles.notificationItem} ${styles.notificationItemRead}`
    : `${styles.notificationItem} ${styles.notificationItemUnread}`;

  const handleNavigate = () => {
    if (!linkTo) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(linkTo);
  };

  const message = (
    <>
      {notification.message}
      {notification.activityName && (
        <span
          style={{
            color: 'var(--txt-accent)',
            fontWeight: 'bold',
            marginLeft: 8,
          }}
        >
          {notification.activityName}
        </span>
      )}
    </>
  );

  const time = (
    <div className={styles.notificationItemTime}>
      {new Date(notification.createdAt).toLocaleString('vi-VN')}
    </div>
  );

  return (
    <div className={itemClass} onClick={handleNavigate} role="button" tabIndex={0}>
      <div>{message}</div>
      {time}

      {linkTo && (
        <div className={styles.btnWrapper}>
          <Button
            variant="primary"
            fillWidth
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      )}
    </div>
  );
}
