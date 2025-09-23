import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';
import Navbar from './components/Navbar';
import Profile from './components/ProfileButton.jsx';
import LogoBlue from '../../../assets/logos/Logo-VOLTECH--Blue.svg';
import { ROUTES } from '../../../const/route.js';
import useAuthContext from '../../../contexts/auth/useAuthContext.jsx';

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuth, user, loading } = useAuthContext();

	const handleClick = () => {
		setMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
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
						<Link className={styles.profileButton} to={ROUTES.PROFILE.path}>
							<Profile user={user} loading={loading} />
						</Link>
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
					<Navbar onItemClick={() => setMenuOpen(false)} />
				</div>
			)}
		</header>
	);
}
