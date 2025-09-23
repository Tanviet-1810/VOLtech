import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthContext from '../../../contexts/auth/useAuthContext.jsx';
import LoadingSection from '../../shared/loading-section/LoadingSection.jsx';
import { highestRole, USER_ROLE } from '../../../const/user-role.js';
import { ROUTES } from '../../../const/route.js';

export default function MainLayout({ protectedLayout = false, requireRoles }) {
	const { isAuth, user, loading } = useAuthContext();

	if (protectedLayout && loading) {
		return <LoadingSection message='Đang kiểm tra đăng nhập...' />;
	}

	if (protectedLayout && !loading && !isAuth) {
		return <Navigate to={ROUTES.LOGIN.path} replace />;
	}

	if (protectedLayout && requireRoles && isAuth && user && Array.isArray(user.role)) {
		const userHighestRole = highestRole(user.role);
		const requiredRoles = Array.isArray(requireRoles) ? requireRoles : [requireRoles];
		if (!requiredRoles.includes(userHighestRole)) {
			return <Navigate to={ROUTES.LOGIN.path} replace />;
		}
	}

	return (
		<>
			<Header />
			<main
				style={{
					minHeight: '70vh',
				}}
			>
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
