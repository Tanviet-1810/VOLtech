// ...existing imports...
  // Scroll to top smoothly when notification is clicked
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
import styles from './Notification.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../const/route.js';

export default function NotificationItem({ notification }) {
  const activityId = notification.activityId || notification.activity_id || notification.activity?._id;
  const linkTo = activityId ? ROUTES.ACTIVE.withId(activityId) : null;
  const itemClass = notification.read
    ? `${styles.notificationItem} ${styles.notificationItemRead}`
    : `${styles.notificationItem} ${styles.notificationItemUnread}`;

  const message = (
    <>
      {notification.message}
      {notification.activityName && (
        <span style={{ color: 'var(--txt-accent)', fontWeight: 'bold', marginLeft: 8 }}>
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

  const Content = (
    <>
      <div>{message}</div>
      {time}
    </>
  );

  return linkTo ? (
    <Link to={linkTo} className={itemClass} onClick={handleClick}>
      {Content}
    </Link>
  ) : (
    <div className={itemClass} onClick={handleClick}>
      {Content}
    </div>
  );
}

