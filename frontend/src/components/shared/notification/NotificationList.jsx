import styles from './Notification.module.scss';
import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications }) {
  const safeNotifications = notifications || [];
  return (
    <div className={styles.notificationListPage}>
      <div className={styles.notificationListHeader}>
        <h2 className={styles.pageTitle}>Thông báo</h2>
        <span>Mới</span>
      </div>
      {safeNotifications.length === 0 ? (
        <div className={styles.notificationListEmpty}>Không có thông báo nào</div>
      ) : (
        <ul className={styles.notificationListTable}>
          {safeNotifications.map((n) => (
            <li key={n._id || n.id}>
              <NotificationItem notification={n} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
