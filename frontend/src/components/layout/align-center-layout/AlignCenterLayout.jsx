import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AlignCenterLayout.module.scss';

const AlignCenterLayout = () => (
	<div className={styles.alignCenterPage}>
		<div className={styles.alignCenterContainer}>
			<Outlet />
		</div>
	</div>
);

export default AlignCenterLayout;
