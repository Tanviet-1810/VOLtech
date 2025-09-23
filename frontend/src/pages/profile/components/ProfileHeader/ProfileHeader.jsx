import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './ProfileHeader.module.scss';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.png';
import { highestRole, USER_ROLE_VIETNAMESE } from '../../../../const/user-role';

const ProfileHeader = memo(({ user }) => {
	return (
		<div className={styles.profileHeader}>
			<div className={styles.avatarSection}>
				<img src={user?.avatar || AvatarPlaceholder} alt='Avatar' className={styles.avatar} />
				<div className={styles.userBasicInfo}>
					<h1 className={styles.userName}>{user?.name || 'Người dùng'}</h1>
					<p className={styles.userRole}>{USER_ROLE_VIETNAMESE[highestRole(user?.role)]}</p>
				</div>
			</div>
		</div>
	);
});

ProfileHeader.displayName = 'ProfileHeader';

ProfileHeader.propTypes = {
	user: PropTypes.object,
};

export default ProfileHeader;
