import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import AppSection from '../../components/shared/app-section/AppSection.jsx';
import LoadingSection from '../../components/shared/loading-section/LoadingSection.jsx';
import LoadingOverlay from '../../components/shared/loading-overlay/LoadingOverlay.jsx';
import ProfileHeader from './components/ProfileHeader/ProfileHeader.jsx';
import ProfileInfoCard from './components/ProfileInfoCard/ProfileInfoCard.jsx';
import ProfileActions from './components/ProfileActions/ProfileActions.jsx';
import { ROUTES } from '../../const/route.js';

export default function Profile() {
	const { user, loading: userLoading, logout } = useAuthContext();
	const navigate = useNavigate();
	const [logoutLoading, setLogoutLoading] = useState(false);
	const [logoutError, setLogoutError] = useState(null);

	const handleEdit = useCallback(() => {
		navigate(ROUTES.EDIT_PROFILE.path);
	}, [navigate]);

	const handleActiveManage = useCallback(() => {
		navigate(ROUTES.ACTIVE_MANAGE.path);
	}, [navigate]);

	const handleLogout = useCallback(async () => {
		setLogoutError(null);
		setLogoutLoading(true);

		try {
			await logout();
			setTimeout(() => navigate(ROUTES.HOME.path), 500);
		} catch (err) {
			console.error(err);
			setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.');
			setLogoutLoading(false);
		}
	}, [logout, navigate]);

	if (userLoading) {
		return <LoadingSection message='Đang tải thông tin...' />;
	}

	return (
		<>
			<LoadingOverlay isActive={logoutLoading} message='Đang đăng xuất...' />

			<AppSection className={styles.profileSection}>
				<div className={styles.profileContainer}>
					<ProfileHeader user={user} />

					<div className={styles.profileContent}>
						<ProfileInfoCard user={user} />

						<ProfileActions onProfileEdit={handleEdit} onActiveManage={handleActiveManage} onLogout={handleLogout} logoutLoading={logoutLoading} logoutError={logoutError} />
					</div>
				</div>
			</AppSection>
		</>
	);
}
