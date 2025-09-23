import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './ProfileActions.module.scss';
import Button, { BUTTON_VARIANTS } from '../../../../components/shared/button/Button.jsx';
import { USER_ROLE, highestRole } from '../../../../const/user-role.js';
import useAuthContext from '../../../../contexts/auth/useAuthContext.jsx';

const ProfileActions = memo(({ onProfileEdit, onActiveManage, onLogout, logoutLoading, logoutError }) => {
	const { user } = useAuthContext();
	const minRoleIsEditor = user && [USER_ROLE.ADMIN, USER_ROLE.MODERATOR].includes(highestRole(user.role));

	return (
		<>
			{logoutError && (
				<div className={styles.errorMessage}>
					<span>{logoutError}</span>
				</div>
			)}

			<div className={styles.actions}>
				{minRoleIsEditor && (
					<Button variant={BUTTON_VARIANTS.SECONDARY} onClick={onActiveManage} className={styles.activeBtn}>
						Quản lý hoạt động
					</Button>
				)}
				<Button variant={BUTTON_VARIANTS.PRIMARY} outlined onClick={onProfileEdit} className={styles.editBtn}>
					Chỉnh sửa thông tin
				</Button>
				<Button variant={BUTTON_VARIANTS.ACCENT} onClick={onLogout} disabled={logoutLoading} className={styles.logoutBtn}>
					{logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
				</Button>
			</div>
		</>
	);
});

ProfileActions.propTypes = {
	onProfileEdit: PropTypes.func.isRequired,
	onActiveManage: PropTypes.func,
	onLogout: PropTypes.func.isRequired,
	logoutLoading: PropTypes.bool,
	logoutError: PropTypes.string,
};

export default ProfileActions;
