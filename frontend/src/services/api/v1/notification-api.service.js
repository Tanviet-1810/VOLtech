import { httpGet, httpPost, httpPatch } from '../http-client.js';

export async function getNotifications() {
  return httpGet('/notification');
}
export async function createNotification(data) {
  return httpPost('/notification', data);
}
export async function markNotificationRead(id) {
  return httpPatch(`/notification/${id}/read`);
}