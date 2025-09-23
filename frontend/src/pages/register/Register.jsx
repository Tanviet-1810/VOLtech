import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth-form/AuthForm.jsx';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import { ROUTES } from '../../const/route.js';

const fields = [
	{ name: 'name', label: 'Tên người dùng', type: 'text', placeholder: 'Nhập tên người dùng' },
	{ name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email' },
	{ name: 'birthDate', label: 'Ngày sinh', type: 'date', placeholder: 'Chọn ngày sinh' },
	{ name: 'unit', label: 'Đơn vị', type: 'text', placeholder: 'Nhập đơn vị' },
	{ name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: 'Nhập số điện thoại' },
	{ name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Nhập mật khẩu' },
	{ name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu' },
];

export default function Register() {
	const [values, setValues] = useState({
		name: '',
		email: '',
		birthDate: '',
		unit: '',
		phone: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { register, loading } = useAuthContext();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name, email, birthDate, unit, phone, password, confirmPassword } = values;

		const fieldErrors = {};
		let hasErrors = false;

		if (!name.trim()) {
			fieldErrors.name = 'Vui lòng nhập tên người dùng';
			hasErrors = true;
		}

		if (!email.trim()) {
			fieldErrors.email = 'Vui lòng nhập email';
			hasErrors = true;
		}

		if (!birthDate.trim()) {
			fieldErrors.birthDate = 'Vui lòng chọn ngày sinh';
			hasErrors = true;
		}

		if (!unit.trim()) {
			fieldErrors.unit = 'Vui lòng nhập đơn vị';
			hasErrors = true;
		}

		if (!phone.trim()) {
			fieldErrors.phone = 'Vui lòng nhập số điện thoại';
			hasErrors = true;
		}

		if (!password.trim()) {
			fieldErrors.password = 'Vui lòng nhập mật khẩu';
			hasErrors = true;
		}

		if (!confirmPassword.trim()) {
			fieldErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
			hasErrors = true;
		} else if (password !== confirmPassword) {
			fieldErrors.confirmPassword = 'Mật khẩu không khớp';
			hasErrors = true;
		}

		if (hasErrors) {
			setError(fieldErrors);
			return;
		}

		setError(null);
		const data = await register({ name, email, password, birthDate, unit, phone });

		if (data?.message) {
			navigate(ROUTES.LOGIN.path);
		} else {
			setError(data?.error || 'Đăng ký thất bại');
		}
	};

	return (
		<AuthForm title='Đăng kí' fields={fields} values={values} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitText='Đăng kí'>
			<p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--txt-secondary)', textAlign: 'center' }}>
				Đã có tài khoản?{' '}
				<Link to={ROUTES.LOGIN.path} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
					Đăng nhập
				</Link>
			</p>
		</AuthForm>
	);
}
