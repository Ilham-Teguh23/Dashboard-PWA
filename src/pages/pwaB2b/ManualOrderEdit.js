import { Button, Card, Col, Form, Row } from "@themesberg/react-bootstrap"
import React, { useEffect, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import axios from "axios"
import Swal from "sweetalert2";
import { logDOM } from "@testing-library/react";
import { useLocation } from "react-router-dom";

export default () => {

    const location = useLocation()
    const id = location.pathname.split("/")[3];

    const initialData = {
        tnos_service_id: "3",
        tnos_subservice_id: "9",
        order_total: 0,
        needs: "",
        user_id: "",
        name: "",
        email: "",
        phone: "",
        file_document: "",
        ketentuan_cek: false,
        created_at: "",
        paid_at: "",
        payment_channel: ""
    }

    const [formData, setFormData] = useState(initialData)

    const [getMetodePembayaran] = useState([
        {
            key: "status_1",
            value: "BNI",
            defaultValue: "BANK_TRANSFER - BNI",
        },
        {
            key: "status_2",
            value: "BCA",
            defaultValue: "BANK_TRANSFER - BCA",
        },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/manual-order/in-order-manual/${id}`,
                formData
            )

            if (response.data.status === true) {
                Swal.fire(
                    'Berhasil!',
                    `${response.data.message}`,
                    'success'
                );
            }

        } catch (error) {
            console.error("Gagal mengirim data:", error);
        }
    }

    const fetchData = async () => {
        try {

            const response = await axios.get(
                `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/manual-order/in-order-manual/${id}/show`
            )
            
            if (response.data.status === true) {
                setFormData(response.data.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    return (
        <>
            <Card border="light" className="bg-white shadow-sm mb-4">
                <Card.Body>
                    <h5 className="mb-4">Edit Manual Order</h5>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>Kode Member</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="text"
                                    name="user_id"
                                    placeholder="Masukkan Kode Member"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="Masukkan Nama"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Biaya</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="text"
                                    name="order_total"
                                    placeholder="Masukkan Biaya"
                                    value={formData.order_total}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="text"
                                    name="email"
                                    placeholder="Masukkan Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Nomor Handphone</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="text"
                                    name="phone"
                                    placeholder="Masukkan Nomor Handphone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>Tanggal Buat Transaksi</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="datetime-local"
                                    name="created_at"
                                    value={formData.created_at}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Tanggal Selesai Transaksi</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="datetime-local"
                                    name="paid_at"
                                    value={formData.paid_at}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Metode Pembayaran</Form.Label>
                                <Form.Select
                                    name="payment_channel"
                                    value={formData.payment_channel || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            payment_channel: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">- Pilih -</option>
                                    {getMetodePembayaran?.map((item) => (
                                        <option key={item.key} value={item.value}>
                                            {item.defaultValue}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        <Form.Label>Keperluan</Form.Label>
                        <Form.Control
                            className={`border`}
                            required
                            type="text"
                            name="needs"
                            placeholder="Masukkan Keperluan"
                            as="textarea"
                            rows={3}
                            value={formData.needs}
                            onChange={handleChange}
                        />

                        <div className="mt-3">
                            <Button variant="primary" type="submit">
                                Simpan
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )

}