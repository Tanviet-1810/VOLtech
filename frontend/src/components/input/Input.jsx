import React, { useMemo } from 'react';
import styles from './Input.module.scss';

function Input({ name = 'Name', label = 'Label', type = 'text', placeholder = 'Placeholder', value, onChange, error = null, ...rest }) {
	const id = useMemo(() => `${label}-${placeholder}-${name}`, [label, placeholder, name]);

	return (
		<div className={`${styles.container} ${error ? styles.inputError : ''}`}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>
			<label className={`${styles.input}`} htmlFor={id}>
				<input type={type} placeholder={placeholder} id={id} name={name} value={value} onChange={onChange} {...(type === 'date' ? { pattern: '\\d{4}-\\d{2}-\\d{2}' } : {})} {...rest} />
			</label>
			<span className={styles.error}>{error}</span>
		</div>
	);
}

export default Input;

//****** */
