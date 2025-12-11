import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, BADGE_SIZES, BADGE_VARIANTS } from '../../../components/shared/badge/Badge';
import Button, { BUTTON_VARIANTS } from '../../../components/shared/button/Button';
import { getParticipants, toggleParticipantScore } from '../../../services/api/v1/active-api.service';
import styles from './ParticipantsList.module.scss';

function ParticipantsList({ activityId }) {
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [activityPoints, setActivityPoints] = useState(0);
	const [toggleLoading, setToggleLoading] = useState({});
	const ITEMS_PER_PAGE = 10;

	useEffect(() => {
		const fetchParticipants = async () => {
			if (!activityId) return;

			setLoading(true);
			try {
				const res = await getParticipants(activityId, currentPage, ITEMS_PER_PAGE);
				if (res.ok) {
					const result = await res.json();
					setParticipants(result.items || []);
					setTotalPages(result.paginate?.totalPages || 1);
					setTotalItems(result.paginate?.totalItems || 0);
					setActivityPoints(result.activityPoints || 0);
				}
			} catch (error) {
				console.error('Error fetching participants:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchParticipants();
	}, [activityId, currentPage]);

	const handleToggleScore = async (userId) => {
		setToggleLoading((prev) => ({ ...prev, [userId]: true }));
		try {
			const res = await toggleParticipantScore(activityId, userId);
			if (res.ok) {
				const result = await res.json();
				// Cập nhật lại danh sách participants
				setParticipants((prevParticipants) =>
					prevParticipants.map((p) =>
						p.user._id === userId ? { ...p, isApplied: result.isApplied, user: { ...p.user, score: p.user.score + result.pointsChange } } : p
					)
				);
			}
		} catch (error) {
			console.error('Error toggling score:', error);
		} finally {
			setToggleLoading((prev) => ({ ...prev, [userId]: false }));
		}
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	if (!activityId) {
		return (
			<div className={styles.participantsSection}>
				<div className={styles.notice}>Vui lòng lưu hoạt động trước để xem danh sách thành viên</div>
			</div>
		);
	}

	return (
		<div className={styles.participantsSection}>
			<h3 className={styles.participantsTitle}>
				<Users size={24} />
				Danh sách thành viên tham gia ({totalItems})
			</h3>

			{loading ? (
				<div className={styles.loading}>Đang tải danh sách...</div>
			) : participants.length === 0 ? (
				<div className={styles.noParticipants}>Chưa có thành viên nào đăng ký</div>
			) : (
				<>
					<div className={styles.tableWrapper}>
						<table className={styles.participantsTable}>
							<thead>
								<tr>
									<th>STT</th>
									<th>Thành viên</th>
									<th>Email</th>
									<th>Điểm hiện tại</th>
									<th>Hoàn thành tham gia</th>
								</tr>
							</thead>
							<tbody>
								{participants.map((participant, idx) => (
									<tr key={participant.user?._id || idx}>
										<td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
										<td>
											<div className={styles.userCell}>
												<div className={styles.participantAvatar}>
													{participant.user?.avatar ? (
														<img src={participant.user.avatar} alt={participant.user.name} />
													) : (
														<div className={styles.avatarPlaceholder}>{participant.user?.name?.charAt(0).toUpperCase() || '?'}</div>
													)}
												</div>
												<span className={styles.userName}>{participant.user?.name || 'Người dùng'}</span>
											</div>
										</td>
										<td>{participant.user?.email || ''}</td>
										<td>
											<div className={styles.scoreCell}>
												<Award size={16} />
												<span>{participant.user?.score || 0}</span>
											</div>
										</td>
										<td>
											<div className={styles.checkboxCell}>
												<input
													type='checkbox'
													checked={participant.isApplied}
													onChange={() => handleToggleScore(participant.user._id)}
													disabled={toggleLoading[participant.user._id]}
													className={styles.checkbox}
												/>
												{participant.isApplied && (
													<Badge size={BADGE_SIZES.SMALL} variant={BADGE_VARIANTS.SUCCESS}>
														+{activityPoints} điểm
													</Badge>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className={styles.pagination}>
							<Button variant={BUTTON_VARIANTS.SECONDARY} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
								<ChevronLeft size={20} />
								Trước
							</Button>
							<div className={styles.pageInfo}>
								Trang {currentPage} / {totalPages}
							</div>
							<Button variant={BUTTON_VARIANTS.SECONDARY} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
								Sau
								<ChevronRight size={20} />
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

ParticipantsList.propTypes = {
	activityId: PropTypes.string,
};

export default ParticipantsList;
