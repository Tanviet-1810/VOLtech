import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth-form/AuthForm.jsx';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import { ROUTES } from '../../const/route.js';

const fields = [
	{ name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email' },
	{ name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Nhập mật khẩu' },
];

export default function Login() {
	const [values, setValues] = useState({ email: '', password: '' });
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { login, loading } = useAuthContext();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const fieldErrors = {};
		let hasErrors = false;

		if (!values.email.trim()) {
			fieldErrors.email = 'Vui lòng nhập email';
			hasErrors = true;
		}

		if (!values.password.trim()) {
			fieldErrors.password = 'Vui lòng nhập mật khẩu';
			hasErrors = true;
		}

		if (hasErrors) {
			setError(fieldErrors);
			return;
		}

		setError(null);
		const data = await login(values.email, values.password);

		if (data?.error) {
			setError(data.error || 'Đăng nhập thất bại');
		} else {
			navigate(ROUTES.HOME.path);
		}
	};

	return (
		<AuthForm title='Đăng nhập' fields={fields} values={values} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitText='Đăng nhập'>
			<p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--txt-secondary)', textAlign: 'center' }}>
				Chưa có tài khoản?
				<Link to={ROUTES.REGISTER.path} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
					Đăng ký
				</Link>
			</p>
		</AuthForm>
	);
}
