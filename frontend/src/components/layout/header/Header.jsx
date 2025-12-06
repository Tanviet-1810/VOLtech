import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import NotificationButton from './components/NotificationButton.jsx';
import Navbar from './components/Navbar';
import Profile from './components/ProfileButton.jsx';
import LoadingOverlay from '../../shared/loading-overlay/LoadingOverlay.jsx';
import LogoBlue from '../../../assets/logos/Logo-VOLTECH--Blue.svg';
import { ROUTES } from '../../../const/route.js';
import useAuthContext from '../../../contexts/auth/useAuthContext.jsx';

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuth, user, loading, logout } = useAuthContext();
	const [logoutLoading, setLogoutLoading] = useState(false);
	const [logoutError, setLogoutError] = useState(null);
	const navigate = useNavigate();


	const handleClick = () => {
		setMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });	
	};	

	const handleLogout = useCallback(async () => {
		setLogoutError(null);
		setLogoutLoading(true);

		try {
			await logout();

			setTimeout(() => {
				navigate(ROUTES.HOME.path);
				setLogoutLoading(false);
			}, 500);
		} catch (err) {
			console.error(err);
			setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.');
			setLogoutLoading(false);
		}	
	}, [logout, navigate]); 

	   return (
		<>
			<LoadingOverlay isActive={logoutLoading} message="Đang đăng xuất..." />
		   	<header className={styles.header}>
				<div className={`container ${styles.container}`}>
					<div className={styles.headerLeft}>
						<Link to={ROUTES.HOME.path} className={styles.logo} onClick={handleClick}>
							<img src={LogoBlue} alt='VOLtech Logo' />
						</Link>
					</div>
					<div className={`${styles.navDesktop} ${menuOpen ? styles.show : ''}`}>
						<Navbar />
					</div>
					<div className={styles.headerRight}>
						{isAuth && user ? (
							<div className={styles.headerActions}>
								<Link to={ROUTES.NOTIFICATION.path} className={styles.notificationButton}>
									<NotificationButton loading={loading} />
								</Link>

								<div className={styles.profileWrapper}>
									<Link to={ROUTES.PROFILE.path} className={styles.profileButton}>
										<Profile user={user} loading={loading} />
									</Link>

									<div className={styles.hoverBridge}></div>

									<div className={styles.profileMenu}>
										<Link to={ROUTES.PROFILE.path}>Trang cá nhân</Link>
										<Link to={ROUTES.EDIT_PROFILE.path}>Chỉnh sửa hồ sơ</Link>
										<button type="button" onClick={handleLogout} disabled={logoutLoading}>{logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}</button>
										{logoutError && 
											<p className={styles.error}>{logoutError}</p>
										}
									</div>
								</div>
							</div>
						) : (
							<div className={styles.authButtons}>
								<Link to={ROUTES.LOGIN.path} className={styles.buttonGhost}>
									Đăng nhập
								</Link>
							</div>
						)}
						<button type='button' onClick={() => setMenuOpen(!menuOpen)} aria-label='Mở menu' className={`${styles.menuToggle} ${menuOpen ? styles.active : ''}`}>
							<span></span>
							<span></span>
							<span></span>
						</button>
					</div>
				</div>
				{menuOpen && (
					<div className={styles.navMobile}>
						<Navbar />
					</div>
				)}
		   	</header>
		</>			
	);
}
