import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfilePage.module.scss';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import AppSection from '../../components/shared/app-section/AppSection.jsx';
import LoadingSection from '../../components/shared/loading-section/LoadingSection.jsx';
import LoadingOverlay from '../../components/shared/loading-overlay/LoadingOverlay.jsx';
import EditProfileHeader from './components/EditProfileHeader/EditProfileHeader.jsx';
import EditProfileForm from './components/EditProfileForm/EditProfileForm.jsx';
import { updateProfile } from '../../services/api/v1/user-api.service.js';
import { ROUTES } from '../../const/route.js';

export default function EditProfilePage() {
	const { user, loading: userLoading, setUser } = useAuthContext();
	const navigate = useNavigate();
	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState(null);

	const handleBack = useCallback(() => {
		navigate(ROUTES.PROFILE.path);
	}, [navigate]);

	const handleSubmit = useCallback(
		async (formData) => {
			if (!user?._id) return;

			setUpdateError(null);
			setUpdateLoading(true);

			try {
				const response = await updateProfile(user._id, formData);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
				}

				const updatedUser = await response.json();
				setUser(updatedUser);

				setTimeout(() => {
					navigate(ROUTES.PROFILE.path);
				}, 1000);
			} catch (err) {
				console.error('Update profile error:', err);
				setUpdateError(err.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
			} finally {
				setUpdateLoading(false);
			}
		},
		[user?._id, setUser, navigate]
	);

	if (userLoading) {
		return <LoadingSection message='Đang tải thông tin...' />;
	}

	if (!user) {
		navigate(ROUTES.LOGIN.path);
		return null;
	}

	return (
		<>
			<LoadingOverlay isActive={updateLoading} message='Đang cập nhật thông tin...' />

			<AppSection className={styles.editProfileSection}>
				<div className={styles.editProfileContainer}>
					<EditProfileHeader user={user} onBack={handleBack} />

					<div className={styles.editProfileContent}>
						<EditProfileForm user={user} onSubmit={handleSubmit} loading={updateLoading} error={updateError} />
					</div>
				</div>
			</AppSection>
		</>
	);
}
