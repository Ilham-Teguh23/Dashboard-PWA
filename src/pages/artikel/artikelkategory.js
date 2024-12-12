import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons"
import { Breadcrumb, Button, Card, Col, Form, InputGroup, Row, Spinner } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment from "moment"
import Preloader from "../../components/Preloader"
import Loading from "../../components/Loading"

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [getKategoriData, setKategoriData] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    )

    const [getTotal, setTotal] = useState(null)

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

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

    const [isLoading, setIsLoading] = useState(false)
    const searchInputRef = useRef(null);

    const handleSearchByDate = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("Mohon isi tanggal mulai dan tanggal selesai.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
            return;
        }

        fetchData();
    }

    const fetchData = async () => {

        setIsLoading(true)
        const response = await fetch(`${process.env.REACT_APP_API_TNOSWORLD_URL}/article/category/all`);

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

        if (startDate && endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = moment(item.created_at, "DD-MM-YYYY").format("YYYY-MM-DD");
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return moment(itemDate).isBetween(start, end, null, '[]');
            });
        }

        filteredData.sort((a, b) => {
            const dateA = moment(a.created_at, "DD-MM-YYYY");
            const dateB = moment(b.created_at, "DD-MM-YYYY");
            return dateB - dateA
        });

        setTotal(filteredData.length)
        setOriginalData(filteredData)
        setKategoriData(filteredData)
        setIsLoading(false)
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setKategoriData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setKategoriData(filteredData);
    };

    useEffect(() => {
        fetchData()
    }, [])

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
            <Preloader show={getTotal === null ? true : false} />

            {isLoading && <Loading />}

            <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                <div className="d-block mb-4 mb-xl-0">
                    <Breadcrumb
                        className="d-none d-md-inline-block"
                        listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
                    >
                        <Breadcrumb.Item href="/">
                            <FontAwesomeIcon icon={faHome} />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Data Kategori</Breadcrumb.Item>
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
                                        <Form.Label>Cari Kategori</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Kategori"
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
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Tanggal</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="date"
                                                name="start_date_time"
                                                step="1"
                                                required
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                            <InputGroup.Text>&#x2192;</InputGroup.Text>
                                            <Form.Control
                                                type="date"
                                                name="end_date_time"
                                                step="1"
                                                required
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                            <Button
                                                variant="primary"
                                                onClick={handleSearchByDate}
                                            >
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <TnosDataTable
                            getExportData={getKategoriData}
                            getMenu={`artikel-kategori`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Nama Kategori</th>
                                            <th className="border-0 text-center">Dibuat Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getKategoriData?.length > 0 ? (
                                            getKategoriData?.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    {...td}
                                                    num={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colspan={8}>{getMessageEmptyData}</td>
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