import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons"
import { Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Spinner } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [getSubKategoriData, setSubKategoriData] = useState([])
    const [loading, setLoading] = useState(true);
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

    const [selectedFilter, setSelectedFilter] = useState(1);
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

    const fetchData = async () => {

        const response = await fetch(`${process.env.REACT_APP_API_TNOSWORLD_URL}/article/subcategory/all`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

        let filteredData = extractedData;

        if (selectedFilter === 1) {
            filteredData = filteredData.filter(item => item.name != null && !item.name.includes("tes") && !item.name.includes("Tester"));
        } else if (selectedFilter === 2) {
            filteredData = filteredData.filter(item => !item.name || item.name.includes("tes") || item.name.includes("Tester"));
        }

        setOriginalData(filteredData)
        setSubKategoriData(filteredData)
        setLoading(false);
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setSubKategoriData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setSubKategoriData(filteredData);
    };

    useEffect(() => {

        fetchData()

    }, [selectedFilter])

    const TableRow = ({ num, name, created_at }) => {
        return (
            <tr>
                <td className="text-center">{num}</td>
                <td>{name}</td>
                <td className="text-center">{created_at}</td>
            </tr>
        )
    }

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
                        <Breadcrumb.Item href="/artikel/artikelkategory">
                            Data Kategori
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Sub Category</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={9}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Sub Kategori</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Sub Kategori"
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
                            <Col md={3}>
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
                            getExportData={getSubKategoriData}
                            getMenu={`artikel-sub-kategori`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Nama Sub Kategori</th>
                                            <th className="border-0 text-center">Dibuat Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3}>
                                                    <div className="text-center">
                                                        <Spinner animation="border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : getSubKategoriData?.length > 0 ? (
                                            getSubKategoriData?.map((td, index) => (
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
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    )

}