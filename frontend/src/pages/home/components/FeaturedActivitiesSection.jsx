import { useEffect, useState } from 'react';
import { getList } from '../../../services/api/v1/active-api.service';
import { ROUTES } from '../../../const/route.js';
import AppSection from '../../../components/shared/app-section/AppSection';
import LoadingSection from '../../../components/shared/loading-section/LoadingSection.jsx';
import ActiveCard from '../../../components/shared/card/active/ActiveCard';
import styles from './FeaturedActivitiesSection.module.scss';

export function FeaturedActivitiesSection() {
	const [actives, setActives] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActives = async () => {
			setLoading(true);
			try {
				const res = await getList({ limit: 3, sortBy: 'points', sortOrder: 'desc' });
				const { items } = await res.json();
				if (res.ok) setActives(items);
				else {
					setActives([]);
				}
			} catch (error) {
				setActives([]);
			} finally {
				setLoading(false);
			}
		};
		fetchActives();
	}, []);

	if (loading) {
		return <LoadingSection message='Đang tải hoạt động nổi bật...' />;
	}

	return (
		<AppSection className={styles.featuredSection}>
			<div className={styles.header + ' fade-bottom-to-top'}>
				<h2 className={styles.title}>Hoạt động nổi bật</h2>
				<p className={styles.subtitle}>Tham gia các hoạt động thiện nguyện ý nghĩa và nhận điểm thưởng cho những đóng góp của bạn</p>
			</div>
			<div className={styles.grid}>
				{actives.map((activity, index) => (
					<ActiveCard key={activity._id} activity={activity} className={`${styles.card} fade-in`} style={{ animationDelay: `${index * 0.2}s` }} />
				))}
			</div>
		</AppSection>
	);
}

export default FeaturedActivitiesSection;
