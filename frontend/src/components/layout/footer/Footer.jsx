import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import LogoBlue from '../../../assets/logos/Logo-VOLTECH--Blue.svg';
import { ROUTES } from '../../../const/route.js';

export default function Footer() {
	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<footer className={styles.footer}>
			<div className={`container ${styles.container}`}>
				<div className={styles.grid}>
					<div className={styles.logoSection}>
						<Link to='/' className={styles.logo} onClick={handleClick}>
							<img src={LogoBlue} alt='VOLtech Logo' />
						</Link>
						<p className={styles.description}>Nền tảng kết nối những trái tim thiện nguyện, xây dựng cộng đồng tốt đẹp và tạo ra những giá trị tích cực cho xã hội.</p>
					</div>
					<div className={styles.Section}>
						<div className={styles.linksSection}>
							<h3 className={styles.linksTitle}>Liên kết nhanh</h3>
							<ul className={styles.linkList}>
								<li>
									<Link to={ROUTES.ACTIVE.path} className={styles.link}>
										Hoạt động thiện nguyện
									</Link>
								</li>
								<li></li>
								<li>
									<Link to={ROUTES.CONTACT.path} className={styles.link}>
										Liên hệ
									</Link>
								</li>
							</ul>
						</div>

						<div className={styles.linksSection}>
							<h3 className={styles.linksTitle}>Hỗ trợ</h3>
							<ul className={styles.linkList}>
								<li>
									<Link to={ROUTES.HELP.path} className={styles.link}>
										Trợ giúp
									</Link>
								</li>
								<li></li>
								<li>
									<Link to={ROUTES.TERMS.path} className={styles.link}>
										Điều khoản sử dụng
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className={styles.bottom}>
					<p className={styles.bottomText}>© 2024 VolunteerHub.</p>
				</div>
			</div>
		</footer>
	);
}
