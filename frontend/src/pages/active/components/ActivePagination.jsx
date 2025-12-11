import React from 'react';
import styles from './ActivePagination.module.scss';
import Button from '../../../components/shared/button/Button';
import useActivesContext from '../../../contexts/actives-page/useActivesContext';

export default function ActivePagination() {
	const { totalPages, setPage } = useActivesContext();
	const [page, setLocalPage] = React.useState(1);

	React.useEffect(() => {
		setLocalPage(1);
	}, [totalPages]);

	const handlePrev = () => {
		if (page > 1) {
			setLocalPage(page - 1);
			setPage(page - 1);
		}
	};
	const handleNext = () => {
		if (page < totalPages) {
			setLocalPage(page + 1);
			setPage(page + 1);
		}
	};

	return (
		<div className={styles.pagination}>
			<Button variant='secondary' disabled={page <= 1} onClick={handlePrev}>
				Trước
			</Button>
			<span className={styles.pageInfo}>
				Trang {page} / {totalPages}
			</span>
			<Button variant='secondary' disabled={page >= totalPages} onClick={handleNext}>
				Tiếp
			</Button>
		</div>
	);
}
