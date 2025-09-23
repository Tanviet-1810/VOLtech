import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActivityTable.module.scss';
import Button, { BUTTON_VARIANTS } from '../../../components/shared/button/Button';
import LoadingSpinner from '../../../components/shared/loading-spinner/LoadingSpinner';

function ActivityTable({ activities, loading, onEdit, onDelete, deleting }) {
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const getStatusText = (status) => {
		const statusMap = {
			open: 'Mở',
			closed: 'Đóng',
			completed: 'Hoàn thành',
			cancelled: 'Hủy',
		};
		return statusMap[status] || status;
	};

	const getStatusClass = (status) => {
		return styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`] || '';
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<LoadingSpinner message='Đang tải danh sách hoạt động...' />
			</div>
		);
	}

	if (!activities.length) {
		return (
			<div className={styles.emptyState}>
				<p>Chưa có hoạt động nào được tạo.</p>
			</div>
		);
	}

	return (
		<div className={styles.tableContainer}>
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Tiêu đề</th>
							<th>Ngày bắt đầu</th>
							<th>Ngày kết thúc</th>
							<th>Điểm</th>
							<th>Số lượng</th>
							<th>Trạng thái</th>
							<th>Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{activities.map((activity) => (
							<tr key={activity._id}>
								<td className={styles.titleCell}>
									<div className={styles.titleContent}>
										<h4 className={styles.title}>{activity.title}</h4>
										<p className={styles.location}>{activity.location}</p>
									</div>
								</td>
								<td>{formatDate(activity.startDate)}</td>
								<td>{formatDate(activity.endDate)}</td>
								<td className={styles.pointsCell}>{activity.points}</td>
								<td className={styles.participantsCell}>
									{activity.registeredUsers?.length || 0}/{activity.maxParticipants}
								</td>
								<td>
									<span className={`${styles.statusBadge} ${getStatusClass(activity.status)}`}>{getStatusText(activity.status)}</span>
								</td>
								<td>
									<div className={styles.actions}>
										<Button variant={BUTTON_VARIANTS.SECONDARY} onClick={() => onEdit(activity)} disabled={deleting}>
											Sửa
										</Button>
										<Button variant={BUTTON_VARIANTS.ACCENT} onClick={() => onDelete(activity._id)} disabled={deleting}>
											Xóa
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

ActivityTable.propTypes = {
	activities: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	deleting: PropTypes.bool.isRequired,
};

export default ActivityTable;
