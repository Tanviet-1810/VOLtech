import React from 'react';
import styles from './AuthForm.module.scss';
import Input from '../input/Input';

const AuthForm = ({ title = '', fields = [], values = {}, onChange = () => {}, onSubmit = () => {}, loading = false, error = null, submitText = 'Xác nhận', children }) => {
	const isGeneralError = typeof error === 'string';
	const fieldErrors = !isGeneralError && error ? error : {};

	return (
		<div className={styles.card}>
			{title && <h1 className={styles.title}>{title}</h1>}
			<form className={styles.form} onSubmit={onSubmit}>
				{fields.map((f) => (
					<Input key={f.name} name={f.name} label={f.label} type={f.type} placeholder={f.placeholder} value={values[f.name] || ''} onChange={onChange} error={fieldErrors[f.name] || ''} {...f.inputProps} />
				))}

				{isGeneralError && error && <div className={styles.error}>{error}</div>}

				<button type='submit' disabled={loading} className={styles.submitBtn}>
					{loading ? 'Đang xử lý...' : submitText}
				</button>
			</form>
			{children}
		</div>
	);
};

export default AuthForm;
