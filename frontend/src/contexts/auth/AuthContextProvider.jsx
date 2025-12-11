import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext.jsx';
import LocalStorageService, { LOCAL_STORAGE_KEYS } from '../../services/storage/local-storage.service.js';
import { login as loginApi, register as registerApi, logout as logoutApi, refreshToken as refreshTokenApi } from '../../services/api/v1/auth-api.service.js';
import { getMe } from '../../services/api/v1/user-api.service.js';

const AuthContextProvider = ({ children }) => {
	const [token, setTokenState] = useState(() => LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN));
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const setToken = useCallback((value) => {
		setTokenState(value);
		if (value) {
			LocalStorageService.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, value);
		} else {
			LocalStorageService.remove(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
		}
	}, []);

	const fetchUser = useCallback(async (tk) => {
		if (!tk) {
			setUser(null);
			return;
		}
		setLoading(true);
		try {
			const res = await getMe(tk);
			if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
			const user = await res.json();
			setUser(user || null);
		} catch (err) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (token) {
			fetchUser(token);
		} else {
			const tk = LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
			if (tk) setToken(tk);
			else setUser(null);
		}
	}, [token, fetchUser, setToken]);

	const login = useCallback(
		async (email, password) => {
			setLoading(true);
			try {
				const res = await loginApi(email, password);
				const data = await res.json();
				if (data?.accessToken) {
					setToken(data.accessToken);
					await fetchUser(data.accessToken);
				}
				return data;
			} catch (err) {
				return { error: err.message || 'Đăng nhập thất bại' };
			} finally {
				setLoading(false);
			}
		},
		[setToken, fetchUser]
	);

	const register = useCallback(async ({ name, email, password, birthDate, unit, phone }) => {
		setLoading(true);
		try {
			const res = await registerApi({ name, email, password, birthDate, unit, phone });
			const data = await res.json();
			return data;
		} catch (err) {
			return { error: err.message || 'Đăng ký thất bại' };
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		setLoading(true);
		try {
			await logoutApi();
			setToken(null);
			setUser(null);
		} catch (err) {
			// handle error if needed
		} finally {
			setLoading(false);
		}
	}, [setToken]);

	const refreshToken = useCallback(async () => {
		setLoading(true);
		try {
			const res = await refreshTokenApi();
			if (res?.accessToken) {
				setToken(res.accessToken);
				await fetchUser(res.accessToken);
				return true;
			}
			return false;
		} catch (err) {
			return false;
		} finally {
			setLoading(false);
		}
	}, [setToken, fetchUser]);

	const value = {
		token,
		user,
		loading,
		isAuth: !!token && !!user,
		setToken,
		setUser,
		login,
		register,
		logout,
		refreshToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
