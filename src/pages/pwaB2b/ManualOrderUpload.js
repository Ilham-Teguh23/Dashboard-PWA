import { Button, Card, Col, Form, Row } from "@themesberg/react-bootstrap"
import React, { useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useLocation } from "react-router-dom"

export default () => {

    const location = useLocation()
    const id = location.pathname.split("/")[3]
    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = new FormData()

        data.append("id", id)
        data.append("file_document", file)

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/manual-order/upload-bukti-bayar`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data.status === true) {
                Swal.fire('Berhasil!', response.data.message, 'success')
            }
        } catch (error) {
            console.error("Gagal mengirim data:", error);
        }
    }

    return (
        <>
            <Row>
                <Col md={6}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="mb-4">Upload Bukti Bayar</h5>
                            <Form onSubmit={handleSubmit}>

                                <Form.Label>Bukti Pembayaran</Form.Label>
                                <Form.Control
                                    className={`border`}
                                    required
                                    type="file"
                                    name="file_document"
                                    onChange={handleFileChange}
                                />

                                <div className="mt-3">
                                    <Button variant="primary" type="submit">
                                        Simpan
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )

}