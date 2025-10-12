import React, { useState, useCallback, useEffect } from 'react';
import { ManageActiveContext } from './ManageActiveContext';
import * as activeApi from '../../services/api/v1/active-api.service';
import * as provinceApi from '../../services/api/v1/province-api.service';
import * as communeApi from '../../services/api/v1/commune-api.service';

export default function ManageActiveContextProvider({ children }) {
	const [activities, setActivities] = useState([]); // <-- Đây là nơi lưu danh sách hoạt động
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
	const [provinces, setProvinces] = useState([]);
	const [communes, setCommunes] = useState([]);
	const [selectedProvince, setSelectedProvince] = useState('');

	const fetchActivities = useCallback(async (page = 1, limit = 10) => {
		try {
			setLoading(true);
			const response = await activeApi.getList({ page, limit, isCreator: true });
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fail');
			}
			const data = await response.json();
			setActivities(data.items || []); // <-- Dữ liệu từ API được lưu vào activities
			setPagination(data.paginate || { page: 1, limit: 10, total: 0 });
		} catch (error) {
			console.error('Failed to fetch activities:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchProvinces = useCallback(async () => {
		try {
			const response = await provinceApi.getProvinces({});
			const data = await response.json();
			setProvinces(data.items || []);
		} catch (error) {
			console.error('Failed to fetch provinces:', error);
		}
	}, []);

	const fetchCommunes = useCallback(async (provinceId) => {
		try {
			if (!provinceId) {
				setCommunes([]);
				return;
			}
			let allCommunes = [];
			let page = 1;
			let hasMore = true;
			const limit = 100;

			while (hasMore) {
				const response = await communeApi.getCommunes({ province: provinceId, page, limit });
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Fail');
				}
				const data = await response.json();
				const items = data.items || [];
				allCommunes = allCommunes.concat(items);
				if (items.length < limit) {
					hasMore = false;
				} else {
					page += 1;
				}
			}
			setCommunes(allCommunes);
		} catch (error) {
			console.error('Failed to fetch communes:', error);
		}
	}, []);

	const createActivity = useCallback(async (activityData) => {
		try {
			setCreating(true);
			const response = await activeApi.createActive(activityData);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fail');
			}
			const data = await response.json();
			setActivities((prev) => [data, ...prev]);
			return data;
		} catch (error) {
			console.error('Failed to create activity:', error);
			throw error;
		} finally {
			setCreating(false);
		}
	}, []);

	const updateActivity = useCallback(async (id, activityData) => {
		try {
			setUpdating(true);
			const response = await activeApi.updateActive(id, activityData);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fail');
			}
			const data = await response.json();
			setActivities((prev) => prev.map((activity) => (activity._id === id ? data : activity)));
			return data;
		} catch (error) {
			console.error('Failed to update activity:', error);
			throw error;
		} finally {
			setUpdating(false);
		}
	}, []);

	const deleteActivity = useCallback(async (id) => {
		try {
			setDeleting(true);
			await activeApi.deleteActive(id);
			setActivities((prev) => prev.filter((activity) => activity._id !== id));
		} catch (error) {
			console.error('Failed to delete activity:', error);
			throw error;
		} finally {
			setDeleting(false);
		}
	}, []);

	useEffect(() => {
		fetchActivities();
		fetchProvinces();
	}, [fetchActivities, fetchProvinces]);

	useEffect(() => {
		fetchCommunes(selectedProvince);
	}, [selectedProvince, fetchCommunes]);

	const value = {
		activities,
		loading,
		creating,
		updating,
		deleting,
		pagination,
		provinces,
		communes,
		selectedProvince,
		setSelectedProvince,
		fetchActivities,
		createActivity,
		updateActivity,
		deleteActivity,
	};

	return <ManageActiveContext.Provider value={value}>{children}</ManageActiveContext.Provider>;
}

