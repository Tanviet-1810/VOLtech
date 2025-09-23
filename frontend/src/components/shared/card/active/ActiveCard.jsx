import React from 'react';
import { Card, CardContent } from '../Card';
import { Badge } from '../../badge/Badge';
import Button, { BUTTON_AS } from '../../button/Button';
import { Calendar, MapPin, Users } from 'lucide-react';
import styles from './ActiveCard.module.scss';
import { ROUTES } from '../../../../const/route.js';
import { ACTIVE_STATUS_VIETNAMESE } from '../../../../const/active-status';

function isFull(activity) {
	return (activity.registeredUsers?.length || 0) >= activity.maxParticipants;
}

export default function ActiveCard({ activity, showCreator = false, className = '', ...props }) {
	const [imgError, setImgError] = React.useState(false);

	return (
		<Card className={`${styles.card} ${className}`} {...props}>
			<div className={styles.imageWrapper}>
				<img src={activity.images?.[0] || '/placeholder.png'} alt={activity.title || 'Hình ảnh hoạt động'} className={styles.image} loading='lazy' onError={() => setImgError(true)} style={imgError ? { display: 'none' } : {}} />
				{imgError && <div className={styles.imagePlaceholder}>Hình ảnh không khả dụng</div>}
				<div className={styles.badges}>
					<Badge className={styles.badge}>{ACTIVE_STATUS_VIETNAMESE[activity.status] || activity.status}</Badge>
					<Badge className={styles.badge}>+{activity.points} điểm</Badge>
					{isFull(activity) && (
						<Badge className={styles.badge} color='red'>
							Đã đầy
						</Badge>
					)}
				</div>
			</div>
			<CardContent className={styles.cardContent}>
				<h3 className={styles.cardTitle}>{activity.title}</h3>
				<div className={styles.details}>
					<div className={styles.detailItem}>
						<MapPin className={styles.icon} />
						<span>{activity.commune?.name}</span>
					</div>
					<div className={styles.detailItem}>
						<Calendar className={styles.icon} />
						<span>
							{activity.startDate ? new Date(activity.startDate).toLocaleDateString('vi-VN') : ''}
							{activity.endDate ? ' - ' + new Date(activity.endDate).toLocaleDateString('vi-VN') : ''}
						</span>
					</div>
					<div className={styles.detailItem}>
						<Users className={styles.icon} />
						<span>
							{activity.registeredUsers?.length || 0}/{activity.maxParticipants} người tham gia
							{isFull(activity) && <span className={styles.fullLabel}> (Đã đầy)</span>}
						</span>
					</div>
					{showCreator && activity.createdBy?.name && (
						<div className={styles.detailItem}>
							<span className={styles.creatorLabel}>Người tạo:</span>
							<span>{activity.createdBy.name}</span>
						</div>
					)}
				</div>
				<div className={styles.btnWrapper}>
					<Button as={BUTTON_AS.LINK} to={ROUTES.ACTIVE.withId(activity._id)} variant='primary' fillWidth aria-label={`Xem chi tiết hoạt động ${activity.title}`}>
						Xem chi tiết
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
