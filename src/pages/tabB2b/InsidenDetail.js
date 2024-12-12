import React, { useState, useEffect } from "react";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { useLocation } from "react-router-dom";

export default () => {
    const [getDetailData, setDetailData] = useState();

    const location = useLocation()
    const id_panic = location.pathname.split("/")[3];
    const [coordinates, setCoordinates] = useState({});
    const [alamat, setAlamat] = useState("");

    useEffect(() => {
        const fetchDetailData = () => {
            fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/panic_report/${id_panic}/show`)
                .then((res) => res.json())
                .then((response) => {

                    setDetailData(response.data)

                    if (response.data.lokasi) {
                        const lokasi = JSON.parse(response.data.lokasi);
                        setCoordinates({ latitude: lokasi.latitude, longitude: lokasi.longitude });

                        geocodeLatLng(lokasi.latitude, lokasi.longitude);
                    }

                }).catch((error) => {
                    console.log("Error Fetching Data " + error);
                });
        }

        fetchDetailData();
    }, [])

    const geocodeLatLng = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setAlamat(results[0].formatted_address)
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    };

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
        <>
            <Row>
                <Preloader show={!getDetailData ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-darktransaksi breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/tab-b2b/insiden">
                        Daftar Insiden
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active style={{ color: 'black' }}>Detail Panic</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6>
                                        Detail Panic
                                    </h6>
                                    <Row className="mt-3">
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getDetailData?.name}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nomor HP</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getDetailData?.phone_number}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Tanggal, Jam</small>
                                            <p style={{ fontWeight: "bold" }}>{getDetailData?.tanggal} | {getDetailData?.jam} </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Status</small>
                                            <p style={{ fontWeight: "bold" }}>{getDetailData?.status}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nama Responder</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getDetailData?.responder_name}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>Nomor HP Responder</small>
                                            <p style={{ fontWeight: "bold" }}>
                                                {getDetailData?.phone_number_responder}
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
            </Row>
        </>
    );
};
