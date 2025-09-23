import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MapPin, CalendarClock, Users, Home, Award, MapPinHouse } from 'lucide-react';

import AppSection from '../../components/shared/app-section/AppSection';
import LoadingSection from '../../components/shared/loading-section/LoadingSection.jsx';
import Button, { BUTTON_VARIANTS } from '../../components/shared/button/Button';
import { Badge, BADGE_SIZES, BADGE_VARIANTS } from '../../components/shared/badge/Badge';
import useAuthContext from '../../contexts/auth/useAuthContext';
import { getDetail, joinActive, leaveActive } from '../../services/api/v1/active-api.service';
import { ACTIVE_STATUS, ACTIVE_STATUS_VIETNAMESE } from '../../const/active-status';
import styles from './ActiveDetailPage.module.scss';

function formatDateRange(start, end) {
	const opts = {
		hour: '2-digit',
		minute: '2-digit',

		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	};
	const startDate = new Date(start).toLocaleString('vi-VN', opts);
	const endDate = new Date(end).toLocaleString('vi-VN', opts);
	return `${startDate} - ${endDate}`;
}

function isFull(activity) {
	return (activity.registeredUsers?.length || 0) >= activity.maxParticipants;
}

export default function ActiveDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { isAuth, user } = useAuthContext();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [actionLoading, setActionLoading] = useState(false);

	const isJoined = isAuth && user && data?.registeredUsers?.includes(user._id);
	const isFilled = data && isFull(data);
	const canRegister = data?.status === ACTIVE_STATUS.OPEN && (!isFilled || isJoined);
	const buttonDisabled = !canRegister || actionLoading;

	useEffect(() => {
		const fetchDetail = async () => {
			setLoading(true);
			try {
				const res = await getDetail(id);
				if (res.ok) {
					const detail = await res.json();
					setData(detail);
					setError('');
				} else {
					setError('Không tìm thấy hoạt động');
					setData(null);
				}
			} catch {
				setError('Đã xảy ra lỗi khi tải dữ liệu');
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchDetail();
	}, [id]);

	const handleJoinClick = async () => {
		if (!isAuth) {
			navigate('/login');
			return;
		}

		setActionLoading(true);
		try {
			const res = isJoined ? await leaveActive(id) : await joinActive(id);
			if (res.ok) {
				setData((prevData) => ({
					...prevData,
					registeredUsers: isJoined ? prevData.registeredUsers.filter((uid) => uid !== user._id) : [...prevData.registeredUsers, user._id],
				}));
			}
		} catch (error) {
			console.error('Error handling join/leave:', error);
		} finally {
			setActionLoading(false);
		}
	};

	const getButtonText = () => {
		if (data?.status === ACTIVE_STATUS.OPEN) {
			if (isFilled && !isJoined) {
				return 'Đã đầy';
			}
			return isJoined ? 'Hủy đăng ký' : 'Đăng ký tham gia';
		}
		return ACTIVE_STATUS_VIETNAMESE[data.status] || 'Không thể đăng ký';
	};

	if (loading) {
		return <LoadingSection message='Đang tải thông tin hoạt động...' />;
	}

	if (error) {
		return (
			<AppSection>
				<div className={styles.error}>{error}</div>
			</AppSection>
		);
	}

	if (!data) return null;

	return (
		<AppSection className={styles.detailSection}>
			<div className={styles.mainContent}>
				<div className={styles.left}>
					<div className='markdown'>
						<ReactMarkdown>{data.description}</ReactMarkdown>
					</div>
					<div className={styles.gallery}>
						{data.images?.length > 0 ? (
							data.images.map((img, idx) => <img key={idx} src={img} alt={`Ảnh hoạt động ${idx + 1}`} className={styles.galleryImg} loading='lazy' />)
						) : (
							<div className={styles.noImage}>Không có ảnh</div>
						)}
					</div>
				</div>

				<aside className={styles.sidebar}>
					<div className={`${styles.sidebarHeader}`}>
						<Badge
							status={data.status}
							size={BADGE_SIZES.MEDIUM}
							variant={
								data.status.trim() === ACTIVE_STATUS.OPEN
									? BADGE_VARIANTS.ACCENT
									: data.status === ACTIVE_STATUS.COMPLETED
									? BADGE_VARIANTS.SUCCESS
									: data.status === ACTIVE_STATUS.CLOSED
									? BADGE_VARIANTS.NEUTRAL
									: data.status === ACTIVE_STATUS.CANCELLED
									? BADGE_VARIANTS.ERROR
									: BADGE_VARIANTS.PRIMARY
							}
						>
							{ACTIVE_STATUS_VIETNAMESE[data.status] || data.status}
						</Badge>
						<div className={styles.sidebarScores}>
							<Award size={20} className={styles.iconSidebar} />
							<span className={styles.points}>{data.points} điểm</span>
						</div>
						{isFilled && (
							<Badge size={BADGE_SIZES.MEDIUM} variant={BADGE_VARIANTS.ERROR}>
								Đã đầy
							</Badge>
						)}
					</div>

					<div className={styles.sidebarSection}>
						<Users size={20} className={styles.iconSidebar} />
						<span>
							{data.registeredUsers?.length || 0}/{data.maxParticipants} người
							{isFilled && <span className={styles.fullLabel}> (Đã đầy)</span>}
						</span>
					</div>

					<div className={styles.sidebarSection}>
						<MapPinHouse size={20} className={styles.iconSidebar} />
						<span>{data.location}</span>
					</div>

					<div className={styles.sidebarSection}>
						<CalendarClock size={20} className={styles.iconSidebar} />
						<span>{formatDateRange(data.startDate, data.endDate)}</span>
					</div>

					{data.commune && (
						<div className={styles.sidebarSection}>
							<Home size={20} className={styles.iconSidebar} />
							<span>{data.commune.name}</span>
						</div>
					)}

					<div className={styles.actions}>
						<Button variant={canRegister && isJoined ? BUTTON_VARIANTS.SECONDARY : BUTTON_VARIANTS.ACCENT} fillWidth disabled={buttonDisabled} onClick={handleJoinClick} outlined={canRegister && isJoined}>
							{getButtonText()}
						</Button>
					</div>
				</aside>
			</div>
		</AppSection>
	);
}
