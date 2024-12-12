import { Badge, Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [getInsidenData, setInsidenData] = useState([])
    const [getMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    )

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

    const [getStatusInsiden] = useState([
        {
            key: "status_insiden_0",
            value: 0,
            defaultValue: "Semua Status",
            us: "All Status",
            desc: "Menampilkan Semua Status Pembayaran",
            color: "",
        },
        {
            key: "status_insiden_1",
            value: 1,
            defaultValue: "Menunggu Responder",
        },
        {
            key: "status_insiden_2",
            value: 2,
            defaultValue: "Sedang Ditangani",
        },
        {
            key: "status_insiden_3",
            value: 3,
            defaultValue: "Selesai",
        },
    ]);

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setInsidenData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.nama && item.nama.toLowerCase().includes(searchTerm)) ||
                (item.phone_number && item.phone_number.toLowerCase().includes(searchTerm)) ||
                (item.organisasi && item.organisasi.toLowerCase().includes(searchTerm))
            );
        });

        setInsidenData(filteredData);
    };

    const TableRow = (props) => {
        const {
            tanggal,
            id_panic,
            nama,
            phone_number,
            jam,
            status,
            responder_name,
            responder_phone_number,
            organisasi,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}</td>
                <td className="text-center">
                    <Link to={`/tab-b2b/insiden/${id_panic}/detail`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
                <td className="text-center">{tanggal}</td>
                <td className="text-center">{jam}</td>
                <td>{nama ? nama : '-'}</td>
                <td className="text-center">{phone_number ? phone_number : '-'}</td>
                <td className="text-center">
                    <Badge bg={status === "Menunggu Responder" ? "warning" : status === "Sedang Ditangani" ? 'primary' : status === "Selesai" ? 'success' : 'danger'} className="badge-lg">
                        {status}
                    </Badge>
                </td>
                <td>{responder_name ? responder_name : '-'}</td>
                <td className="text-center">{responder_phone_number ? responder_phone_number : '-'}</td>
                <td>{organisasi}</td>
            </tr>
        )
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/panic_report/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = [];
            if (Array.isArray(data.data)) {
                extractedData = data.data;
            } else if (Array.isArray(data)) {
                extractedData = data;
            }

            let filteredData = extractedData;

            if (selectedStatus !== 0) {
                filteredData = filteredData.filter((item) => {
                    if (selectedStatus === 1) {
                        return item.status === "Menunggu Responder";
                    } else if (selectedStatus === 2) {
                        return item.status === "Sedang Ditangani";
                    } else if (selectedStatus === 3) {
                        return item.status === "Selesai";
                    }
                    return true;
                });
            }

            if (selectedFilter === 1) {
                filteredData = filteredData.filter((item) => !item.nama.includes("test") && !item.nama.includes("Test"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter((item) => item.nama.includes("test") || item.nama.includes("Test"));
            }

            setOriginalData(filteredData);
            setInsidenData(filteredData);
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFilter, selectedStatus]);

    return (
        <>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form method="POST">
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Form.Label>Tanggal</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="datetime-local"
                                            name="start_date_time"
                                            step="1"
                                            // defaultValue={TodayDate() + "T00:00:00"}
                                            required
                                        />
                                        <InputGroup.Text>&#x2192;</InputGroup.Text>
                                        <Form.Control
                                            type="datetime-local"
                                            name="end_date_time"
                                            step="1"
                                            // defaultValue={TodayDate() + "T23:59:59"}
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={5}>
                                    <Form>
                                        <Form.Group id="topbarSearch">
                                            <Form.Label>Cari Pengguna</Form.Label>
                                            <InputGroup className="input-group-merge search-bar">
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Cari Pengguna"
                                                    id="all_search"
                                                    ref={searchInputRef}
                                                />
                                                <Button variant="primary" onClick={handleSearch}>
                                                    Search
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={2}>
                                    <Form.Group id="transaction_status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            name="transaction_status"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                            required
                                        >
                                            {getStatusInsiden?.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
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
                        </Form>
                        <TnosDataTable
                            getExportData={getInsidenData}
                            getMenu={`tab-b2b-insiden`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0 text-center">Tanggal</th>
                                            <th className="border-0 text-center">Jam</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0 text-center">Nomor HP</th>
                                            <th className="border-0 text-center">Status</th>
                                            <th className="border-0">Nama Responder</th>
                                            <th className="border-0 text-center">Nomor HP Responder</th>
                                            <th className="border-0">Organisasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getInsidenData?.length > 0 ? (
                                            getInsidenData?.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    {...td}
                                                    num={index + 1}
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
                        ></TnosDataTable>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}