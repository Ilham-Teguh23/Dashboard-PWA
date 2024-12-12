import { Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [getPaketData, setPaketData] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState(
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

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setPaketData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.nama_paket && item.nama_paket.toLowerCase().includes(searchTerm))
            );
        });

        setPaketData(filteredData);
    };

    const TableRow = (props) => {
        const {
            nama_paket,
            amount,
            limit_user,
            limit_contact,
            durationDate,
            id_master_paket_organization
        } = props;

        return (
            <tr>
                <td className="text-center">{nama_paket}</td>
                <td className="text-center">{limit_user}</td>
                <td className="text-center">{limit_contact}</td>
                <td className="text-center">{durationDate} Hari</td>
                <td className="text-center">{"Rp. " + amount.toLocaleString()}</td>
                <td className="text-center">
                    <Link to={`/tab-b2b/user/${id_master_paket_organization}`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
            </tr>
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/paket/21212/current_paket`);
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

                let filteredData = extractedData

                if (selectedFilter === 1) {
                    filteredData = filteredData.filter((item) => !item.nama_paket.includes("Test") && !item.nama_paket.includes("test"));
                } else if (selectedFilter === 2) {
                    filteredData = filteredData.filter((item) => item.nama_paket.includes("Test") || item.nama_paket.includes("test"));
                }

                setOriginalData(filteredData)
                setPaketData(filteredData);

            } catch (error) {
                console.error("Fetching data failed:", error);
            }
        };

        fetchData();
    }, [selectedFilter]);

    return (
        <>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>

                        <Row className="mb-3">
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Master Paket</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Master Paket"
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
                            getExportData={getPaketData}
                            getMenu={`tab-b2b-master-paket`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">Nama Paket</th>
                                            <th className="border-0 text-center">Limit User</th>
                                            <th className="border-0 text-center">Limit Kontak</th>
                                            <th className="border-0 text-center">Durasi Waktu</th>
                                            <th className="border-0 text-center">Harga</th>
                                            <th className="border-0 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getPaketData?.length > 0 ? (
                                            getPaketData?.map((td, index) => (
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