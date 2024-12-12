import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Button, Badge, Breadcrumb, Form, Row, InputGroup, OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faHome, faInfoCircle, faSearch, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import MyModal from "../../components/MyModal";
import Preloader from "../../components/Preloader";

const Section = () => {

    const [getLoadingData, setLoadingData] = useState(false)
    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState(0)

    const [getUnit, setUnit] = useState([]);
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    );
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isTable, setTable] = useState(null);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axios({
                    url: `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit/${id}`,
                    method: "DELETE"
                }).then((response) => {
                    fetchData();
                    Swal.fire(
                        'Berhasil!',
                        'Data telah berhasil dihapus.',
                        'success'
                    );
                }).catch((error) => {
                    console.error('Error deleting data:', error);
                    Swal.fire(
                        'Gagal!',
                        error,
                        'error'
                    );
                })
            } catch (error) {
                console.error('Error deleting data:', error);
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data.',
                    'error'
                );
            }
        }
    };

    const handleChangeStatus = async (id) => {
        const result = await Swal.fire({
            title: 'Anda yakin?',
            text: "Apakah Ingin Merubah Status Dari Data Komponen Ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, rubah!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axios({
                    url: `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit/${id}/change-status`,
                    method: "PUT"
                }).then((response) => {
                    fetchData();
                    Swal.fire(
                        'Berhasil!',
                        'Status Berhasil di Rubah',
                        'success'
                    );
                }).catch((error) => {
                    Swal.fire(
                        'Gagal!',
                        error,
                        'error'
                    );
                })
            } catch (error) {
                console.error('Error deleting data:', error);
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data.',
                    'error'
                );
            }
        }
    };

    const handleShow = (id = null, table = null) => {
        setSelectedId(id);
        setTable(table)
        setIsEditing(!!id);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedId(null);
        setTable(null);
        setIsEditing(false);
    };

    const searchInputRef = useRef(null);

    const [getFilterTest] = useState([
        {
            key: "key_status_0",
            value: 1,
            defaultValue: "Real",
        },
        {
            key: "key_status_1",
            value: 2,
            defaultValue: "Testing"
        }
    ]);

    const [getStatus] = useState([
        {
            key: "status_0",
            value: 0,
            defaultValue: "Semua Status",
        },
        {
            key: "status_1",
            value: 1,
            defaultValue: "Aktif",
        },
        {
            key: "status_2",
            value: 2,
            defaultValue: "Tidak Aktif",
        }
    ]);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setUnit([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.satuan && item.satuan.toLowerCase().includes(searchTerm))
            );
        });

        setUnit(filteredData);
    };

    const TableRow = ({ num, satuan, slug, status, id }) => (
        <tr>
            <td className="text-center">{num}.</td>
            <td className="text-center">{satuan || '-'}</td>
            <td className="text-center">{slug}</td>
            <td className="text-center">
                <Badge bg={status === 1 ? "success" : "danger"} className="badge-lg">
                    {status === 1 ? "Aktif " : "Tidak Aktif "}
                    <OverlayTrigger
                        trigger={["hover", "focus"]}
                        overlay={
                            <Tooltip>
                                {status === 1 ? "Komponen ini aktif" : "Komponen ini tidak aktif"}
                            </Tooltip>
                        }
                    >
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            style={{ cursor: "pointer" }}
                        />
                    </OverlayTrigger>
                </Badge>
            </td>
            <td className="text-center">
                <Button variant={status === 1 ? "danger" : "success"} size="sm" onClick={() => handleChangeStatus(id)} style={{ marginRight: '5px' }}>
                    <FontAwesomeIcon icon={status === 1 ? faTimes : faCheck} /> {status === 1 ? "Non - Aktifkan" : "Aktifkan"}
                </Button>
                <Button variant="warning" size="sm" onClick={() => handleShow(`${id}`, 'unit')} className="text-white" style={{ marginRight: '5px' }} >
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </td>
        </tr>
    );

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = Array.isArray(data.data.unit) ? data.data.unit : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item => !item.satuan.includes("User") && !item.satuan.includes("test") && !item.satuan.includes("Test"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter(item => item.satuan.includes("User") || item.satuan.includes("test"));
            }

            if (selectedStatus === 0) {
                filteredData = filteredData;
            } else if (selectedStatus === 1) {
                filteredData = filteredData.filter(item => item.status === 1);
            } else if (selectedStatus === 2) {
                filteredData = filteredData.filter(item => item.status === 0);
            }

            setOriginalData(filteredData);
            setLoadingData(true)
            setUnit(filteredData);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
            setMessageEmptyData("Error fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFilter, selectedStatus]);

    return (
        <>
            <Preloader show={!getLoadingData ? true : false} />
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <div className="d-block mb-4 mb-xl-0">
                    <Breadcrumb
                        className="d-none d-md-inline-block"
                        listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
                    >
                        <Breadcrumb.Item href="/">
                            <FontAwesomeIcon icon={faHome} />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Unit</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Satuan Unit</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Satuan Unit"
                                                id="all_search"
                                                ref={searchInputRef}
                                            />
                                            <Button variant="primary" onClick={handleSearch} >
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={2}>
                                <Form.Group id="filter_test">
                                    <Form.Label>Filter</Form.Label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(parseInt(e.target.value))}
                                        required
                                    >
                                        {getFilterTest?.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group id="transaction_status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                    >
                                        {getStatus?.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <TnosDataTable
                            getExportData={getUnit}
                            getMenu={`pwa-b2b-unit`}
                            data={
                                <>
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Satuan</th>
                                            <th className="border-0 text-center">Slug</th>
                                            <th className="border-0 text-center">Status</th>
                                            <th className="border-0 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getUnit.length > 0 ? (
                                            getUnit.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    num={index + 1}
                                                    {...td}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={8}>{getMessageEmptyData}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            }
                        />
                    </Card.Body>
                </Card>
            </Col>

            <MyModal show={showModal} handleClose={handleClose} isTable={isTable} id={selectedId} isEditing={isEditing} />
        </>
    );


};

export default Section;
