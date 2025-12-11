import { useEffect, useState, useRef } from 'react';
import { ChevronRight, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getList } from '../../../services/api/v1/active-api.service';
import { ROUTES } from '../../../const/route.js';
import styles from './ActivityNotificationBanner.module.scss';

export function ActivityNotificationBanner() {
	const [activities, setActivities] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [touchStart, setTouchStart] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
	const navigate = useNavigate();
	const carouselRef = useRef(null);
	const autoplayRef = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const res = await getList({ limit: 5, sortBy: 'points', sortOrder: 'desc' });
				const { items } = await res.json();
				if (res.ok && items.length > 0) {
					setActivities(items);
					setIsVisible(true);
				}
			} catch (error) {
				console.error('Lỗi tải hoạt động:', error);
			}
		};
		fetchActivities();
	}, []);

	useEffect(() => {
		if (activities.length === 0 || isDragging) return;

		autoplayRef.current = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % activities.length);
		}, 5000);

		return () => clearInterval(autoplayRef.current);
	}, [activities.length, isDragging]);

	if (!isVisible || activities.length === 0) return null;

	const currentActivity = activities[currentIndex];

	const handleClose = (e) => {
		e.stopPropagation();
		setIsVisible(false);
	};

	const handleNext = (e) => {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev + 1) % activities.length);
	};

	const handleNavigateToDetail = (e) => {
		e.stopPropagation();
		navigate(ROUTES.ACTIVE.withId(currentActivity._id));
	};

	const handleBannerClick = () => {
		if (!isDragging && Math.abs(dragOffset) < 10) {
			navigate(ROUTES.ACTIVE.withId(currentActivity._id));
		}
	};

	const handleTouchStart = (e) => {
		setIsDragging(true);
		setTouchStart(e.targetTouches[0].clientX);
		setDragOffset(0);
	};

	const handleTouchMove = (e) => {
		if (!isDragging) return;
		const currentTouch = e.targetTouches[0].clientX;
		setDragOffset(currentTouch - touchStart);
	};

	const handleTouchEnd = () => {
		setIsDragging(false);

		const threshold = 50;
		if (dragOffset > threshold) {
			setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
		} else if (dragOffset < -threshold) {
			setCurrentIndex((prev) => (prev + 1) % activities.length);
		}
		setDragOffset(0);
	};

	const getItemStyle = (index) => {
		if (isMobile) {
			if (index === currentIndex) {
				return {
					position: 'relative',
					left: 'auto',
					top: 'auto',
					transform: 'translateX(0)',
					opacity: 1,
					transition: 'opacity 0.3s ease',
					pointerEvents: 'auto',
				};
			}
			return {
				display: 'none',
				pointerEvents: 'none',
			};
		}

		let position = index - currentIndex;
		let offset = position * 100 + (isDragging ? (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100 : 0);

		return {
			transform: `translateX(${offset}%)`,
			opacity: Math.abs(position) > 0.5 ? 0 : 1,
			transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			pointerEvents: index === currentIndex ? 'auto' : 'none',
		};
	};

	return (
		<div
			ref={carouselRef}
			className={styles.carouselContainer}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			<div className={styles.carouselTrack}>
				{activities.map((activity, index) => (
					<div
						key={activity._id}
						className={styles.carouselItem}
						style={getItemStyle(index)}
						onClick={handleBannerClick}
						role='button'
						tabIndex={0}
					>
						<div className={styles.banner}>
							<div className={styles.content}>
								<div className={styles.imageContainer}>
									<img
										src={activity.images?.[0] || 'https://via.placeholder.com/150?text=No+Image'}
										alt={activity.title}
										className={styles.activityImage}
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/150?text=No+Image';
										}}
										draggable={false}
									/>
								</div>
								<div className={styles.activityInfo}>
									<h3 className={styles.title}>{activity.title}</h3>
									<p className={styles.description}>{activity.description?.substring(0, 60)}...</p>
								</div>
								<div className={styles.points}>
									<span className={styles.pointsLabel}>Điểm:</span>
									<span className={styles.pointsValue}>{activity.points || 0}</span>
								</div>
							</div>

							<div className={styles.actions}>
								<button
									className={styles.detailBtn}
									onClick={(e) => {
										e.stopPropagation();
										navigate(ROUTES.ACTIVE.withId(activity._id));
									}}
									title='Xem chi tiết hoạt động'
									type='button'
								>
									<ArrowRight size={20} />
									<span className={styles.btnText}>Chi tiết</span>
								</button>
								<button
									className={styles.nextBtn}
									onClick={(e) => {
										e.stopPropagation();
										handleNext(e);
									}}
									title='Xem hoạt động tiếp theo'
									type='button'
								>
									<ChevronRight size={20} />
								</button>
								{index === currentIndex && (
									<button
										className={styles.closeBtn}
										onClick={(e) => handleClose(e)}
										title='Đóng thông báo'
										type='button'
									>
										<X size={20} />
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className={styles.indicators}>
				{activities.map((_, index) => (
					<div
						key={index}
						className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							setCurrentIndex(index);
						}}
						role='button'
						tabIndex={0}
						title={`Xem hoạt động ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
