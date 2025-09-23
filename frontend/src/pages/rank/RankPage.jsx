import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import AppSection from '../../components/shared/app-section/AppSection.jsx';
import LoadingSection from '../../components/shared/loading-section/LoadingSection.jsx';
import styles from './RankPage.module.scss';
import { getUserRankings } from '../../services/api/v1/score-api.service.js';

export default function RankPage() {
	const [rankData, setRankData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let ignore = false;
		const fetchRanking = async () => {
			try {
				setLoading(true);
				const res = await getUserRankings();
				const data = await res.json();
				if (!ignore) setRankData(data.items || []);
			} catch (err) {
				console.error(err);
				if (!ignore) setError('Không thể tải bảng xếp hạng. Vui lòng thử lại sau.');
			} finally {
				if (!ignore) setLoading(false);
			}
		};
		fetchRanking();
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<AppSection className={styles.rankSection}>
			{loading && <LoadingSection message='Đang tải dữ liệu...' />}
			{error && <div className={styles.statusError}>{error}</div>}
			{!loading && !error && (
				<table className={styles.rankTable}>
					<thead>
						<tr>
							<th>Hạng</th>
							<th>Tên</th>
							<th>Đơn vị</th>
							<th>Điểm</th>
						</tr>
					</thead>
					<tbody>
						{rankData.map((user, index) => (
							<tr key={user._id} className={index < 3 ? styles.topThree : ''}>
								<td>
									<span className={styles.rank}>#{index + 1}</span>
									{index === 0 && <Crown className={styles.crown} size={16} />}
								</td>
								<td>{user.name}</td>
								<td>{user.unit}</td>
								<td>{user.score}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</AppSection>
	);
}
