import React, { useState, useEffect } from "react";
import {
    Breadcrumb,
    Col,
    Row,
    Card
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { useLocation } from "react-router-dom";

export default () => {
    const [getTransactionDetailData, setTransactionDetailData] = useState();

    const location = useLocation()
    const id_bisnis_category = location.pathname.split("/")[3];

    useEffect(() => {
        const fetchDetailData = () => {
            fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/paket/kategori/${id_bisnis_category}/show`)
                .then((res) => res.json())
                .then((response) => {

                    console.log("Ada");
                    console.log(response);
                    
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
                    <Breadcrumb.Item href="/tab/kategori-usaha">
                        Master Kategori Usaha
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Kategori Usaha</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={7}>
                                    <h6>
                                        Detail Data
                                    </h6>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama</small>
                                            <p style={{ fontWeight: "bold" }}>{getTransactionDetailData?.nama}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <small style={{ color: "#7376A1" }}>Nilai Faktor Resiko</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.nilai_x}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>ID Bisnis Category</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getTransactionDetailData?.id_bisnis_category}
                                            </p>
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
