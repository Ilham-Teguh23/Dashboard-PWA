import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Button,
    Form,
    InputGroup,
    Row,
    Badge,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { TnosDataTable } from "../../components/TnosDataTable";
import _, { parseInt } from "lodash"
import moment from "moment";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import Loading from "../../components/Loading";
import Preloader from "../../components/Preloader";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [selectedTABFilter, setSelectedTABFilter] = useState(0);
    const [getLoadingData, setLoadingData] = useState(false)
    const [getInsidenData, setInsidenData] = useState([]);
    const [messageEmptyData] = useState("Belum ada data");

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

    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null);

    const [getPaymentStatusArr] = useState([
        {
            key: "payment_status_0",
            value: 0,
            defaultValue: "Semua Status",
            us: "All Status",
            desc: "Menampilkan Semua Status Pembayaran",
            color: "",
        },
        {
            key: "payment_status_1",
            value: 1,
            defaultValue: "Selesai",
            us: "Selesai",
            desc: "Selesai",
            color: "success",
        },
        {
            key: "payment_status_2",
            value: 2,
            defaultValue: "Sedang Diproses",
            us: "Sedang Diproses",
            desc: "Sedang Diproses",
            color: "success",
        },
        {
            key: "payment_status_3",
            value: 3,
            defaultValue: "Menunggu",
            us: "Menunggu",
            desc: "Sedang Menunggu",
            color: "success",
        }
    ]);

    const [getTABFilter] = useState([
        {
            key: "tab_filter_status_0",
            value: 0,
            defaultValue: "Real",
        },
        {
            key: "tab_filter_status_1",
            value: 1,
            defaultValue: "Testing"
        },
    ]);

    const TableRow = ({ num, panicid, nama, phone_number, responder_name, phone_number_responder, status }) => (
        <tr>
            <td className="text-center">{num}.</td>
            <td className="text-center">
                <Link to={`/tab/insiden/detail/${panicid}`}>
                    <Button variant="primary" size="sm" className="text-white">
                        <FontAwesomeIcon icon={faThList} />
                    </Button>
                </Link>
            </td>
            <td>{nama}</td>
            <td className="text-center">{phone_number ? phone_number : "-"}</td>
            <td className="text-center">
                <ConvertTimestamps timestamp={panicid} />
            </td>
            <td className="text-center">
                {status === "D" ? (
                    <Badge bg="success" className="badge-lg">
                        Done
                    </Badge>
                ) : status === "P" ? (
                    <Badge bg="warning" className="badge-lg">
                        Sedang Diproses
                    </Badge>
                ) : (
                    <Badge bg="danger" className="badge-lg">
                        Menunggu
                    </Badge>
                )}
            </td>
            <td>{responder_name ? responder_name : "-"}</td>
            <td className="text-center">{phone_number_responder ? phone_number_responder : '-'}</td>
        </tr>
    );

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setInsidenData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return item.nama && item.nama.toLowerCase().includes(searchTerm);
        });

        setInsidenData(filteredData);
    };

    const fetchData = async () => {
        
        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/panic_report/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

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

        if (selectedTABFilter === 0) {
            filteredData = filteredData.filter(item =>
                item.nama != null &&
                !item.nama.includes("User") &&
                !item.nama.includes("test") &&
                !item.nama.includes("Test") &&
                !item.nama.includes("you@gmail.com") &&
                !item.nama.includes("fun@gmail.com") &&
                !item.nama.includes("Xxx Alfi Xxx") &&
                !item.nama.includes("XXXalifXXX") &&
                item.responder_name != null &&
                !item.responder_name.includes("Testing") &&
                !item.responder_name.includes("Test") &&
                !item.responder_name.includes("testt") &&
                !item.responder_name.includes("test")
            );
        } else if (selectedTABFilter === 1) {
            filteredData = filteredData.filter(item =>
                !item.nama ||
                item.nama.includes("User") ||
                item.nama.includes("test") ||
                item.nama.includes("Test") ||
                item.nama.includes("you@gmail.com") ||
                item.nama.includes("fun@gmail.com") ||
                item.nama.includes("Xxx Alfi Xxx") ||
                item.nama.includes("XXXalifXXX") ||
                item.responder_name == null ||
                item.responder_name.includes("Testing") ||
                item.responder_name.includes("Test") ||
                item.responder_name.includes("testt") ||
                item.responder_name.includes("test")
            );
        }

        if (selectedStatus === 0) {
            filteredData = filteredData.filter(item => item.status === "P" || item.status === "D" || item.status === "W");
        } else if (selectedStatus === 1) {
            filteredData = filteredData.filter(item => item.status === "D");
        } else if (selectedStatus === 2) {
            filteredData = filteredData.filter(item => item.status === "P");
        } else if (selectedStatus === 3) {
            filteredData = filteredData.filter(item => item.status === "W");
        }

        if (startDate && endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = moment(parseInt(item.panicid)).format("YYYY-MM-DD");
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return moment(itemDate).isBetween(start, end, null, '[]');
            });
        }

        filteredData.sort((a, b) => b.panicid - a.panicid);
        
        setOriginalData(filteredData)
        setInsidenData(filteredData)
        setIsLoading(false)
        setLoadingData(true)
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Preloader show={!getLoadingData ? true : false} />

            {isLoading && <Loading/> }

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form className="navbar-search mb-3">
                            <Row>
                                <Col md={5}>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Data Insiden</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Data Insiden"
                                                id="all_search"
                                                ref={searchInputRef}
                                            />
                                            <Button variant="primary" onClick={handleSearch}>
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col md={1}>
                                    <Form.Group id="transaction_status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            name="transaction_status"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                        >
                                            {getPaymentStatusArr?.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={1}>
                                    <Form.Group id="filter_test_testing">
                                        <Form.Label>Filter</Form.Label>
                                        <Form.Select
                                            name="transaction_status"
                                            value={selectedTABFilter}
                                            onChange={(e) => setSelectedTABFilter(parseInt(e.target.value))}
                                        >
                                            {getTABFilter.map((item) => (
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
                                            <Form.Label>Tanggal Insiden</Form.Label>
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
                            getExportData={getInsidenData}
                            getMenu={`tab-insiden`}
                            data={
                                <table className="table table-hover align-items-center">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0 text-center">No. Handphone</th>
                                            <th className="border-0 text-center">Tanggal Insiden</th>
                                            <th className="border-0 text-center">Status</th>
                                            <th className="border-0">Responder</th>
                                            <th className="border-0 text-center">Nomor HP Responder</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getInsidenData.length > 0 ? (
                                            getInsidenData.map((m, index) => (
                                                <TableRow
                                                    key={`member-${m.id_panic}`}
                                                    num={index + 1}
                                                    panicid={m.panicid}
                                                    nama={m.nama}
                                                    phone_number={m.phone_number}
                                                    status={m.status}
                                                    responder_name={m.responder_name}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={8}>{messageEmptyData}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            }
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};
