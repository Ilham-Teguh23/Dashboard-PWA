import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const MyModalTAB = ({ show, handleClose, id, isEditing, isTable }) => {
    const location = useLocation();

    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataObj = { ...formData };

        let apiUrl = "";
        if (location.pathname.includes("/tab/banner")) {
            apiUrl = `${process.env.REACT_APP_TAB_MODULE}/banner/create`;
            dataObj['uri'] = "https://api-tab.tnos.app/" + dataObj['uri']
        } else {
            apiUrl = `${process.env.REACT_APP_API_TAB_ORGANISASI}/paket/kategori/create`;
        }

        try {
            if (isEditing) {
                await axios.put(`${apiUrl}/${id}`, dataObj, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        handleClose();
                        toast.success("Data Berhasil di Simpan");
                    } else {
                        handleClose();
                        toast.error(response.data.message);
                    }
                }).catch((error) => {
                    toast.error(error.message);
                });
            } else {
                await axios.post(apiUrl, dataObj, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    
                    if (location.pathname.includes("/tab/banner")) {
                        if (response.data.message === "success") {
                            handleClose();
                            toast.success("Data Berhasil di Tambahkan");
                        } else {
                            handleClose();
                            toast.error(response.data.message);       
                        }
                    } else {
                        if (response.data.status === true) {
                            handleClose();
                            toast.success("Data Berhasil di Tambahkan");
                        } else {
                            handleClose();
                            toast.error(response.data.message);
                        }
                    }

                }).catch((error) => {
                    toast.error(error.message);
                });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengirim data: " + error.message);
        }
    };

    useEffect(() => {
        if (id) {
            const fetchDataById = async () => {
                try {
                    let response = null;
                    const apiBaseUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/dashboard/pwa-revamp`;

                    if (isTable === "provider") {
                        response = await axios.get(`${apiBaseUrl}/provider/${id}`);
                    } else if (isTable === "layanan") {
                        response = await axios.get(`${apiBaseUrl}/layanan/${id}/show`);
                    } else if (isTable === "section") {
                        response = await axios.get(`${apiBaseUrl}/section/${id}/show`);
                    } else if (isTable === "product") {
                        response = await axios.get(`${apiBaseUrl}/product/${id}/show`);
                    } else if (isTable === "subsection") {
                        response = await axios.get(`${apiBaseUrl}/subsection/${id}/show`);
                    }

                    if (response) {
                        setFormData(response.data.data);
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengambil data.");
                }
            };

            fetchDataById();
        }
    }, [id, isTable]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Edit Data" : "Tambah Data"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} method="POST">
                    {location.pathname.includes("/tab/banner") ? (
                        <>
                            <div className="mb-3">
                                <label htmlFor="banner_name" className="form-label">
                                    Nama Banner
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="banner_name"
                                    name="banner_name"
                                    placeholder="Masukkan Nama Banner"
                                    value={formData.banner_name || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="uri" className="form-label">
                                    URI
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="uri"
                                    name="uri"
                                    placeholder="Masukkan URI"
                                    value={formData.uri || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="uri_link" className="form-label">
                                    URI Link
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="uri_link"
                                    name="uri_link"
                                    placeholder="Masukkan URI Link"
                                    value={formData.uri_link || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <label htmlFor="nama" className="form-label">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nama"
                                    name="nama"
                                    placeholder="Masukkan Nama"
                                    value={formData.nama || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="code" className="form-label">
                                    Kode
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    name="code"
                                    placeholder="Masukkan Kode"
                                    value={formData.code || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nilai_x" className="form-label">
                                    Nilai X
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nilai_x"
                                    name="nilai_x"
                                    placeholder="Masukkan Nilai Faktor Resiko"
                                    value={formData.nilai_x || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="reset" size="sm" variant="danger" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} /> Batal
                </Button>
                <Button type="submit" size="sm" variant="success" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyModalTAB;
