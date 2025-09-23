import { ArrowRight, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.scss';
import { ROUTES } from '../../../const/route.js';
import Button, { BUTTON_AS, BUTTON_VARIANTS } from '../../../components/shared/button/Button';
import AppSection from '../../../components/shared/app-section/AppSection';

export function HeroSection() {
	return (
		<AppSection className={styles.heroSection}>
			<div className={styles.content}>
				{/* Text */}
				<div className={styles.textBlock}>
					<h1 className={styles.title}>
						Kết nối trái tim <br />
						<span className={styles.accent}>thiện nguyện</span>
					</h1>
					<p className={styles.subtitle}>Tham gia cộng đồng tình nguyện viên, góp phần xây dựng xã hội tốt đẹp và tạo ra những giá trị tích cực cho cuộc sống</p>
				</div>

				{/* Buttons */}
				<div className={styles.actions}>
					<Button as={BUTTON_AS.LINK} to={ROUTES.ACTIVE.path} variant={BUTTON_VARIANTS.ACCENT} icon={<ArrowRight />}>
						Khám phá hoạt động
					</Button>
					<Button as={BUTTON_AS.LINK} to={ROUTES.ABOUT.path} variant={BUTTON_VARIANTS.SECONDARY}>
						Tìm hiểu thêm
					</Button>
				</div>

				{/* Stats */}
				<div className={styles.stats}>
					<div className={styles.statItem}>
						<div className={styles.iconWrapper}>
							<Users className={styles.iconStat} />
						</div>
						<div>
							<div className={styles.statNumber}>5,000+</div>
							<div className={styles.statLabel}>Tình nguyện viên</div>
						</div>
					</div>
					<div className={styles.statItem}>
						<div className={styles.iconWrapper}>
							<Heart className={styles.iconStat} />
						</div>
						<div>
							<div className={styles.statNumber}>1,200+</div>
							<div className={styles.statLabel}>Hoạt động</div>
						</div>
					</div>
				</div>
			</div>
		</AppSection>
	);
}
