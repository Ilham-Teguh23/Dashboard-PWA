import { Badge, Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faInfoCircle, faPrint } from "@fortawesome/free-solid-svg-icons";
import ReadableDateTime from "../../components/ReadableDateTime";
import axios from "axios";

export default () => {

    const getOrderDetailData = JSON.parse(localStorage.getItem("pwaB2bOrderDataById"))
    const [getDetailTransaksi, setDetailTransaksi] = useState([])
    const [getJsonData, setJsonData] = useState([])

    useEffect(() => {
        if (getOrderDetailData?.tnos_service_id === "6" && getOrderDetailData?.tnos_subservice_id === "1") {
            const fetchDetailTransaksi = async () => {
                try {

                    const responseData = await axios.get(
                        `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/dashboard/pwa-revamp/transaksi/${getOrderDetailData?.id}/detail`
                    )

                    const convert = JSON.parse(responseData?.data?.data?.history?.json_data)

                    setDetailTransaksi(responseData?.data)
                    setJsonData(convert)

                } catch (error) {
                    console.log(error);
                }
            }

            fetchDetailTransaksi();
        }
    }, [])

    const ifNotNull = (field, type = "normal", optionArr = "normal") => {
        let updateField = field;

        if (!field) {
            return "-";
        }

        if (type === "curr") {
            updateField = `IDR ${parseInt(field).toLocaleString("id-ID", {})}`;
        }

        if (type === "option") {
            updateField = optionArr?.map(
                (item) => field === item.value && item.defaultValue
            );
        }

        if (type === "obj") {
            updateField = JSON.parse(field)[optionArr];
        }

        if (type === "saham") {
            const data = JSON.parse(field);
            const output = data
                .map((item) => `${item.name}: ${item.persentase}%`)
                .join(", ");
            return output;
        }

        if (type === "sunder") {
            const data = JSON.parse(field);
            const output = data
                .map((item) => `${item.jabatan}: ${item.name}`)
                .join(", ");
            return output;
        }

        if (type === "bidus") {
            const data = JSON.parse(field);
            const output = data.map((item) => `${item.value}`).join(", ");
            return output;
        }

        if (type === "objArr") {
            const parsedData = JSON.parse(field);
            const options = parsedData.map((item) => item[optionArr]);
            return options.join(", ");
        }

        if (type === "sahamCard") {
            const data = JSON.parse(field);
            const output = data.map((item, index) => (
                <span>
                    {index + 1}. {item.name}: {item.persentase}%
                    <br />
                </span>
            ));
            return output;
        }

        if (type === "sunderCard") {
            const data = JSON.parse(field);
            const output = data.map((item, index) => (
                <span>
                    {index + 1}. {item.jabatan}: {item.name}
                    <br />
                </span>
            ));
            return output;
        }

        if (type === "bidusCard") {
            const data = JSON.parse(field);
            const output = data.map((item, index) => (
                <span>
                    {index + 1}. {item.value}
                    <br />
                </span>
            ));
            return output;
        }

        if (type === "objArrCard") {
            const parsedData = JSON.parse(field);
            const options = parsedData.map((item, index) => (
                <span>
                    {index + 1}. {item[optionArr]}
                    <br />
                </span>
            ));
            return options;
        }

        if (type === "address") {
            let addressObj = JSON.parse(field);

            if (optionArr === "dom") {
                return addressObj.domisili_sekarang;
            }

            let order = [
                "jalan",
                "rt",
                "rw",
                "kelurahan.label",
                "kecamatan.label",
                "kabupaten.label",
                "provinsi.label",
                "kode_pos",
            ];

            let result = order.map((item) => {
                let keys = item.split(".");
                let value = addressObj[keys[0]];

                if (keys.length > 1 && value) {
                    value = value[keys[1]];
                }

                if (keys[0] === "rt") {
                    value = "RT " + value;
                } else if (keys[0] === "rw") {
                    value = "RW " + value;
                }

                return value ? value : "";
            });

            return result.filter((item) => item !== "").join(", ");
        }

        if (type === "dom") {
        }

        return updateField;
    };

    return (
        <Row>
            <Preloader show={!getOrderDetailData ? true : false} />
            <Row className="mt-4"></Row>
            <Breadcrumb
                className="d-none d-md-inline-block"
                listProps={{
                    className: "breadcrumb-dark breadcrumb-transparent",
                }}
            >
                <Breadcrumb.Item href="/pwa-b2b/transaction">
                    Data Transaksi B2B
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Detail Transaksi</Breadcrumb.Item>
            </Breadcrumb>
            <Col xs={12} xl={12}>
                <Card border="light" className="bg-white shadow-sm mb-4">
                    <Card.Body>
                        {getOrderDetailData?.tnos_service_id === "6" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                            <>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <h6>
                                            Detail Pemesanan &nbsp;
                                            &nbsp;
                                            <Link
                                                to={`/pwa-b2b/order/export-pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Badge
                                                    bg="primary"
                                                    className="badge-md"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        localStorage.setItem(
                                                            "pwaB2bExportOrderDataById",
                                                            JSON.stringify(getOrderDetailData)
                                                        );
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPrint} /> Export PDF
                                                </Badge>
                                            </Link>
                                        </h6>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Security Provider</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.tnos_service_id === "6" && getOrderDetailData?.tnos_subservice_id === "1" ? "P1 Force" : ""}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nama Layanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getDetailTransaksi?.data?.history?.layanan?.name} {getDetailTransaksi?.data?.orders?.durasi_pengamanan} Jam
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nama Pengguna</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.name}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nomor HP Pengguna</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.phone}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nama PIC</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.nama_pic}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nomor HP PIC</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.nomor_pic}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <small style={{ color: "#7376A1" }}>Keperluan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.needs}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <small style={{ color: "#7376A1" }}>Jumlah Hari</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.durasi_pengamanan} Hari
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <small style={{ color: "#7376A1" }}>Rincian Lokasi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ifNotNull(getOrderDetailData?.location)}
                                                </p>
                                            </Col>
                                        </Row>

                                        {getJsonData && getJsonData.length > 0 ? (
                                            getJsonData.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {item.name}
                                                                </span>
                                                                {item.subsections && item.subsections.length > 0 && (
                                                                    item.subsections.map((subsection, subIndex) => {
                                                                        return (
                                                                            <div key={subIndex}>
                                                                                <span style={{ fontWeight: 'bold' }}>
                                                                                    {subsection.name}
                                                                                </span>
                                                                                {subsection.products && subsection.products.length > 0 && (
                                                                                    <>
                                                                                        {subsection.products.map((products, productsIndex) => (
                                                                                            <div key={productsIndex}>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-5">
                                                                                                        <div>
                                                                                                            {products.column}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-3">
                                                                                                        <div style={{ fontWeight: 'bold' }}>
                                                                                                            {` ( ${products.value} ${products.unit} ) `}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-md-4">
                                                                                                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                                                                            {`Rp. ${(products.harga_pwa * products.value).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <></>
                                        )}

                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <h6>&nbsp;</h6>
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>No. Invoice</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.tnos_invoice_id === null ? "-" : getOrderDetailData?.tnos_invoice_id}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>ID Transaksi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.invoice_id === null ? "-" : getOrderDetailData?.invoice_id}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>ID Referensi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.external_id === null ? "-" : getOrderDetailData?.external_id}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>ID Pemesanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.invoice_id === null ? "-" : getOrderDetailData?.id}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Waktu Transaksi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.paid_at === null ? (
                                                        <Badge bg="primary" className="badge-lg">
                                                            Menunggu Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Waktu transaksi akan muncul setelah pembayaran
                                                                        selesai
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : (
                                                        ReadableDateTime(
                                                            getOrderDetailData.paid_at,
                                                            "shortMonth"
                                                        )
                                                    )}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Waktu Pemesanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ReadableDateTime(
                                                        getOrderDetailData?.created_at,
                                                        "shortMonth"
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Status Transaksi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.payment_status === "EXPIRED" ? (
                                                        <Badge bg="danger" className="badge-lg">
                                                            Tidak Ada Invoice &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Tidak Ada Invoice, Karena Sudah Kadaluarsa
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "PAID" || getOrderDetailData?.payment_status === "SETTLED" ? (
                                                        <Badge bg="success" className="badge-lg">
                                                            Sudah Dibayar {getOrderDetailData?.payment_status === "PAID" ? "PAID" : "SETTLED"} &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Sudah Melakukan Pembayaran
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "ORDER" ? (
                                                        <Badge bg="warning" className="badge-lg">
                                                            Belum Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Sudah Memesan, Namun Belum Melakukan Pembayaran
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "UNPAID" ? (
                                                        <Badge bg="primary" className="badge-lg">
                                                            Menunggu Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        No. Invoice akan muncul setelah pemesanan dikonfirmasi
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : (
                                                        <>
                                                            {getOrderDetailData?.payment_status}
                                                        </>
                                                    )}
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Status Pemesanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.payment_status === "EXPIRED" ? (
                                                        <Badge bg="danger" className="badge-lg">
                                                            Tidak Ada Invoice &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Tidak Ada Invoice, Karena Sudah Kadaluarsa
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "PAID" || getOrderDetailData?.payment_status === "SETTLED" ? (
                                                        <Badge bg="success" className="badge-lg">
                                                            Sudah Dibayar {getOrderDetailData?.payment_status === "PAID" ? "PAID" : "SETTLED"} &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Sudah Melakukan Pembayaran
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "ORDER" ? (
                                                        <Badge bg="warning" className="badge-lg">
                                                            Belum Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Sudah Memesan, Namun Belum Melakukan Pembayaran
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : getOrderDetailData?.payment_status === "UNPAID" ? (
                                                        <Badge bg="primary" className="badge-lg">
                                                            Menunggu Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        No. Invoice akan muncul setelah pemesanan dikonfirmasi
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : (
                                                        <>
                                                            {getOrderDetailData?.payment_status}
                                                        </>
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p>
                                                    Metode Pembayaran
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.payment_status === "EXPIRED" ? (
                                                        "Tidak Ada"
                                                    ) : getOrderDetailData?.payment_status === "ORDER" ? (
                                                        <Badge bg="warning" className="badge-lg">
                                                            Belum Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Customer Sudah Memesan, Namun Belum Melakukan Pembayaran
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : !getOrderDetailData?.payment_method && !getOrderDetailData?.payment_channel ? (
                                                        <Badge bg="primary" className="badge-lg">
                                                            Menunggu Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Metode Pembayaran akan muncul setelah pembayaran selesai
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : (
                                                        <span className="fw-bold">
                                                            {`${getOrderDetailData?.payment_method} - (${getOrderDetailData?.payment_channel})`}
                                                        </span>
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p>
                                                    Total Pembayaran
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {"Rp. " + parseInt(getOrderDetailData?.order_total).toLocaleString("id-ID", {})}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p>
                                                    Security Provider
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {"IDR " + parseInt(getOrderDetailData?.order_total).toLocaleString("id-ID", {})}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p>
                                                    Technical Meeting
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {"IDR " + parseInt(getOrderDetailData?.order_total).toLocaleString("id-ID", {})}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p style={{ fontWeight: 'bold' }}>
                                                    Perusahaan
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {"IDR " + parseInt(getOrderDetailData?.order_total).toLocaleString("id-ID", {})}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <p style={{ fontWeight: 'bold' }}>
                                                    Platform
                                                </p>
                                            </Col>

                                            <Col md={6}>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {"IDR " + parseInt(getOrderDetailData?.order_total).toLocaleString("id-ID", {})}
                                                </p>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <h6>
                                            Detail Pemesanan &nbsp;
                                            &nbsp;
                                            <Link
                                                to={`/pwa-b2b/order/export-pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Badge
                                                    bg="primary"
                                                    className="badge-md"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        localStorage.setItem(
                                                            "pwaB2bExportOrderDataById",
                                                            JSON.stringify(getOrderDetailData)
                                                        );
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPrint} /> Export PDF
                                                </Badge>
                                            </Link>
                                        </h6>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Tipe Layanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.tnos_service_id === "2" && getOrderDetailData?.tnos_subservice_id === "2" ? (
                                                        "Pengamanan Usaha & Bisnis"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                                                        "Badan Hukum PT"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "2" ? (
                                                        "Badan Usaha CV"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "3" ? (
                                                        "Yayasan"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "4" ? (
                                                        "Perkumpulan"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "5" ? (
                                                        "Asosiasi"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "6" ? (
                                                        "Legalitas Lainnya"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "7" ? (
                                                        "Komprehensif Solusi Hukum"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "8" ? (
                                                        "Pembayaran Lainnya"
                                                    ) : getOrderDetailData?.tnos_service_id === "4" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                                                        "PAS"
                                                    ) : getOrderDetailData?.tnos_service_id === "5" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                                                        "TRIGER"
                                                    ) : getOrderDetailData?.tnos_service_id === "6" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                                                        "P1 Force"
                                                    ) : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "9" ? (
                                                        "Pembayaran Lainnya (Manual Order)"
                                                    ) : (
                                                        <>
                                                            &nbsp;
                                                        </>
                                                    )}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nama Pengguna</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.name}
                                                    &nbsp;
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        overlay={<Tooltip>Lihat</Tooltip>}
                                                    >
                                                        <Link
                                                            to={`/member/profile/${getOrderDetailData?.user_id}`}
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
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    ID Pemesanan
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.id}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Nama Partner</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.partner_name === null ? '-' : getOrderDetailData?.partner_name}
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}> No. Invoice </small>
                                                <br />
                                                {getOrderDetailData?.tnos_invoice_id ? (
                                                    <p style={{ fontWeight: "bold" }}>
                                                        {getOrderDetailData?.tnos_invoice_id}
                                                    </p>
                                                ) : (
                                                    <Badge bg="primary" className="badge-lg">
                                                        Memesan &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    Memesan tapi belum masuk ke pembayaran
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </Badge>
                                                )}
                                            </Col>

                                            {getOrderDetailData?.invoice_id && (
                                                (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "8") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "9") ? "" : (
                                                    <Col md={6}>
                                                        <small style={{ color: "#7376A1" }}>ID Transaksi</small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {getOrderDetailData?.invoice_id}
                                                        </p>
                                                    </Col>
                                                )
                                            )}
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    ID Referensi
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.external_id}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Waktu Pemesanan
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ReadableDateTime(
                                                        getOrderDetailData?.created_at,
                                                        "shortMonth"
                                                    )}
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Waktu Transaksi
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.paid_at === null ? (
                                                        <Badge bg="primary" className="badge-lg">
                                                            Menunggu Pembayaran &nbsp;
                                                            <OverlayTrigger
                                                                trigger={["hover", "focus"]}
                                                                overlay={
                                                                    <Tooltip>
                                                                        Waktu transaksi akan muncul setelah pembayaran
                                                                        selesai
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Badge>
                                                    ) : (
                                                        ReadableDateTime(
                                                            getOrderDetailData.paid_at,
                                                            "shortMonth"
                                                        )
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>
                                        <small style={{ color: "#7376A1" }}>Status Pemesanan</small>
                                        <p style={{ fontWeight: "bold" }}>
                                            {getOrderDetailData?.payment_status === "EXPIRED" ? (
                                                <Badge bg="danger" className="badge-lg">
                                                    Tidak Ada Invoice &nbsp;
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        overlay={
                                                            <Tooltip>
                                                                Tidak Ada Invoice, Karena Sudah Kadaluarsa
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faInfoCircle}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </OverlayTrigger>
                                                </Badge>
                                            ) : getOrderDetailData?.payment_status === "PAID" || getOrderDetailData?.payment_status === "SETTLED" ? (
                                                <Badge bg="success" className="badge-lg">
                                                    Sudah Dibayar {getOrderDetailData?.payment_status === "PAID" ? "PAID" : "SETTLED"} &nbsp;
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        overlay={
                                                            <Tooltip>
                                                                Sudah Melakukan Pembayaran
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faInfoCircle}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </OverlayTrigger>
                                                </Badge>
                                            ) : getOrderDetailData?.payment_status === "ORDER" ? (
                                                <Badge bg="warning" className="badge-lg">
                                                    Belum Pembayaran &nbsp;
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        overlay={
                                                            <Tooltip>
                                                                Sudah Memesan, Namun Belum Melakukan Pembayaran
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faInfoCircle}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </OverlayTrigger>
                                                </Badge>
                                            ) : getOrderDetailData?.payment_status === "UNPAID" ? (
                                                <Badge bg="primary" className="badge-lg">
                                                    Menunggu Pembayaran &nbsp;
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        overlay={
                                                            <Tooltip>
                                                                No. Invoice akan muncul setelah pemesanan dikonfirmasi
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faInfoCircle}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </OverlayTrigger>
                                                </Badge>
                                            ) : (
                                                <>
                                                    {getOrderDetailData?.payment_status}
                                                </>
                                            )}
                                        </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <h6>Detail Layanan</h6>
                                        <small style={{ color: "#7376A1" }}>
                                            Keperluan
                                            {getOrderDetailData?.tnos_service_id === "2" && getOrderDetailData?.tnos_subservice_id === "2" ? " Pengamanan" : ''}
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                            {getOrderDetailData?.needs ? getOrderDetailData?.needs : '-'}
                                        </p>

                                        {getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1" ? (
                                            <>
                                                <small style={{ color: "#7376A1" }}>
                                                    Jenis Badan Usaha
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ifNotNull(
                                                        getOrderDetailData?.klasifikasi,
                                                        "obj",
                                                        "label"
                                                    )}
                                                </p>
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        {getOrderDetailData?.tnos_service_id === "3" ? (
                                            <>
                                                {(getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "6") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "7") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "8") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "9") ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        <small style={{ color: "#7376A1" }}>
                                                            KTP & NPWP Seluruh{" "}
                                                            {getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1" ? "Pemegang Saham" : "Pengurus"}
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {getOrderDetailData?.file_document
                                                                ? JSON.parse(getOrderDetailData?.file_document).map(
                                                                    (item) => {
                                                                        return (
                                                                            <>
                                                                                <a
                                                                                    href={item.image_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    {item.image_url}
                                                                                </a>{" "}
                                                                                <br />
                                                                            </>
                                                                        );
                                                                    }
                                                                )
                                                                : "-"}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Nama{" "}
                                                            {(getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "2") ?
                                                                "Usaha" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "3" ? "Yayasan" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "4" ? "Perkumpulan" : ''}
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.name_badan_hukum,
                                                                "objArrCard",
                                                                "opsi"
                                                            )}
                                                        </p>
                                                    </>
                                                )}

                                                {(getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "2") ? (
                                                    <>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Modal Dasar Perusahaan (Fiktif)
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(getOrderDetailData?.modal_dasar, "curr")}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Jumlah modal yang disetor (Min.25%)
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.modal_disetor,
                                                                "curr"
                                                            )}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Susunan Pemegang Saham(Tuan/Nyonya ______ sebanyak
                                                            ___ %)
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.pemegang_saham,
                                                                "sahamCard"
                                                            )}
                                                        </p>
                                                    </>
                                                ) : (
                                                    ""
                                                )}

                                                {(getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "6") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "7") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "7") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "8") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "9") ? "" : (
                                                    <>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Susunan{" "}
                                                            {(getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "2")
                                                                ? "Direksi dan Komisaris"
                                                                : "Pengurus"}
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.susunan_direksi,
                                                                "sunderCard"
                                                            )}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Bidang Usaha KBLI 2020
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.bidang_usaha,
                                                                "bidusCard"
                                                            )}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Email{" "}
                                                            {getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1" ?
                                                                "Usaha" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "3" ? "Yayasan" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "4" ? "Perkumpulan" : ''}
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(getOrderDetailData?.email_badan_hukum)}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Nomor HP Penanggung Jawab
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(getOrderDetailData?.phone_badan_hukum)}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Domisili{" "}
                                                            {getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1" ?
                                                                "Usaha" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "3" ? "Yayasan" : getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "4" ? "Perkumpulan" : ''}
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.alamat_badan_hukum,
                                                                "address",
                                                                "dom"
                                                            )}
                                                        </p>
                                                        <small style={{ color: "#7376A1" }}>Detail Alamat</small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(
                                                                getOrderDetailData?.alamat_badan_hukum,
                                                                "address"
                                                            )}
                                                        </p>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        {(getOrderDetailData?.tnos_service_id === "2" && getOrderDetailData?.tnos_subservice_id === "2") || (getOrderDetailData?.tnos_service_id === "4" && getOrderDetailData?.tnos_subservice_id === "1") ? (
                                            <>
                                                <small style={{ color: "#7376A1" }}>Rincian Lokasi</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ifNotNull(getOrderDetailData?.location)}
                                                </p>
                                                <Row>
                                                    <Col>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Tanggal & Waktu Mulai
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ReadableDateTime(
                                                                ifNotNull(
                                                                    getOrderDetailData?.tanggal_mulai +
                                                                    " " +
                                                                    getOrderDetailData?.jam_mulai
                                                                ),
                                                                "shortMonth"
                                                            )}
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <small style={{ color: "#7376A1" }}>
                                                            Penanggung Jawab
                                                        </small>
                                                        <p style={{ fontWeight: "bold" }}>
                                                            {ifNotNull(getOrderDetailData?.nama_pic)} -{" "}
                                                            {ifNotNull(getOrderDetailData?.nomor_pic)}
                                                        </p>
                                                    </Col>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Jumlah Pengamanan
                                                    </small>
                                                    <p style={{ fontWeight: "bold" }}>
                                                        {`${ifNotNull(
                                                            getOrderDetailData?.jml_personil
                                                        )} Personel`}
                                                    </p>
                                                    <small style={{ color: "#7376A1" }}>
                                                        Durasi Pengamanan
                                                    </small>
                                                    <p style={{ fontWeight: "bold" }}>
                                                        {`${ifNotNull(
                                                            getOrderDetailData?.durasi_pengamanan
                                                        )} Jam`}
                                                    </p>
                                                    {/* <small style={{ color: "#7376A1" }}>
                                                        Durasi Pesanan
                                                    </small>
                                                    <p style={{ fontWeight: "bold" }}>
                                                        {`${ifNotNull(getOrderDetailData?.duration)} Jam`}
                                                    </p> */}
                                                </Row>
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        {getOrderDetailData?.tnos_service_id === "2" && getOrderDetailData?.tnos_subservice_id === "2" ? (
                                            ""
                                        ) : (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "1") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "2") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "3") || (getOrderDetailData?.tnos_service_id === "4" && getOrderDetailData?.tnos_subservice_id === "1") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "6") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "4") || (getOrderDetailData?.tnos_service_id === "3" && getOrderDetailData?.tnos_subservice_id === "8") ? (
                                            ""
                                        ) : (
                                            <>
                                                <small style={{ color: "#7376A1" }}>Biaya</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ifNotNull(getOrderDetailData?.order_total, "curr")}
                                                </p>
                                                <small style={{ color: "#7376A1" }}>
                                                    Dokumen Tambahan
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {getOrderDetailData?.file_document
                                                        ? JSON.parse(
                                                            getOrderDetailData?.file_document
                                                        ).map((item) => {
                                                            return (
                                                                <>
                                                                    <a
                                                                        href={item.image_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {item.image_url}
                                                                    </a>{" "}
                                                                    <br />
                                                                </>
                                                            );
                                                        })
                                                        : "-"}
                                                </p>
                                            </>
                                        )}

                                        <h6>Detail Pembayaran</h6>

                                        <Row>
                                            <Col>
                                                <small style={{ color: "#7376A1" }}>
                                                    Status Transaksi
                                                </small>
                                            </Col>
                                            <Col className="text-end">
                                                {getOrderDetailData?.payment_status === "EXPIRED" ? (
                                                    <Badge bg="danger" className="badge-lg">
                                                        Tidak Ada Invoice &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    Tidak Ada Invoice, Karena Sudah Kadaluarsa
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </Badge>
                                                ) : getOrderDetailData?.payment_status === "PAID" || getOrderDetailData?.payment_status === "SETTLED" ? (
                                                    <Badge bg="success" className="badge-lg">
                                                        Sudah Dibayar {getOrderDetailData?.payment_status === "PAID" ? "PAID" : "SETTLED"} &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    Sudah Melakukan Pembayaran
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </Badge>
                                                ) : getOrderDetailData?.payment_status === "ORDER" ? (
                                                    <Badge bg="warning" className="badge-lg">
                                                        Belum Pembayaran &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    Sudah Memesan, Namun Belum Melakukan Pembayaran
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </Badge>
                                                ) : getOrderDetailData?.payment_status === "UNPAID" ? (
                                                    <Badge bg="primary" className="badge-lg">
                                                        Menunggu Pembayaran &nbsp;
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            overlay={
                                                                <Tooltip>
                                                                    No. Invoice akan muncul setelah pemesanan dikonfirmasi
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faInfoCircle}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </OverlayTrigger>
                                                    </Badge>
                                                ) : (
                                                    <>
                                                        {getOrderDetailData?.payment_status}
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row >
    )

}