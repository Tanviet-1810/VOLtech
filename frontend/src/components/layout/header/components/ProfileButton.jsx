import styles from '../header.module.scss';
import AvatarPlaceholder from '../../../../assets/imgs/avatar-placeholder.png';
import RankIcon from '../../../../assets/Icons/IconPoint.svg';

export default function Profile({ user, loading }) {
	const avatarSrc = user?.avatar || AvatarPlaceholder;
	const pointText = user?.score ?? 0;
	return (
		<>
			<div className={styles.avatar}>
				<img src={avatarSrc} alt={user?.name || 'Loading'} />
			</div>
			<div className={styles.info}>
				<div className={styles.username}>{loading ? 'Đang tải...' : user?.name || 'Người dùng'}</div>
				<div className={styles.rank}>
					<div>{pointText}</div>
					<div>
						<img src={RankIcon} alt={pointText} />
					</div>
				</div>
			</div>
		</>
	);
}
