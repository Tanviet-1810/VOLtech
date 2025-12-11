import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './EditProfileForm.module.scss';
import { User, Mail, Calendar, Building, Phone } from 'lucide-react';
import Button, { BUTTON_VARIANTS } from '../../../../components/shared/button/Button.jsx';
import Input from '../../../../components/input/Input.jsx';

const EditProfileForm = memo(({ user, onSubmit, loading, error }) => {
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
		unit: user?.unit || '',
		phone: user?.phone || '',
	});

	const [validationErrors, setValidationErrors] = useState({});
	const ableToSubmit =
		JSON.stringify(formData) !==
		JSON.stringify({
			name: user?.name || '',
			email: user?.email || '',
			birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
			unit: user?.unit || '',
			phone: user?.phone || '',
		});

	const validateForm = useCallback(() => {
		const errors = {};

		if (!formData.name.trim()) {
			errors.name = 'Tên không được để trống';
		}

		if (!formData.email.trim()) {
			errors.email = 'Email không được để trống';
		}

		if (formData.phone && !formData.phone.trim()) {
			errors.phone = 'Số điện thoại không được để trống';
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [formData]);

	const handleChange = useCallback(
		(field) => (e) => {
			const value = e.target.value;
			setFormData((prev) => ({ ...prev, [field]: value }));
			if (validationErrors[field]) {
				setValidationErrors((prev) => ({ ...prev, [field]: '' }));
			}
		},
		[validationErrors]
	);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();
			if (ableToSubmit && validateForm()) {
				onSubmit(formData);
			}
		},
		[formData, validateForm, onSubmit]
	);

	const formFields = [
		{
			key: 'name',
			label: 'Tên',
			type: 'text',
			icon: <User size={16} />,
			required: true,
		},
		{
			key: 'email',
			label: 'Email',
			type: 'email',
			icon: <Mail size={16} />,
			required: true,
		},
		{
			key: 'birthDate',
			label: 'Ngày sinh',
			type: 'date',
			icon: <Calendar size={16} />,
		},
		{
			key: 'unit',
			label: 'Đơn vị',
			type: 'text',
			icon: <Building size={16} />,
		},
		{
			key: 'phone',
			label: 'Số điện thoại',
			type: 'tel',
			icon: <Phone size={16} />,
		},
	];

	return (
		<div className={styles.formCard}>
			<div className={styles.formHeader}>
				<h2 className={styles.formTitle}>Chỉnh sửa thông tin cá nhân</h2>
				<p className={styles.formSubtitle}>Cập nhật thông tin cá nhân của bạn</p>
			</div>

			{error && (
				<div className={styles.errorMessage}>
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.fieldsGrid}>
					{formFields.map((field) => (
						<div key={field.key} className={styles.fieldWrapper}>
							<div className={styles.fieldIcon}>{field.icon}</div>
							<Input
								name={field.key}
								label={field.label + (field.required ? ' *' : '')}
								type={field.type}
								placeholder={`Nhập ${field.label.toLowerCase()}`}
								value={formData[field.key]}
								onChange={handleChange(field.key)}
								error={validationErrors[field.key]}
								required={field.required}
							/>
						</div>
					))}
				</div>

				<div className={styles.formActions}>
					<Button type='button' variant={BUTTON_VARIANTS.SECONDARY} outlined onClick={() => window.history.back()} disabled={loading}>
						Hủy
					</Button>
					<Button type='submit' variant={BUTTON_VARIANTS.ACCENT} disabled={loading || !ableToSubmit}>
						{loading ? 'Đang lưu...' : 'Lưu thay đổi'}
					</Button>
				</div>
			</form>
		</div>
	);
});

EditProfileForm.displayName = 'EditProfileForm';

EditProfileForm.propTypes = {
	user: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.string,
};

export default EditProfileForm;
