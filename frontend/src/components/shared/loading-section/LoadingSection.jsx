import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSection.module.scss';
import AppSection from '../app-section/AppSection.jsx';
import LoadingSpinner from '../loading-spinner/LoadingSpinner.jsx';

const LoadingSection = memo(({ message = 'Đang tải...', className = '' }) => {
	return (
		<AppSection className={`${styles.loadingSection} ${className}`}>
			<LoadingSpinner message={message} />
		</AppSection>
	);
});

LoadingSection.displayName = 'LoadingSection';

LoadingSection.propTypes = {
	message: PropTypes.string,
	className: PropTypes.string,
};

export default LoadingSection;
