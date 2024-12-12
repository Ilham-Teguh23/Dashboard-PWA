import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Button, Breadcrumb, Row, Form, InputGroup } from "@themesberg/react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHome, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import MyModal from "../../components/MyModal";

const SubSection = () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);

    const location = useLocation();
    const layanan_id = location.pathname.split("/")[3]

    const [getSubSection, setSubSection] = useState([]);
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
                    url: `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/subsection/${id}`,
                    method: "DELETE"
                }).then((response) => {
                    console.log(response);
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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setSubSection([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setSubSection(filteredData);
    };

    const TableRow = ({ num, name, slug, sections, id }) => (
        <tr>
            <td className="text-center">{num}.</td>
            <td className="text-center">{sections.name || '-'}</td>
            <td className="text-center">{name}</td>
            <td className="text-center">{slug}</td>
            <td className="text-center">
                <Button variant="warning" size="sm" onClick={() => handleShow(`${id}`, 'subsection')} className="text-white" style={{ marginRight: '5px' }} >
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Link to={`/pwa-b2b/section/` + id + "/product-sub-section"} target="_blank" rel="noopener noreferrer" style={{ marginRight: '5px' }}>
                    <Button variant="success" size="sm" className="text-white">
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </td>
        </tr>
    );

    const fetchData = async () => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/subsection/${layanan_id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = Array.isArray(data.data.subsection) ? data.data.subsection : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item => item.name != null && !item.name.includes("User") && !item.name.includes("test") && !item.name.includes("Test"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter(item => !item.name || item.name.includes("User") || item.name.includes("test"));
            }

            setOriginalData(filteredData);
            setSubSection(filteredData);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
            setMessageEmptyData("Error fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFilter]);

    return (
        <>
            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <div className="d-block mb-4 mb-xl-0">
                    <Breadcrumb
                        className="d-none d-md-inline-block"
                        listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
                    >
                        <Breadcrumb.Item href="/">
                            <FontAwesomeIcon icon={faHome} />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/pwa-b2b/security-provider">
                            Security Provider
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/pwa-b2b/security-provider">
                            Layanan
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Section</Breadcrumb.Item>
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
                                        <Form.Label>Cari Nama Sub Section</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Nama Sub Section"
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
                        </Row>

                        <TnosDataTable
                            getExportData={getSubSection}
                            getMenu={`sub-section`}
                            data={
                                <>
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Nama Section</th>
                                            <th className="border-0 text-center">Nama</th>
                                            <th className="border-0 text-center">Slug</th>
                                            <th className="border-0 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getSubSection.length > 0 ? (
                                            getSubSection.map((td, index) => (
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

export default SubSection;
