import { NavLink } from 'react-router-dom';
import styles from '../header.module.scss';
import { useMemo } from 'react';
import { ROUTES } from '../../../../const/route.js';

export default function Navbar({ onItemClick = () => {} }) {
	const handleToTop = () => {
		onItemClick();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const navRoutes = useMemo(
		() => [
			{ path: ROUTES.HOME.path, label: 'Trang chủ' },
			{ path: ROUTES.ACTIVE.path, label: 'Hoạt động' },
			{ path: ROUTES.ABOUT.path, label: 'Giới thiệu' },
			{ path: ROUTES.RANK.path, label: 'Xếp hạng' },
		],
		[]
	);

	return (
		<nav className={styles.navbar}>
			<div className={styles.navbarContainer}>
				{navRoutes.map((route) => (
					<div className={styles.navBlock} key={route.path}>
						<NavLink to={route.path} className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)} onClick={handleToTop}>
							{route.label}
						</NavLink>
					</div>
				))}
			</div>
		</nav>
	);
}
