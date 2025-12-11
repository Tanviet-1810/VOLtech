import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = memo(({ message = 'Đang tải...', size = 'medium' }) => {
	return (
		<div className={styles.loadingContainer}>
			<div className={`${styles.spinner} ${styles[size]}`}></div>
			<p className='txt-secondary'>{message}</p>
		</div>
	);
});

LoadingSpinner.displayName = 'LoadingSpinner';

LoadingSpinner.propTypes = {
	message: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default LoadingSpinner;
