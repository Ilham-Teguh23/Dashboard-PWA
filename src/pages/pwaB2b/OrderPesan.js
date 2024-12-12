import { faCheck, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Form, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReadableDateTime from "../../components/ReadableDateTime";
import { useLocation } from "react-router-dom";
import { is } from "date-fns/locale";

export default () => {
    const currentURL = window.location.href;
    const orderId = currentURL.split("/").slice(-2, -1)[0];

    const [kondisi, setKondisi] = useState("");
    const [catatan, setCatatan] = useState("");
    const [orderData, setOrderData] = useState(null);

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

    const location = orderData?.alamat_badan_hukum;

    function createGoogleMapsLink(location) {
        const mapsURL = `https://www.google.com/maps/place/${encodeURIComponent(
            location
        )}`;

        // Mengembalikan URL
        return mapsURL;
    }

    const googleMapsLink = createGoogleMapsLink(location);

    const handleOrderStatusChange = (id) => (event) => {
        const selectedOrderStatus = event.target.value;
        const selectedOrderStatusData = getOrderStatusArr.find(
            (status) => status.value === parseInt(selectedOrderStatus)
        );

        Swal.fire({
            title: "Konfirmasi",
            html: `<p>Apakah anda yakin ingin mengubah status menjadi <br> <strong>${selectedOrderStatusData.defaultValue}</strong> ?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
        })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(
                        `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/pemesanan/${id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                status_order: selectedOrderStatusData.us,
                            }),
                        }
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.status == true) {
                                Swal.fire(
                                    "Success!", 
                                    data.message, 
                                    "success"
                                ).then((dataConfirmed) => {
                                    if (dataConfirmed.isConfirmed) {
                                        window.location.reload()
                                    }
                                })
                            }
                        })
                        .catch((err) => {
                            Swal.fire("Error!", err, "error");
                        });
                }
            })
            .catch((error) => {
                Swal.fire("Error!", error, "error");
            });
    };

    const [getOrderStatusArr] = useState([
        {
            key: "order_status_2",
            value: 2,
            defaultValue: "Order diproses",
            us: "002",
            desc: "Admin sedang memproses order",
            color: "primary",
        },
        {
            key: "order_status_3",
            value: 3,
            defaultValue: "Siap Bertugas",
            us: "003",
            desc: "Mitra telah tersedia",
            color: "primary",
        },
        {
            key: "order_status_4",
            value: 4,
            defaultValue: "Menuju Lokasi",
            us: "004",
            desc: "Mitra sedang menuju lokasi",
            color: "primary",
        },
        {
            key: "order_status_5",
            value: 5,
            defaultValue: "Hadir dan Sedang Bertugas",
            us: "005",
            desc: "Mitra telah hadir di lokasi",
            color: "primary",
        },
    ]);

    const handleSubmit = async () => {
        if (!kondisi) {
            alert("Pilih kondisi terlebih dahulu!");
            return;
        }

        let valueKondisi = ""
        if (kondisi === "red") {
            valueKondisi = "merah"
        } else if (kondisi === "yellow") {
            valueKondisi = "kuning"
        } else if (kondisi === "green") {
            valueKondisi = "hijau"
        }

        Swal.fire({
            title: "Konfirmasi",
            html: `<p>Apakah anda yakin pengamanan telah selesai ?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
        })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(
                        `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/pemesanan/${orderData?.id}/laporan`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ valueKondisi, catatan }),
                        }
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.status == true) {
                                Swal.fire(
                                    "Success!", 
                                    data.message, 
                                    "success"
                                ).then((resultConfirmed) => {
                                    if (resultConfirmed.isConfirmed) {
                                        window.location.reload()
                                    }
                                })
                            }
                        })
                        .catch((err) => {
                            Swal.fire("Error!", err, "error");
                        });
                }
            })
            .catch((error) => {
                Swal.fire("Error!", error, "error");
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/pemesanan/${orderId}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Data Tidak Ada",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/";
                        }
                    });
                } else if (response.status === true) {
                    setOrderData(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="container-fluid">
            <Col xs={12} xl={12} style={{ marginTop: "30px" }}>
                <Card border="light" className="bg-white shadow-sm mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <h6>Detail Pemesanan &nbsp;</h6>
                                <Row>
                                    <Col md={6}>
                                        <small style={{ color: "#7376A1" }}> No. Invoice </small>
                                        <p style={{ fontWeight: "bold" }}>
                                            {orderData?.tnos_invoice_id}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>ID Referensi</small>
                                        <p style={{ fontWeight: "bold" }}>{orderData?.external_id}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>Keperluan Pengamanan</small>
                                        <p style={{ fontWeight: "bold" }}>{orderData?.needs}</p>
                                    </Col>
                                </Row>
                                {orderData?.tnos_service_id === "3" && orderData?.tnos_subservice_id === "8" ? (
                                    ""
                                ) : (
                                    <>
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Rincian Lokasi |
                                                    <a
                                                        href={googleMapsLink}
                                                        target="_blank"
                                                        style={{ color: "#1a0dab", marginLeft: "5px" }}
                                                    >
                                                        <u>Lihat Map</u>
                                                    </a>
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ifNotNull(orderData?.location)}
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>
                                                    Tanggal & Waktu Mulai
                                                </small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {ReadableDateTime(
                                                        ifNotNull(
                                                            orderData?.tanggal_mulai + " " + orderData?.jam_mulai
                                                        ),
                                                        "shortMonth"
                                                    )}
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <small style={{ color: "#7376A1" }}>Jumlah Pengamanan</small>
                                                <p style={{ fontWeight: "bold" }}>
                                                    {`${ifNotNull(orderData?.jml_personil)} Personel`}
                                                </p>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Col>
                            <Col md={6} className="mb-3">
                                <h6>Laporan Pengamanan &nbsp;</h6>

                                <Row>
                                    <Col md={12}>
                                        <small style={{ color: "#7376A1", fontWeight: 'bold' }}>
                                            {orderData?.status_order === "005" ? "Status Pengamanan" : "Silahkan Ubah Status Pemesanan"}
                                        </small>
                                        {orderData?.status_order === "010" ? (
                                            <p style={{ fontWeight: "bold" }}>
                                                Selesai
                                            </p>
                                        ) : orderData?.status_order === "005" ? (
                                            <p style={{ fontWeight: "bold" }}>
                                                Hadir dan Sedang Bertugas
                                            </p>
                                        ) : (
                                            <Form.Select
                                                value={
                                                    getOrderStatusArr.find((status) => status.us === orderData?.status_order)?.value || ""
                                                }
                                                size="sm"
                                                onChange={handleOrderStatusChange(orderData?.id)}
                                                style={{ width: "250px" }}
                                            >
                                                <option value="">- Pilih -</option>
                                                {getOrderStatusArr
                                                    .filter((status) => status.us >= orderData?.status_order) // Filter out previous statuses
                                                    .map((status) => (
                                                        <option key={status.key} value={status.value}>
                                                            {status.defaultValue}
                                                        </option>
                                                    ))}
                                            </Form.Select>
                                        )}
                                    </Col>
                                </Row>

                                {orderData?.status_order === "005" && (
                                    <>
                                        <Row>
                                            <Col md={12}>
                                                <small style={{ color: "#7376A1" }}>Kondisi Saat Pengamanan</small>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    {["red", "yellow", "green"].map((color) => (
                                                        <div key={color} style={{ display: "flex", alignItems: "center" }}>
                                                            <div
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    backgroundColor: color,
                                                                    marginRight: "10px",
                                                                }}
                                                            ></div>
                                                            <Form.Check
                                                                type="radio"
                                                                name="color"
                                                                id={color}
                                                                label={color.charAt(0).toUpperCase() + color.slice(1)}
                                                                value={color}
                                                                onChange={(e) => setKondisi(e.target.value)}
                                                                checked={kondisi === color}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Col>
                                            <Col md={12} className="mt-3">
                                                <small style={{ color: "#7376A1" }}>Catatan (Jika Ada)</small>
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Masukkan Catatan Kondisi Saat Pengamanan (Jika Ada)"
                                                    rows={4}
                                                    value={catatan}
                                                    onChange={(e) => setCatatan(e.target.value)}
                                                />
                                            </Col>
                                            <Col md={12} className="mt-2">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={handleSubmit}
                                                >
                                                    <FontAwesomeIcon icon={faSave} style={{ marginRight: '3px' }} /> Selesai
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    );
};
