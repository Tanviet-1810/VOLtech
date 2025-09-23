import React, { useState, useEffect } from 'react';
import styles from './ActiveFilter.module.scss';
import Button from '../../../components/shared/button/Button';
import useActivesContext from '../../../contexts/actives-page/useActivesContext';
import { ACTIVE_STATUS } from '../../../const/active-status';
import { getProvinces, getCommunes } from '../../../services/api/v1';

const SORT_OPTIONS = [
	{ value: '', label: 'Mặc định' },
	{ value: '_id', label: 'Mới nhất', order: 'desc' },
	{ value: '_id', label: 'Cũ nhất', order: 'asc' },
	{ value: 'points', label: 'Điểm cao nhất', order: 'desc' },
	{ value: 'points', label: 'Điểm thấp nhất', order: 'asc' },
	{ value: 'status', label: 'Trạng thái', order: 'asc' },
];

export default function ActiveFilter() {
	const { updateQuery } = useActivesContext();
	const [title, setTitle] = useState('');
	const [status, setStatus] = useState('');
	const [selectedProvince, setSelectedProvince] = useState('');
	const [commune, setCommune] = useState('');
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState('');
	const [joined, setJoined] = useState(false);

	const [provinces, setProvinces] = useState([]);
	const [communes, setCommunes] = useState([]);
	const [loadingProvinces, setLoadingProvinces] = useState(false);
	const [loadingCommunes, setLoadingCommunes] = useState(false);

	useEffect(() => {
		const loadProvinces = async () => {
			setLoadingProvinces(true);
			try {
				const response = await getProvinces({ page: 1, limit: 100 });
				const { items } = await response.json();
				if (response.ok && items) {
					setProvinces(items);
				}
			} catch (error) {
				console.error('Error loading provinces:', error);
			} finally {
				setLoadingProvinces(false);
			}
		};

		loadProvinces();
	}, []);

	useEffect(() => {
		if (selectedProvince) {
			const loadCommunes = async () => {
				setLoadingCommunes(true);
				try {
					const response = await getCommunes({ province: selectedProvince, page: 1, limit: 100 });
					const { items } = await response.json();
					if (response.ok && items) {
						setCommunes(items);
					}
				} catch (error) {
					console.error('Error loading communes:', error);
				} finally {
					setLoadingCommunes(false);
				}
			};

			loadCommunes();
		} else {
			setCommunes([]);
			setCommune('');
		}
	}, [selectedProvince]);

	const handleProvinceChange = (e) => {
		setSelectedProvince(e.target.value);
		setCommune('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateQuery({ title, status, commune, sortBy, sortOrder, joined });
	};

	const handleSortChange = (e) => {
		const idx = e.target.selectedIndex;
		const option = SORT_OPTIONS[idx];
		setSortBy(option.value);
		setSortOrder(option.order || '');
	};

	return (
		<form className={styles.filterForm} onSubmit={handleSubmit}>
			<input type='text' className={styles.input} placeholder='Tìm kiếm theo tiêu đề...' value={title} onChange={(e) => setTitle(e.target.value)} />
			<select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
				<option value=''>Tất cả trạng thái</option>
				<option value={ACTIVE_STATUS.OPEN}>Đang mở</option>
				<option value={ACTIVE_STATUS.CLOSED}>Đã đóng</option>
				<option value={ACTIVE_STATUS.COMPLETED}>Hoàn thành</option>
				<option value={ACTIVE_STATUS.CANCELLED}>Đã hủy</option>
			</select>
			<select className={styles.select} value={selectedProvince} onChange={handleProvinceChange} disabled={loadingProvinces}>
				<option value=''>{loadingProvinces ? 'Đang tải tỉnh/thành...' : 'Chọn tỉnh/thành phố'}</option>
				{provinces.map((province) => (
					<option key={province._id} value={province._id}>
						{province.code} - {province.name}
					</option>
				))}
			</select>
			<select className={styles.select} value={commune} onChange={(e) => setCommune(e.target.value)} disabled={!selectedProvince || loadingCommunes}>
				<option value=''>{loadingCommunes ? 'Đang tải xã/phường...' : selectedProvince ? 'Chọn xã/phường' : 'Chọn tỉnh/thành trước'}</option>
				{communes.map((communeItem) => (
					<option key={communeItem._id} value={communeItem._id}>
						{communeItem.code} - {communeItem.name}
					</option>
				))}
			</select>
			<select className={styles.select} value={sortBy + sortOrder} onChange={handleSortChange}>
				{SORT_OPTIONS.map((opt) => (
					<option key={opt.label} value={opt.value + (opt.order || '')}>
						{opt.label}
					</option>
				))}
			</select>
			<label className={styles.checkboxLabel}>
				<input type='checkbox' checked={joined} onChange={() => setJoined(!joined)} className={styles.checkbox} />
				<span>Bạn đã tham gia</span>
			</label>
			<Button type='submit' variant='primary'>
				Lọc
			</Button>
		</form>
	);
}
