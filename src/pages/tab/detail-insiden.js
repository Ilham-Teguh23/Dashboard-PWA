import { Card, Col, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

export default () => {

    const location = useLocation()
    const id_panic = location.pathname.split("/")[4];
    const [getInsidenData, setInsidenData] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [alamat, setAlamat] = useState("");

    const fetchData = async () => {

        const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/panic_report/${id_panic}/show`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setInsidenData(data.data);

        if (data.data.lokasi) {
            const lokasi = JSON.parse(data.data.lokasi);
            setCoordinates({ latitude: lokasi.latitude, longitude: lokasi.longitude });

            // Panggil Geocoding API untuk mendapatkan alamat
            geocodeLatLng(lokasi.latitude, lokasi.longitude);
        }
    }

    const geocodeLatLng = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setAlamat(results[0].formatted_address); // Simpan alamat ke state
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    };

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: coordinates.latitude, lng: coordinates.longitude },
                zoom: 12,
            });

            new window.google.maps.Marker({
                position: { lat: coordinates.latitude, lng: coordinates.longitude },
                map,
                title: "Lokasi Insiden"
            });
        }

        if (coordinates.latitude && coordinates.longitude) {
            if (window.google && window.google.maps) {
                initMap();
            } else {
                window.initMap = initMap;
            }
        }
    }, [coordinates, alamat]);

    return (
        <Col xl={12} className="mt-2">
            <Card border="light">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6>
                                Detail Insiden
                            </h6>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nama
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getInsidenData?.name}
                                    </p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nomor HP
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getInsidenData?.phone_number == null ? "-" : getInsidenData?.phone_number}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Status
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getInsidenData?.status === "W" ? "Menunggu" : getInsidenData?.status === "P" ? "Sedang Ditangani" : getInsidenData?.status === "D" ? "Selesai" : "-"}

                                    </p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nama Responder
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getInsidenData?.responder_name == null ? "-" : getInsidenData?.responder_name}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <small style={{ color: "#7376A1" }}>
                                        Nomor HP Responder
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {getInsidenData?.phone_number_responder == null ? "-" : getInsidenData?.phone_number_responder}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <h6>
                                Detail Lokasi
                            </h6>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <small style={{ color: "#7376A1" }}>
                                        Alamat
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                        {alamat}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <hr />

                    <h6>
                        Detail Maps Kejadian
                    </h6>
                    <Row>
                        <Col md={12}>
                            <div id="map" style={{ width: '100%', height: '400px' }}></div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}
