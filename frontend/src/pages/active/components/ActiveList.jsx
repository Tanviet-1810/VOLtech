import React from 'react';
import styles from './ActiveList.module.scss';
import ActiveCard from '../../../components/shared/card/active/ActiveCard';
import LoadingSection from '../../../components/shared/loading-section/LoadingSection';

export default function ActiveList({ activities, loading }) {
	if (loading) return <LoadingSection />;
	if (!activities.length) return <div className={styles.empty}>Không có hoạt động nào phù hợp.</div>;
	return (
		<div className={styles.grid}>
			{activities.map((activity) => (
				<ActiveCard key={activity._id} activity={activity} showCreator={true} />
			))}
		</div>
	);
}
