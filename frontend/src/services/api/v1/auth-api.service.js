import { httpPost } from '../http-client.js';

export const login = (email, password) => httpPost('/auth/login', { email, password });

export const register = ({ name, email, password, birthDate, unit, phone }) => httpPost('/auth/register', { name, email, password, birthDate, unit, phone });

export const logout = () => httpPost('/auth/logout');

export const refreshToken = () => httpPost('/auth/refresh');
