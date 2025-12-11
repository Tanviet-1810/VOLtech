import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './ProfileInfoCard.module.scss';
import { User, Mail, Calendar, Building, Phone, Trophy } from 'lucide-react';

const ProfileInfoCard = memo(
	({ user }) => {
		const formatDate = (dateString) => {
			if (!dateString) return 'Chưa cập nhật';
			return new Date(dateString).toLocaleDateString('vi-VN');
		};

		const userInfo = useMemo(
			() => [
				{
					label: 'Tên',
					value: user?.name || 'Chưa cập nhật',
					className: '',
					icon: <User size={16} />,
				},
				{
					label: 'Email',
					value: user?.email || 'Chưa cập nhật',
					className: '',
					icon: <Mail size={16} />,
				},
				{
					label: 'Ngày sinh',
					value: formatDate(user?.birthDate),
					className: '',
					icon: <Calendar size={16} />,
				},
				{
					label: 'Đơn vị',
					value: user?.unit || 'Chưa cập nhật',
					className: '',
					icon: <Building size={16} />,
				},
				{
					label: 'Số điện thoại',
					value: user?.phone || 'Chưa cập nhật',
					className: '',
					icon: <Phone size={16} />,
				},
				{
					label: 'Điểm',
					value: user?.score ?? 0,
					className: styles.scoreItem,
					icon: <Trophy size={16} />,
				},
			],
			[user]
		);

		return (
			<div className={styles.infoCard}>
				<h2 className={styles.cardTitle}>Thông tin cá nhân</h2>
				<div className={styles.infoGrid}>
					{userInfo.map((info, index) => (
						<div key={index} className={`${styles.infoItem} ${info.className}`}>
							<div className={styles.labelWrapper}>
								<span className={styles.labelIcon}>{info.icon}</span>
								<span className={styles.label}>{info.label}</span>
							</div>
							<span className={styles.value}>{info.value}</span>
						</div>
					))}
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => prevProps.user?._id === nextProps.user?._id
);

ProfileInfoCard.propTypes = {
	user: PropTypes.object,
};

export default ProfileInfoCard;
