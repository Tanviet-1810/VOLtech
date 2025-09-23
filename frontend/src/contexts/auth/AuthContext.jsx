import { createContext } from 'react';

const AuthContext = createContext({
	token: null,
	user: null,
	loading: false,
	isAuth: false,
	setToken: () => {},
	setUser: () => {},
	login: () => {},
	register: () => {},
	logout: () => {},
	refreshToken: () => {},
});

export default AuthContext;
