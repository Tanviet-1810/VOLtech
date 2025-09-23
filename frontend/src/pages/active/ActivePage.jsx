import React from 'react';
import styles from './ActivePage.module.scss';
import AppSection from '../../components/shared/app-section/AppSection';
import ActivesContextProvider from '../../contexts/actives-page/ActivesContextProvider';
import useActivesContext from '../../contexts/actives-page/useActivesContext';
import ActiveList from './components/ActiveList';
import ActiveFilter from './components/ActiveFilter';
import ActivePagination from './components/ActivePagination';

function ActivePageContent() {
	const { activities, loading } = useActivesContext();

	return (
		<AppSection className={styles.activeSection}>
			<div className={styles.header}>
				<h1 className={styles.title}>Danh sách hoạt động thiện nguyện</h1>
				<p className={styles.subtitle}>Khám phá, lọc và tham gia các hoạt động phù hợp với bạn</p>
			</div>
			<ActiveFilter />
			<ActiveList activities={activities} loading={loading} />
			<ActivePagination />
		</AppSection>
	);
}

export default function ActivePage() {
	return (
		<ActivesContextProvider>
			<ActivePageContent />
		</ActivesContextProvider>
	);
}
