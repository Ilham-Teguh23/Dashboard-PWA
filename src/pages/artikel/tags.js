import { Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Spinner } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [getTagsData, setTagsData] = useState([])
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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setTagsData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setTagsData(filteredData);
    };

    const fetchData = async () => {

        const response = await fetch(`${process.env.REACT_APP_API_TNOSWORLD_URL}/article/tag/all`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

        let filteredData = extractedData;

        if (selectedFilter === 1) {
            filteredData = filteredData.filter(item => item.name != null && !item.name.includes("Tester") && !item.name.includes("Test"));
        } else if (selectedFilter === 2) {
            filteredData = filteredData.filter(item => !item.name || item.name.includes("Tester") || item.name.includes("Test"));
        }

        setOriginalData(filteredData)
        setTagsData(filteredData)
        setLoading(false);
    }

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
                            Kategori
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Tags</Breadcrumb.Item>
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
                                        <Form.Label>Cari Tags</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Tags"
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
                        <TnosDataTable
                            getExportData={getTagsData}
                            getMenu={`artikel-tags`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0 text-center">Dibuat Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <div className="text-center">
                                                <Spinner animation="border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </div>
                                        ) : getTagsData?.length > 0 ? (
                                            getTagsData?.map((td, index) => (
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