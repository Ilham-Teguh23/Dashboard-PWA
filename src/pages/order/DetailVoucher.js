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

export default () => {
    const { id } = useParams();
    const [getOrderData, setOrderData] = useState();

    const calcAmount = (amount, times = true) => {
        const am = times ? amount * 10000 : amount;
        return "IDR " + am.toLocaleString("id-ID", {});
    }
    
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

    const fetchData = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
    
            const memberListRes = await fetch(
                `${process.env.REACT_APP_PORTAL_API_URL}/member/list`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: "" }),
                }
            );
            const memberListData = await memberListRes.json();
            
            if (data.success === true) {
                const datas = data.point_histories;
    
                const member = memberListData?.data.find(
                    (item) => item.mmbr_code === datas.user_id
                );
    
                if (member) {
                    datas.mmbr_name = member.mmbr_name;
                }
    
                setOrderData({
                    "Detail Voucher": {
                        Id: datas.id,
                        "ID Saldo Voucher Pembayaran": datas.tsaldo_point_payment_id,
                        "ID Pengguna": iconLink(
                            datas.user_id,
                            `/member/profile/${datas.user_id}`
                        ),
                        "Nama Pengguna": datas.mmbr_name || "Tidak Diketahui",
                        "Voucher Masuk": calcAmount(datas.in_point),
                        "Voucher Keluar": calcAmount(datas.out_point),
                        "Voucher Sebelumnya": calcAmount(datas.before_point),
                        "Sisa Voucher": calcAmount(datas.point),
                        "Tanggal Dibuat": datas.created_at,
                        "Tanggal Diupdate": datas.updated_at,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    useEffect(() => {
        fetchData()
    }, [id]);

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
                    <Breadcrumb.Item href="/pwa-b2b/transaction">Voucher</Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Voucher</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row className="detail-list">
                                <Col md={6}>
                                    {getOrderData &&
                                        Object.entries(getOrderData).map(
                                            ([groupName, groupObject]) => (
                                                <div>
                                                    <h6 key={groupName}>{groupName}</h6>
                                                    {Object.entries(groupObject).map(([key, value]) => (
                                                        <span key={key}>
                                                            <small>{key}</small>
                                                            <p>{!value ? "-" : value}</p>
                                                        </span>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
