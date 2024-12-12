import { Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import moment from "moment";
import Preloader from "../../components/Preloader";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [getResponderData, setResponderData] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada responder pada hari ini"
    )

    const [getTotal, setTotal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

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

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

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

    const TableRow = (props) => {
        const {
            id_responder_organization,
            timestamp,
            nama,
            email,
            username,
            phone_number,
            country_code,
            num,
            account_id,
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">
                    <Link to={`/tab-b2b/responder/${id_responder_organization}`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
                <td className="text-center">
                    <ConvertTimestamps timestamp={timestamp} />
                </td>
                <td>{nama}</td>
                <td>{email ? email : '-'}</td>
                <td>{username}</td>
                <td className="text-center">{country_code}</td>
                <td className="text-center">{phone_number}</td>
                <td>{account_id?.nama}</td>
                <td>{account_id?.email ? account_id?.email : '-'}</td>
                <td className="text-center">{account_id?.member_account_code}</td>
            </tr>
        )
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setResponderData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.nama && item.nama.toLowerCase().includes(searchTerm)) ||
                (item.username && item.username.toLowerCase().includes(searchTerm)) ||
                (item.phone_number && item.phone_number.toLowerCase().includes(searchTerm)) ||
                (item.account_id?.nama && item.account_id?.nama.toLowerCase().includes(searchTerm)) ||
                (item.account_id?.member_account_code && item.account_id?.member_account_code.toLowerCase().includes(searchTerm))
            );
        });

        setResponderData(filteredData);
    };

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/responder/all`);
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

            let filteredData = [];

            if (selectedFilter === 1) {
                filteredData = extractedData.filter(item => item.nama != null && !item.nama.includes("test") && !item.nama.includes("Test"));
            } else if (selectedFilter === 2) {
                filteredData = extractedData.filter(item => {
                    return (!item.nama || item.nama.includes("test") || item.nama.includes("Test"));
                });
            }

            if (startDate && endDate) {
                filteredData = filteredData.filter(item => {
                    const itemDate = moment(parseInt(item.timestamp)).format("YYYY-MM-DD");
                    const start = moment(startDate).startOf('day');
                    const end = moment(endDate).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            setOriginalData(filteredData);
            setResponderData(filteredData);
            setTotal(filteredData.length)
            setIsLoading(false)
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Preloader show={getTotal === null ? true : false} />

            {isLoading && <Loading/> }

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form method="POST">
                            <Row className="mb-3">
                                <Col md={5}>
                                    <Form>
                                        <Form.Group id="topbarSearch">
                                            <Form.Label>Cari Responder</Form.Label>
                                            <InputGroup className="input-group-merge search-bar">
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Cari Responder"
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
                        </Form>
                        <TnosDataTable
                            getExportData={getResponderData}
                            getMenu={`tab-b2b-responder`}
                            getTanggalMulai={startDate}
                            getTanggalAkhir={endDate}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0 text-center">Tanggal</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0">Email</th>
                                            <th className="border-0">Username</th>
                                            <th className="border-0 text-center">Kode Negara</th>
                                            <th className="border-0 text-center">Nomor HP</th>
                                            <th className="border-0">Organisasi</th>
                                            <th className="border-0">Email Organisasi</th>
                                            <th className="border-0">Kode Member Akun</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getResponderData?.length > 0 ? (
                                            getResponderData?.map((td, index) => (
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