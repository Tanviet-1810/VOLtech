import { ArrowRight, Heart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './HeroSection.module.scss';
import { ROUTES } from '../../../const/route.js';
import Button, { BUTTON_AS, BUTTON_VARIANTS } from '../../../components/shared/button/Button';
import AppSection from '../../../components/shared/app-section/AppSection';
import { getOverallStatistics } from '../../../services/api/v1/statistics-api.service';

export function HeroSection() {
	const [statistics, setStatistics] = useState({
		totalUsers: 0,
		totalActivities: 0,
	});

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				const response = await getOverallStatistics();
				const data = await response.json();
				if (data) {
					setStatistics(data);
				}
			} catch (error) {
				console.error('Error fetching statistics:', error);
			}
		};

		fetchStatistics();
	}, []);

	return (
		<AppSection className={styles.heroSection}>
			<div className={styles.content}>
				<div className={styles.textBlock}>
					<h1 className={styles.title}>
						Kết nối trái tim <br />
						<span className={styles.accent}>thiện nguyện</span>
					</h1>
					<p className={styles.subtitle}>Tham gia cộng đồng tình nguyện viên, góp phần xây dựng xã hội tốt đẹp và tạo ra những giá trị tích cực cho cuộc sống</p>
				</div>

				<div className={styles.actions}>
					<Button as={BUTTON_AS.LINK} to={ROUTES.ACTIVE.path} variant={BUTTON_VARIANTS.ACCENT} icon={<ArrowRight />}>
						Khám phá hoạt động
					</Button>
					<Button as={BUTTON_AS.LINK} to={ROUTES.ABOUT.path} variant={BUTTON_VARIANTS.SECONDARY}>
						Tìm hiểu thêm
					</Button>
				</div>

				<div className={styles.stats}>
					<div className={styles.statItem}>
						<div className={styles.iconWrapper}>
							<Users className={styles.iconStat} />
						</div>
						<div>
							<div className={styles.statNumber}>{statistics.totalUsers.toLocaleString('vi-VN')}+</div>
							<div className={styles.statLabel}>Tình nguyện viên</div>
						</div>
					</div>
					<div className={styles.statItem}>
						<div className={styles.iconWrapper}>
							<Heart className={styles.iconStat} />
						</div>
						<div>
							<div className={styles.statNumber}>{statistics.totalActivities.toLocaleString('vi-VN')}+</div>
							<div className={styles.statLabel}>Hoạt động</div>
						</div>
					</div>
				</div>
			</div>
		</AppSection>
	);
}
