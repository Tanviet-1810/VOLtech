import { Heart, Users, Target } from 'lucide-react';
import styles from './ValuesSection.module.scss';
import AppSection from '../../../components/shared/app-section/AppSection';

const values = [
	{
		icon: Heart,
		title: 'Tình yêu thương',
		description: 'Lan tỏa tình yêu thương và sự quan tâm đến những người xung quanh, tạo nên một cộng đồng ấm áp và đoàn kết.',
	},
	{
		icon: Users,
		title: 'Cộng đồng',
		description: 'Xây dựng mối liên kết bền chặt giữa các thành viên, cùng nhau hướng tới mục tiêu chung vì một xã hội tốt đẹp hơn.',
	},
	{
		icon: Target,
		title: 'Hiệu quả',
		description: 'Tối ưu hóa mọi hoạt động thiện nguyện để mang lại tác động tích cực và bền vững nhất cho cộng đồng.',
	},
];

export function ValuesSection() {
	return (
		<AppSection className={styles.valuesSection}>
			<div className={styles.header + ' fade-bottom-to-top'}>
				<h2 className={styles.title}>Giá trị cốt lõi</h2>
				<p className={styles.subtitle}>Những giá trị định hướng mọi hoạt động của chúng tôi trong việc xây dựng cộng đồng thiện nguyện</p>
			</div>
			<div className={styles.grid}>
				{values.map((value, index) => {
					const IconComponent = value.icon;
					return (
						<div key={index} className={`${styles.card} fade-in`}>
							<div className={styles.cardContent}>
								<div className={styles.iconWrapper}>
									<IconComponent className={styles.icon} />
								</div>
								<h3 className={styles.cardTitle}>{value.title}</h3>
								<p className={styles.cardDesc}>{value.description}</p>
							</div>
						</div>
					);
				})}
			</div>
		</AppSection>
	);
}
