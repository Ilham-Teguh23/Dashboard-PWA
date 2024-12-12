import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
    OverlayTrigger,
    Tooltip,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { useLocation } from "react-router-dom";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import CurrencyFormatter from "../../components/CurrencyFormatter";

export default () => {
    const [getTransactionDetailData, setTransactionDetailData] = useState();

    const location = useLocation()
    const external_id = location.pathname.split("/")[3];

    useEffect(() => {
        const fetchDetailData = () => {
            fetch(`${process.env.REACT_APP_API_TAB_URL}/payment/${external_id}/external_id`)
                .then((res) => res.json())
                .then((response) => {

                    setTransactionDetailData(response.data)

                }).catch((error) => {
                    console.log("Error Fetching Data " + error);
                });
        }

        fetchDetailData();
    }, []);

    return (
        <>
            <Row>
                <Preloader show={!getTransactionDetailData ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/tab/transaksi">
                        Daftar Transaksi
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Transaksi</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={7}>
                                    <h6>
                                        Detail Transaksi
                                    </h6>
                                    <Row className="mt-3">
                                        <Col md={12}>
                                            <small style={{ color: "#7376A1" }}>External ID</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {!getTransactionDetailData?.external_id ? (
                                                    <>
                                                        Menunggu Pembayaran &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    Id transaksi akan muncul setelah pembayaran
                                                                    selesai
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </>
                                                ) : (
                                                    getTransactionDetailData?.external_id
                                                )}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama</small>
                                            <p style={{ fontWeight: "bold" }}>{getTransactionDetailData?.name}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Tanggal Mulai</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                <ConvertTimestamps timestamp={getTransactionDetailData?.start_date} />
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Tanggal Akhir</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                <ConvertTimestamps timestamp={getTransactionDetailData?.end_date} />
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Status Transaksi</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.status_transaksi === "PAID" ? "Sudah Dibayar (Paid)" : getTransactionDetailData?.status_transaksi === "SETTLED" ? "Sudah Dibayar (Settled)" : getTransactionDetailData?.status_transaksi === "PENDING" ? "Menunggu Pembayaran" : ""}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Harga</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                <CurrencyFormatter amount={getTransactionDetailData?.amount} />
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Status Subscribe</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.status_subscribe}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={5}>
                                    <h6>
                                        Master Paket
                                    </h6>
                                    <Row className="mt-3">
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama Paket</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.masterPaket?.nama_paket}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Limit Kontak</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.masterPaket?.limit_contact}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <small style={{ color: "#7376A1" }}>Deskripsi</small>
                                            <p style={{ fontWeight: "bold" }}>{getTransactionDetailData?.masterPaket?.description}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Durasi Waktu</small>
                                            <p style={{ fontWeight: "bold" }}>{getTransactionDetailData?.masterPaket?.durationDate} Hari</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
