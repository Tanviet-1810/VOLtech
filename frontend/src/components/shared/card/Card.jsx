import React from 'react';
import styles from './Card.module.scss';

export function Card({ children, className = '', ...props }) {
	return (
		<div className={`${styles.card} ${className}`} {...props}>
			{children}
		</div>
	);
}

export function CardContent({ children, className = '', ...props }) {
	return (
		<div className={`${styles.cardContent} ${className}`} {...props}>
			{children}
		</div>
	);
}
