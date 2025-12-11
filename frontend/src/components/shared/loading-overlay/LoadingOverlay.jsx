import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingOverlay.module.scss';
import LoadingSpinner from '../loading-spinner/LoadingSpinner.jsx';

const LoadingOverlay = memo(({ isActive, message = 'Đang xử lý...' }) => {
	return (
		<div className={`${styles.overlay} ${isActive ? styles.active : ''}`}>
			<LoadingSpinner message={message} size='large' />
		</div>
	);
});

LoadingOverlay.displayName = 'LoadingOverlay';

LoadingOverlay.propTypes = {
	isActive: PropTypes.bool.isRequired,
	message: PropTypes.string,
};

export default LoadingOverlay;
