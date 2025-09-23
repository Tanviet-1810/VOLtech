import React from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.scss';
import { ACTIVE_STATUS } from '../../../const/active-status';

export const BADGE_VARIANTS = {
	PRIMARY: 'primary',
	SECONDARY: 'secondary',
	ACCENT: 'accent',
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error',
	INFO: 'info',
	NEUTRAL: 'neutral',
};

export const BADGE_SIZES = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
};

export const STATUS_VARIANT_MAP = {
	[ACTIVE_STATUS.OPEN]: BADGE_VARIANTS.INFO,
	[ACTIVE_STATUS.COMPLETED]: BADGE_VARIANTS.SUCCESS,
	[ACTIVE_STATUS.CLOSED]: BADGE_VARIANTS.NEUTRAL,
	[ACTIVE_STATUS.CANCELLED]: BADGE_VARIANTS.ERROR,
};

export function Badge({ children, variant = BADGE_VARIANTS.PRIMARY, size = BADGE_SIZES.MEDIUM, status, outlined = false, className = '', ...props }) {
	const effectiveVariant = status ? STATUS_VARIANT_MAP[status] || variant : variant;

	const classes = [styles.badge, styles[effectiveVariant], styles[size], outlined ? styles.outlined : styles.filled, className].filter(Boolean).join(' ');

	return (
		<span className={classes} {...props}>
			{children}
		</span>
	);
}

Badge.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf(Object.values(BADGE_VARIANTS)),
	size: PropTypes.oneOf(Object.values(BADGE_SIZES)),
	status: PropTypes.oneOf(Object.values(ACTIVE_STATUS)),
	outlined: PropTypes.bool,
	className: PropTypes.string,
};

export default Badge;
