import { useContext } from 'react';
import NotificationContext from './NotificationContext';

export default function useNotificationContext() {
  return useContext(NotificationContext);
}
