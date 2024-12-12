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
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReadableDateTime from "../../components/ReadableDateTime";

export default () => {
    const { id } = useParams();
    const [getLeftOrderData, setLeftOrderData] = useState();
    const [getRightOrderData, setRightOrderData] = useState();

    // Calc Amount Func
    const calcAmount = (amount, times = true) => {
        const am = times ? amount * 10000 : amount;
        return "IDR " + am.toLocaleString("id-ID", {});
    };
    // Order Status Text Func
    const orderText = (code) => {
        if (code === "001") {
            return "Menunggu";
        } else if (code === "010") {
            return "Selesai";
        } else if (code === "011") {
            return "Gagal";
        }
    };
    // Icon Link Func
    const iconLink = (value, url) => {
        return (
            <>
                {value} &nbsp;
                <OverlayTrigger
                    trigger={["hover", "focus"]}
                    overlay={<Tooltip>Lihat</Tooltip>}
                >
                    <Link
                        to={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </Link>
                </OverlayTrigger>
            </>
        );
    };

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/payment-voucher/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success === true) {
                    const datas = data.payment;
                    const customerDatas = datas.customer
                        ? JSON.parse(datas.customer)
                        : "-";

                    setLeftOrderData({
                        "Data Voucher": {
                            Id: datas.id,
                            "Id Saldo Invoice": datas.tsaldo_invoice_id,
                            "Id External": datas.external_id,
                            "Id Invoice": datas.invoice_id,
                            Deskripsi: datas.description,
                            "Tanggal Dibuat": ReadableDateTime(datas.created_at),
                            "Tanggal Diupdate": ReadableDateTime(datas.updated_at),
                        },
                        "Data Pengguna": {
                            Nama: customerDatas.gives_name,
                            Email: customerDatas.email,
                            Hp: customerDatas.mobile_number,
                        },
                    });
                    setRightOrderData({
                        "Detail Voucher": {
                            "Id Pengguna": iconLink(
                                datas.user_id,
                                `/member/profile/${datas.user_id}`
                            ),
                            "Status Pemesanan": orderText(datas.status_order),
                            "Status Pembayaran": datas.payment_status,
                            "Metode Pembayaran": `${datas.payment_method} (${datas.payment_channel})`,
                            Jumlah: calcAmount(datas.amount, false),
                            "Jumlah Terbayar": calcAmount(datas.paid_amount, false),
                            "Tanggal Dibayar": ReadableDateTime(datas.paid_at),
                            "Tanggal Kadaluarsa": datas.expiry_date,
                        },
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    return (
        <>
            <Row>
                <Preloader
                    show={!getLeftOrderData && !getRightOrderData ? true : false}
                />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/pwa-b2b/transaction">Voucher</Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Voucher</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row className="detail-list">
                                {[getLeftOrderData, getRightOrderData].map((label) => (
                                    <Col md={6}>
                                        {label &&
                                            Object.entries(label).map(([groupName, groupObject]) => (
                                                <div>
                                                    <h6 key={groupName}>{groupName}</h6>
                                                    {Object.entries(groupObject).map(([key, value]) => (
                                                        <span key={key}>
                                                            <small>{key}</small>
                                                            <p>{!value ? "-" : value}</p>
                                                        </span>
                                                    ))}
                                                </div>
                                            ))}
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
