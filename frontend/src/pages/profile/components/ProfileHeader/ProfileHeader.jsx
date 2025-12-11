import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './ProfileHeader.module.scss';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.png';
import { highestRole, USER_ROLE_VIETNAMESE } from '../../../../const/user-role';
// import Button, { BUTTON_VARIANTS } from '../../../../components/shared/button/Button.jsx';
// import { ROUTES } from '../../../../const/route.js';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';



const ProfileHeader = memo(({ user }) => {
	// const navigate = useNavigate();
	// const location = useLocation();

	// const handleBack = () => {
	// const pathname = location.pathname;

	// if (
	// 	pathname === ROUTES.PROFILE.path &&
	// 	location.state?.from === ROUTES.EDIT_PROFILE.path &&
	// 	location.state?.rootFrom
	// ) {
	// 	navigate(location.state.rootFrom); 
	// 	return;
	// }

	// if (location.state?.rootFrom) {
	// 	navigate(location.state.rootFrom);
	// } else if (location.state?.from) {
	// 	navigate(location.state.from);
	// } else {
	// 	navigate(ROUTES.HOME.path);
	// }
	// };
	return (
		<div className={styles.profileHeader}>
			<div className={styles.avatarSection}>
				<img src={user?.avatar || AvatarPlaceholder} alt='Avatar' className={styles.avatar} />
				<div className={styles.userBasicInfo}>
					<h1 className={styles.userName}>{user?.name || 'Người dùng'}</h1>
					<p className={styles.userRole}>{USER_ROLE_VIETNAMESE[highestRole(user?.role)]}</p>
				</div>
				{/* <Button variant={BUTTON_VARIANTS.SECONDARY} outlined onClick={handleBack} icon={<ArrowLeft size={16} />} className={styles.backButton}>
					Quay lại
				</Button> */}
			</div>
		</div>
	);
});

ProfileHeader.displayName = 'ProfileHeader';

ProfileHeader.propTypes = {
	user: PropTypes.object,
};

export default ProfileHeader;
