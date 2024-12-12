import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
    OverlayTrigger,
    Tooltip,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import labels, { getLabel } from "../../components/labels";

export default () => {

    const [getOrderData, setOrderData] = useState()
    const [getMemberData, setMemberData] = useState()

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString("id-ID", { month: "short" });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderResponse = await fetch(
                    `${process.env.REACT_APP_PORTAL_API_URL}/order/list`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const orderData = await orderResponse.json();

                const selectedOrder = orderData.data.filter(
                    (item) => item.id === localStorage.getItem("orderIdMaster")
                )[0];

                setOrderData(selectedOrder);

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        const fetchDataMember = async () => {
            try {
                if (!getOrderData?.membercode) return;
    
                const orderResponse = await fetch(
                    `${process.env.REACT_APP_PORTAL_API_URL}/member/list`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refapp: "" })
                    }
                );
                const orderData = await orderResponse.json();
    
                const selectedOrder = orderData.data.find(
                    (item) => item.mmbr_code === getOrderData?.membercode
                );
    
                setMemberData(selectedOrder);
    
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchDataMember();
    }, [getOrderData])
    

    const containsCode = getOrderData?.alasan_batal && Object.keys(labels.alasan_batal).includes(getOrderData?.alasan_batal);

    return (
        <>
            <Row>
                <Preloader show={!getOrderData ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/order/on-progress">
                        Daftar Pesanan
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Pesanan</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <h6>Detail Pemesanan</h6>
                                    <small style={{ color: "#7376A1" }}>Id Pemesanan</small>
                                    <p style={{ fontWeight: "bold" }}>{getOrderData?.sid}</p>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Invoice</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.type + getOrderData?.invoice}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Status</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.status === 1
                                                    ? "Menerima Pesanan"
                                                    : getOrderData?.status === 2
                                                        ? "Dalam Perjalanan"
                                                        : getOrderData?.status === 3
                                                            ? "Hadir dan Sedang Bertugas"
                                                            : getOrderData?.status === 990
                                                                ? "Sedang Berlangsung"
                                                                : getOrderData?.status === 999
                                                                    ? "Selesai"
                                                                    : getOrderData?.status === 1001
                                                                        ? "Dibatalkan"
                                                                        : ""}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>
                                                Waktu Transaksi
                                            </small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {`${getOrderData?.date_insert
                                                    .split("T")[0]
                                                    .split("-")
                                                    .reverse()[0]
                                                    } ${getMonthName(
                                                        getOrderData?.date_insert
                                                            .split("T")[0]
                                                            .split("-")
                                                            .reverse()[1]
                                                    )} ${getOrderData?.date_insert
                                                        .split("T")[0]
                                                        .split("-")
                                                        .reverse()[2]
                                                    }
                              ${getOrderData?.date_insert
                                                        .split("T")[1]
                                                        .split("+")[0]
                                                    }`}
                                            </p>
                                        </Col>
                                        {getOrderData?.mdisid ? (
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Kode Promo</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderData?.mdisid}
                                                </p>
                                            </Col>
                                        ) : (
                                            ""
                                        )}
                                    </Row>
                                    {getOrderData?.additional && (
                                        <>
                                            <small style={{ color: "#7376A1" }}>Keterangan</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.additional}
                                            </p>
                                        </>
                                    )}
                                </Col>
                                <Col md={6} className="mb-3">
                                    <h6>Detail Penugasan</h6>
                                    <Row>
                                        <Col md={6}>
                                            {" "}
                                            <small style={{ color: "#7376A1" }}>Tipe Layanan</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.type === "TLC"
                                                    ? "Pengacara (Konsultasi)"
                                                    : getOrderData?.type === "TL"
                                                        ? "Pengacara (Pendampingan)"
                                                        : getOrderData?.servicename}
                                                {getOrderData?.gradename !== "Lawyer"
                                                    ? getOrderData?.gradename === "A"
                                                        ? " (Platinum)"
                                                        : " (Silver)"
                                                    : ""}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Durasi</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.type !== "TLC"
                                                    ? getOrderData?.duration +
                                                    " " +
                                                    getOrderData?.typeduration
                                                    : getOrderData?.duration}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Kode Member</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getMemberData?.mmbr_name} - {getOrderData?.membercode}
                                                &nbsp;
                                                <OverlayTrigger
                                                    trigger={["hover", "focus"]}
                                                    overlay={<Tooltip>Lihat</Tooltip>}
                                                >
                                                    <Link
                                                        to={`/member/profile/${getOrderData?.membercode}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    </Link>
                                                </OverlayTrigger>
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Kode Mitra</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getOrderData?.mitracode}
                                                &nbsp;
                                                <OverlayTrigger
                                                    trigger={["hover", "focus"]}
                                                    overlay={<Tooltip>Lihat</Tooltip>}
                                                >
                                                    <Link
                                                        to={`/partner/${getOrderData?.type === "TG" ? "guard" : "lawyer"
                                                            }/profile/${getOrderData?.mitracode}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    </Link>
                                                </OverlayTrigger>
                                            </p>
                                        </Col>
                                    </Row>
                                    {getOrderData?.status !== 1001 ? (
                                        <Row>
                                            {getOrderData?.type === "TLC" ? (
                                                <>
                                                    <Col md={3}>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Dur. Putus Awal
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {getOrderData?.endtime}
                                                        </p>
                                                    </Col>
                                                    <Col md={3}>
                                                        {getOrderData?.other && (
                                                            <>
                                                                <small style={{ color: "#7376A1" }}>
                                                                    Dur. Putus Akhir
                                                                </small>
                                                                <p style={{ fontWeight: "bold" }}>
                                                                    {getOrderData?.other}
                                                                </p>
                                                            </>
                                                        )}
                                                    </Col>
                                                </>
                                            ) : (
                                                <Col md={6}>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Waktu Mulai
                                                    </small>
                                                    <p style={{ fontWeight: "bold" }}>
                                                        {getOrderData?.type !== "TLC"
                                                            ? `${getOrderData?.formdate.split("-").reverse()[0]
                                                            } ${getMonthName(
                                                                getOrderData?.formdate.split("-").reverse()[1]
                                                            )} ${getOrderData?.formdate.split("-").reverse()[2]
                                                            }
                                ${getOrderData?.formtime}`
                                                            : getOrderData?.formtime}
                                                    </p>
                                                </Col>
                                            )}
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    {getOrderData?.type !== "TLC"
                                                        ? "Waktu Selesai"
                                                        : "Waktu Penggunaan"}
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderData?.other === "" ? (
                                                        ""
                                                    ) : (
                                                        getOrderData?.type !== "TLC"
                                                            ? `${getOrderData?.enddate.split("-").reverse()[0]
                                                            } ${getMonthName(
                                                                getOrderData?.enddate.split("-").reverse()[1]
                                                            )} ${getOrderData?.enddate.split("-").reverse()[2]
                                                            }
                                ${getOrderData?.endtime}`
                                                            : getOrderData?.formtime +
                                                            " - " +
                                                            moment(getOrderData?.formtime, "HH:mm:ss")
                                                                .add(
                                                                    getOrderData?.other.split(":")[2].toString(),
                                                                    "seconds"
                                                                )
                                                                .add(
                                                                    getOrderData?.other.split(":")[1].toString(),
                                                                    "minutes"
                                                                )
                                                                .format("HH:mm:ss")
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Dibatalkan Oleh
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderData?.dibatalkan_oleh === "" || getOrderData?.dibatalkan_oleh === null ? "-" : getOrderData?.dibatalkan_oleh}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Alasan Pembatalan
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderData?.dibatalkan_oleh ? (
                                                        getOrderData?.alasan_batal ? (
                                                            containsCode ? (
                                                                getLabel("alasan_batal", getOrderData?.alasan_batal)
                                                            ) : (
                                                                getOrderData?.alasan_batal
                                                            )
                                                        ) : null
                                                    ) : (
                                                        getOrderData?.alasan_batal ? (
                                                            containsCode ? (
                                                                getLabel("alasan_batal", getOrderData?.alasan_batal)
                                                            ) : (
                                                                getOrderData?.alasan_batal
                                                            )
                                                        ) : null
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mb-3">
                                    {getOrderData?.status !== 1001 ? (
                                        <>
                                            <h6>Informasi Pembayaran</h6>
                                            <Row>
                                                <Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Harga Layanan
                                                    </small>
                                                </Col>
                                                <Col className="text-end">
                                                    <small style={{ color: "#7376A1" }}>
                                                        {"IDR " +
                                                            parseInt(getOrderData?.price).toLocaleString(
                                                                "id-ID",
                                                                {}
                                                            )}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Pendapatan Mitra
                                                    </small>
                                                </Col>
                                                <Col className="text-end">
                                                    <small style={{ color: "#7376A1" }}>
                                                        {"IDR " +
                                                            parseInt(getOrderData?.mitraprice).toLocaleString(
                                                                "id-ID",
                                                                {}
                                                            )}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Pendapatan Perusahaan
                                                    </p>
                                                </Col>
                                                <Col className="text-end">
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {"IDR " +
                                                            parseInt(getOrderData?.tnosfee).toLocaleString(
                                                                "id-ID",
                                                                {}
                                                            )}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : getOrderData?.alasan_batal === "assLbl55" ? (
                                        <>
                                            <h6>Estimasi Pengembalian Dana User</h6>
                                            <Row>
                                                <Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Harga Layanan
                                                    </small>
                                                </Col>
                                                <Col className="text-end">
                                                    <small style={{ color: "#7376A1" }}>
                                                        {"IDR " +
                                                            parseInt(getOrderData?.price).toLocaleString(
                                                                "id-ID",
                                                                {}
                                                            )}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Pendapatan Mitra
                                                    </small>
                                                </Col>
                                                <Col className="text-end">
                                                    <small style={{ color: "#7376A1" }}>
                                                        {"IDR " +
                                                            parseInt(
                                                                (80 / 100) * ((10 / 100) * getOrderData?.price)
                                                            ).toLocaleString("id-ID", {})}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Pendapatan Perusahaan
                                                    </small>
                                                </Col>
                                                <Col className="text-end">
                                                    <small style={{ color: "#7376A1" }}>
                                                        {"IDR " +
                                                            parseInt(
                                                                (20 / 100) * ((10 / 100) * getOrderData?.price)
                                                            ).toLocaleString("id-ID", {})}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Total Pengembalian
                                                    </p>
                                                </Col>
                                                <Col className="text-end">
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {"IDR " +
                                                            parseInt(
                                                                getOrderData?.price -
                                                                (10 / 100) * getOrderData?.price
                                                            ).toLocaleString("id-ID", {})}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                                <Col md={6} className="mb-3"></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );

}