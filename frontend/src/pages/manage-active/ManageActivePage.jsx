import React, { useState } from 'react';
import styles from './ManageActivePage.module.scss';
import AppSection from '../../components/shared/app-section/AppSection';
import Button, { BUTTON_VARIANTS } from '../../components/shared/button/Button';
import LoadingOverlay from '../../components/shared/loading-overlay/LoadingOverlay';
import ManageActiveContextProvider from '../../contexts/manage-active/ManageActiveContextProvider';
import { useManageActiveContext } from '../../contexts/manage-active/ManageActiveContext';
import ActivityTable from './components/ActivityTable';
import ActivityForm from './components/ActivityForm';

function ManageActivePageContent() {
	const { activities, loading, creating, updating, deleting, createActivity, updateActivity, deleteActivity, fetchActivities } = useManageActiveContext();

	const [showForm, setShowForm] = useState(false);
	const [editingActivity, setEditingActivity] = useState(null);

	const handleCreateNew = () => {
		setEditingActivity(null);
		setShowForm(true);
	};

	const handleEdit = (activity) => {
		setEditingActivity(activity);
		setShowForm(true);
	};

	const handleDelete = async (activityId) => {
		if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
			try {
				await deleteActivity(activityId);
			} catch (error) {
				alert('Có lỗi xảy ra khi xóa hoạt động!');
			}
		}
	};

	const handleFormSubmit = async (formData) => {
		try {
			if (editingActivity) {
				await updateActivity(editingActivity._id, formData);
			} else {
				await createActivity(formData);
			}
			setShowForm(false);
			setEditingActivity(null);
			fetchActivities();
		} catch (error) {
			alert('Có lỗi xảy ra! Vui lòng thử lại.');
		}
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingActivity(null);
	};

	return (
		<>
			<AppSection className={styles.manageSection}>
				<div className={styles.header}>
					<div>
						<h1 className={styles.title}>Quản lý hoạt động thiện nguyện</h1>
						<p className={styles.subtitle}>Tạo, chỉnh sửa và quản lý các hoạt động thiện nguyện</p>
					</div>
					<Button variant={BUTTON_VARIANTS.PRIMARY} onClick={handleCreateNew} disabled={loading || creating || updating || deleting}>
						Tạo hoạt động mới
					</Button>
				</div>

				{showForm ? (
					<div className={styles.formSection}>
						<div className={styles.formHeader}>
							<h2>{editingActivity ? 'Chỉnh sửa hoạt động' : 'Tạo hoạt động mới'}</h2>
						</div>
						<ActivityForm activity={editingActivity} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
					</div>
				) : (
					<div className={styles.tableSection}>
						<ActivityTable activities={activities} loading={loading} onEdit={handleEdit} onDelete={handleDelete} deleting={deleting} />
					</div>
				)}
			</AppSection>

			<LoadingOverlay isActive={creating || updating || deleting} message={creating ? 'Đang tạo hoạt động...' : updating ? 'Đang cập nhật hoạt động...' : deleting ? 'Đang xóa hoạt động...' : ''} />
		</>
	);
}

export default function ManageActivePage() {
	return (
		<ManageActiveContextProvider>
			<ManageActivePageContent />
		</ManageActiveContextProvider>
	);
}
