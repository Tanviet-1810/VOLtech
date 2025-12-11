import AppSection from '../../components/shared/app-section/AppSection';
import styles from './NotFoundPage.module.scss';
import Button, { BUTTON_AS } from '../../components/shared/button/Button';

export default function NotFoundPage() {
	return (
		<AppSection className={styles.notFoundSection}>
			<div className={styles.content}>
				<h1 className={styles.title}>404</h1>
				<p className={styles.message}>Trang bạn tìm kiếm không tồn tại.</p>
				<Button as={BUTTON_AS.LINK} to='/' variant='primary' className={styles.homeBtn}>
					Quay về trang chủ
				</Button>
			</div>
		</AppSection>
	);
}
