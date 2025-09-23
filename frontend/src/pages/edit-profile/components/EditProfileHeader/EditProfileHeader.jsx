import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './EditProfileHeader.module.scss';
import { Edit3, ArrowLeft } from 'lucide-react';
import Button, { BUTTON_VARIANTS } from '../../../../components/shared/button/Button.jsx';

const EditProfileHeader = memo(({ user, onBack }) => {
	return (
		<div className={styles.header}>
			<div className={styles.headerContent}>
				<Button variant={BUTTON_VARIANTS.SECONDARY} outlined onClick={onBack} icon={<ArrowLeft size={16} />} className={styles.backButton}>
					Quay lại
				</Button>

				<div className={styles.headerInfo}>
					<div className={styles.iconWrapper}>
						<Edit3 size={20} />
					</div>
					<div className={styles.textContent}>
						<h1 className={styles.title}>Chỉnh sửa thông tin</h1>
						<p className={styles.subtitle}>Cập nhật thông tin cá nhân của {user?.name || 'bạn'}</p>
					</div>
				</div>
			</div>
		</div>
	);
});

EditProfileHeader.displayName = 'EditProfileHeader';

EditProfileHeader.propTypes = {
	user: PropTypes.object,
	onBack: PropTypes.func.isRequired,
};

export default EditProfileHeader;
