import React, { useState, useRef, useEffect } from "react";
import styles from "./Donate.module.scss";

import qrImageUrl from "../../assets/imgs/QR.jpg";
import qrBankUrl from "../../assets/imgs/QR_1.jpg";

const MAX_SCALE = 4;
const MIN_SCALE = 1;

const Donate = () => {
    const [zoom, setZoom] = useState({
        active: false,
        scale: 1,
        x: 0,
        y: 0,
    });

    const containerRef = useRef(null);
    const drag = useRef({ active: false, lastX: 0, lastY: 0 });

    const openZoom = () =>
        setZoom({ active: true, scale: 1, x: 0, y: 0 });

    const closeZoom = () =>
        setZoom({ active: false, scale: 1, x: 0, y: 0 });

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = qrImageUrl;
        link.download = "QR.jpg";
        link.click();
    };

    const handleDownloadBank = () => {
        const link = document.createElement("a");
        link.href = qrBankUrl;
        link.download = "QR_Banking.jpg";
        link.click();
    };


    const onWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;

        setZoom((prev) => ({
            ...prev,
            scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)),
        }));
    };

    const onMouseDown = (e) => {
        drag.current = {
            active: true,
            lastX: e.clientX,
            lastY: e.clientY,
        };
    };

    const onMouseMove = (e) => {
        if (!drag.current.active) return;

        setZoom((prev) => ({
            ...prev,
            x: prev.x + (e.clientX - drag.current.lastX),
            y: prev.y + (e.clientY - drag.current.lastY),
        }));

        drag.current.lastX = e.clientX;
        drag.current.lastY = e.clientY;
    };

    const stopDrag = () => (drag.current.active = false);

    useEffect(() => {
        if (!zoom.active) return;
        const container = containerRef.current;

        container.addEventListener("wheel", onWheel, { passive: false });

        container.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopDrag);

        return () => {
            container.removeEventListener("wheel", onWheel);
            container.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopDrag);
        };
    }, [zoom.active]);

    return (
        <>
            {zoom.active && (
                <div
                    className={styles.zoomOverlay}
                    ref={containerRef}
                    onMouseDown={onMouseDown}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeZoom();
                    }}
                >
                    <img
                        src={qrImageUrl}
                        alt="QR Zoom"
                        className={styles.zoomedImage}
                        style={{
                            transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
                            cursor: zoom.scale > 1 ? "grab" : "zoom-out",
                        }}
                    />
                </div>
            )}

            <div className={styles.layout}>
                <div className={styles.leftSide}>
                    <img
                        className={styles.qrImage}
                        src={qrImageUrl}
                        alt="QR"
                        onClick={openZoom}
                    />

                    <button className={styles.downloadBtn} onClick={handleDownload}>
                        Tải ảnh xuống
                    </button>
                </div>

                <div className={styles.rightSide}>
                    <img
                        src={qrBankUrl}
                        className={styles.qrSmall}
                        alt="QR Banking"
                    />

                    <div className={styles.bankInfo}>
                        <p><strong>Ngân hàng:</strong> Sài Gòn Công thương (SGB)</p>
                        <p><strong>Chủ tài khoản:</strong> UBMT TO QUOC VIET NAM TPHCM</p>
                        <p><strong>Số tài khoản:</strong> 000870406009898</p>
                        <p><strong>Nội dung:</strong> Ủng hộ lũ lụt</p>
                    </div>

                    <button
                        className={styles.downloadBtnSecondary}
                        onClick={handleDownloadBank}
                    >
                        Tải QR xuống
                    </button>

                </div>
            </div>
        </>
    );
};

export default Donate;
