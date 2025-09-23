import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ActivityForm.module.scss';
import Input from '../../../components/input/Input';
import Button, { BUTTON_VARIANTS } from '../../../components/shared/button/Button';
import { useManageActiveContext } from '../../../contexts/manage-active/ManageActiveContext';
import { ACTIVE_STATUS, ACTIVE_STATUS_VIETNAMESE } from '../../../const/active-status';

function ActivityForm({ activity = null, onSubmit, onCancel }) {
	const { provinces, communes, selectedProvince, setSelectedProvince, creating, updating } = useManageActiveContext();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		startDate: '',
		endDate: '',
		points: '',
		location: '',
		maxParticipants: '',
		commune: '',
		images: '',
		notes: '',
		status: ACTIVE_STATUS.OPEN,
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (activity) {
			setFormData({
				title: activity.title || '',
				description: activity.description || '',
				startDate: activity.startDate ? new Date(activity.startDate).toISOString().split('T')[0] : '',
				endDate: activity.endDate ? new Date(activity.endDate).toISOString().split('T')[0] : '',
				points: activity.points?.toString() || '',
				location: activity.location || '',
				maxParticipants: activity.maxParticipants?.toString() || '',
				commune: activity.commune?._id || '',
				images: Array.isArray(activity.images) ? activity.images.join(', ') : '',
				notes: activity.notes || '',
				status: activity.status || ACTIVE_STATUS.OPEN,
			});
			if (activity.commune?.province) {
				setSelectedProvince(activity.commune.province);
			}
		}
	}, [activity, setSelectedProvince]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
		if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
		if (!formData.startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
		if (!formData.endDate) newErrors.endDate = 'Ngày kết thúc là bắt buộc';
		if (!formData.points || isNaN(formData.points) || parseInt(formData.points) < 0) {
			newErrors.points = 'Điểm phải là số dương';
		}
		if (!formData.location.trim()) newErrors.location = 'Địa điểm là bắt buộc';
		if (!formData.maxParticipants || isNaN(formData.maxParticipants) || parseInt(formData.maxParticipants) < 1) {
			newErrors.maxParticipants = 'Số lượng tham gia phải là số dương';
		}
		if (!formData.commune) newErrors.commune = 'Xã/phường là bắt buộc';
		if (!formData.status) newErrors.status = 'Trạng thái là bắt buộc';

		if (new Date(formData.startDate) >= new Date(formData.endDate)) {
			newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const submitData = {
			...formData,
			points: parseInt(formData.points),
			maxParticipants: parseInt(formData.maxParticipants),
			startDate: new Date(formData.startDate).toISOString(),
			endDate: new Date(formData.endDate).toISOString(),
			images: formData.images
				? formData.images
						.split(',')
						.map((img) => img.trim())
						.filter(Boolean)
				: [],
		};

		onSubmit(submitData);
	};

	const isSubmitting = creating || updating;

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.formGrid}>
				<Input name='title' label='Tiêu đề hoạt động' placeholder='Nhập tiêu đề hoạt động' value={formData.title} onChange={handleChange} error={errors.title} />

				<div className={styles.formGroup}>
					<label className={styles.label}>Mô tả</label>
					<textarea className={styles.textarea} name='description' placeholder='Nhập mô tả chi tiết hoạt động' value={formData.description} onChange={handleChange} rows={6} />
					{errors.description && <span className={styles.error}>{errors.description}</span>}
				</div>

				<Input name='startDate' label='Ngày bắt đầu' type='date' value={formData.startDate} onChange={handleChange} error={errors.startDate} />

				<Input name='endDate' label='Ngày kết thúc' type='date' value={formData.endDate} onChange={handleChange} error={errors.endDate} />

				<Input name='points' label='Điểm thưởng' type='number' placeholder='Nhập số điểm' value={formData.points} onChange={handleChange} error={errors.points} min='0' />

				<Input name='location' label='Địa điểm' placeholder='Nhập địa điểm tổ chức' value={formData.location} onChange={handleChange} error={errors.location} />

				<Input name='maxParticipants' label='Số lượng tham gia tối đa' type='number' placeholder='Nhập số lượng' value={formData.maxParticipants} onChange={handleChange} error={errors.maxParticipants} min='1' />

				<div className={styles.formGroup}>
					<label className={styles.label}>Trạng thái</label>
					<select className={styles.select} name='status' value={formData.status} onChange={handleChange}>
						{Object.values(ACTIVE_STATUS).map((status) => (
							<option key={status} value={status}>
								{ACTIVE_STATUS_VIETNAMESE[status]}
							</option>
						))}
					</select>
					{errors.status && <span className={styles.error}>{errors.status}</span>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>Tỉnh/Thành phố</label>
					<select className={styles.select} value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
						<option value=''>Chọn tỉnh/thành phố</option>
						{provinces.map((province) => (
							<option key={province._id} value={province._id}>
								{province.name}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>Xã/Phường</label>
					<select className={styles.select} name='commune' value={formData.commune} onChange={handleChange} disabled={!selectedProvince}>
						<option value=''>Chọn xã/phường</option>
						{communes.map((commune) => (
							<option key={commune._id} value={commune._id}>
								{commune.name}
							</option>
						))}
					</select>
					{errors.commune && <span className={styles.error}>{errors.commune}</span>}
				</div>

				<div className={styles.fullWidth}>
					<Input name='images' label='Hình ảnh (URL)' placeholder='Nhập URL hình ảnh, phân cách bằng dấu phẩy' value={formData.images} onChange={handleChange} />
				</div>

				<div className={styles.fullWidth}>
					<div className={styles.formGroup}>
						<label className={styles.label}>Ghi chú</label>
						<textarea className={styles.textarea} name='notes' placeholder='Nhập ghi chú thêm' value={formData.notes} onChange={handleChange} rows={3} />
					</div>
				</div>
			</div>

			<div className={styles.formActions}>
				<Button type='button' variant={BUTTON_VARIANTS.SECONDARY} onClick={onCancel} disabled={isSubmitting}>
					Hủy
				</Button>
				<Button type='submit' variant={BUTTON_VARIANTS.PRIMARY} disabled={isSubmitting}>
					{isSubmitting ? 'Đang xử lý...' : activity ? 'Cập nhật' : 'Tạo mới'}
				</Button>
			</div>
		</form>
	);
}

ActivityForm.propTypes = {
	activity: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default ActivityForm;
