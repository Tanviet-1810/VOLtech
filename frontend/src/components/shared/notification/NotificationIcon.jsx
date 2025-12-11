import styles from './Notification.module.scss';
import { Bell } from 'lucide-react';

export default function NotificationIcon({ hasUnread, onClick }) {
  return (
    <div className={styles.notificationIcon} onClick={onClick}>
      <Bell size={28} />
      {hasUnread && <span className={styles.notificationDot} />}
    </div>
  );
}
