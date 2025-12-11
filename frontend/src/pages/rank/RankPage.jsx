import React, { useState, useEffect, useCallback } from 'react';
import { Crown } from 'lucide-react';
import AppSection from '../../components/shared/app-section/AppSection.jsx';
import LoadingSection from '../../components/shared/loading-section/LoadingSection.jsx';
import styles from './RankPage.module.scss';
import { getUserRankings } from '../../services/api/v1/score-api.service.js';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';

const LIMIT = 10;

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const useRankPagination = (limit) => {
    const [rankData, setRankData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let ignore = false;
        const fetchRanking = async () => {
            try {
                setLoading(true);
                setError(null); // Reset lỗi mỗi lần fetch
                const res = await getUserRankings({ page, limit });
                const data = await res.json();

                if (!ignore) {
                    const users = Array.isArray(data)
                        ? data
                        : data.items || data.data || []; 

                    setRankData(users);

                    setTotalPages(
                        data.totalPages ||
                        data.paginate?.totalPages ||
                        Math.ceil((data.totalItems || 1) / limit)
                    );
                }

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
    }, [page, limit]);

    const handlePrev = useCallback(() => {
        if (page > 1) setPage((prev) => prev - 1);
    }, [page]);

    const handleNext = useCallback(() => {
        if (page < totalPages) setPage((prev) => prev + 1);
    }, [page, totalPages]);

    return { rankData, loading, error, page, totalPages, handlePrev, handleNext };
};

const RankRow = ({ user, index, page, limit, currentUser }) => {
    const globalRank = (page - 1) * limit + index + 1;
    const isCurrent =
        currentUser &&
        (user._id === currentUser._id || user.email === currentUser.email);
    const isTopThree = globalRank <= 3;

    const rowClassName = classNames(
        isTopThree && styles.topThree,
        isCurrent && styles.currentUser
    );

    return (
        <tr className={rowClassName}>
            <td>
                <span className={styles.rank}>#{globalRank}</span>
                {globalRank === 1 && <Crown className={styles.crown} size={16} />}
            </td>
            <td>{user.name}</td>
            <td>{user.unit}</td>
            <td>{user.score}</td>
        </tr>
    );
};

const RankTable = ({ rankData, page, limit, currentUser }) => {
    return (
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
                    <RankRow
                        key={user._id || index}
                        user={user}
                        index={index}
                        page={page}
                        limit={limit}
                        currentUser={currentUser}
                    />
                ))}
            </tbody>
        </table>
    );
};

const Pagination = ({ page, totalPages, onPrev, onNext }) => {
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    return (
        <div className={styles.pagination}>
            <button
                className={classNames(styles.pageButton, isFirstPage && styles.disabled)}
                onClick={onPrev}
                disabled={isFirstPage}
            >
                 Trước
            </button>
            <span className={styles.pageInfo}>
                Trang {page} / {totalPages}
            </span>
            <button
                className={classNames(styles.pageButton, isLastPage && styles.disabled)}
                onClick={onNext}
                disabled={isLastPage}
            >
                Tiếp 
            </button>
        </div>
    );
};

export default function RankPage() {
    const { user: currentUser } = useAuthContext();
    const {
        rankData,
        loading,
        error,
        page,
        totalPages,
        handlePrev,
        handleNext
    } = useRankPagination(LIMIT);

    const renderContent = () => {
        if (loading) return <LoadingSection message='Đang tải dữ liệu...' />;
        if (error) return <div className={styles.statusError}>{error}</div>;

        return (
            <>
                <RankTable
                    rankData={rankData}
                    page={page}
                    limit={LIMIT}
                    currentUser={currentUser}
                />
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </>
        );
    };

    return (
        <AppSection className={styles.rankSection}>
            {renderContent()}
        </AppSection>
    );
}