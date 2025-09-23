import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

export const BUTTON_VARIANTS = {
	PRIMARY: 'primary',
	SECONDARY: 'secondary',
	ACCENT: 'accent',
};

export const BUTTON_AS = {
	BUTTON: 'button',
	LINK: 'a',
};

function Button({ children, variant = BUTTON_VARIANTS.PRIMARY, outlined = false, fillWidth = false, disabled = false, icon, className = '', as = BUTTON_AS.BUTTON, ...props }) {
	const classes = [styles.btn, styles[variant], outlined ? styles.outlined : styles.filled, disabled ? styles.disabled : '', fillWidth ? styles.fillWidth : '', className].join(' ');

	const content = (
		<>
			{icon && <span className={styles.icon}>{icon}</span>}
			<span>{children}</span>
		</>
	);

	if (as === 'a') {
		return (
			<Link className={classes} aria-disabled={disabled} {...props}>
				{content}
			</Link>
		);
	}
	return (
		<button className={classes} disabled={disabled} {...props}>
			{content}
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
	outlined: PropTypes.bool,
	disabled: PropTypes.bool,
	icon: PropTypes.element,
	className: PropTypes.string,
	as: PropTypes.oneOf(Object.values(BUTTON_AS)),
};

export default Button;
