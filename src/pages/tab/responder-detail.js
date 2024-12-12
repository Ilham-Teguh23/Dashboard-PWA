import { Card, Col, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export default () => {

    const location = useLocation()
    const id_responder = location.pathname.split("/")[3];
    const [getResponder, setResponder] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [alamat, setAlamat] = useState("");

    const fetchData = async () => {

        const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/responder/${id_responder}/show`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data.data);
        
        setResponder(data.data);
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Col xl={12} className="mt-2">
            <Card border="light">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6>
                                Detail Responder
                            </h6>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nama
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getResponder?.name}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Email
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getResponder?.email}
                                    </p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nomor HP
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getResponder?.country_code}{getResponder?.phone_number == null ? "-" : getResponder?.phone_number}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nama Organisasi
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getResponder?.detailOrganisasi?.nama ? getResponder?.detailOrganisasi?.nama : "-"}

                                    </p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={12}>
                                    <small style={{ color: "#7376A1" }}>
                                        Waktu Registrasi
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getResponder?.register_at}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}
