import styles from './AppSection.module.scss';

export default function AppSection({ children, className = '', ...props }) {
	return (
		<section className={`${styles.section} ${className}`} {...props}>
			<div className={styles.container}>{children}</div>
		</section>
	);
}
