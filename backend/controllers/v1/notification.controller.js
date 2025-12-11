import Notification from '../../models/notification.model.js';

export async function getNotifications(req, res) {
  try {
    const userId = req.user.uid || req.user._id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy thông báo' });
  }
}

export async function createNotification(req, res) {
  try {
    const { message, userId, activityId, activityName } = req.body;
    const notification = new Notification({
      message,
      userId,
      activityId,
      activityName,
      read: false,
      createdAt: new Date()
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tạo thông báo' });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi cập nhật thông báo' });
  }
}