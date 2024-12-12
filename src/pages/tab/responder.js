import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Button,
    Form,
    InputGroup,
    Row
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { TnosDataTable } from "../../components/TnosDataTable";
import Preloader from "../../components/Preloader"
import moment from "moment";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedTABFilter, setSelectedTABFilter] = useState(0)
    
    const [getResponderData, setResponderData] = useState([]);
    const [messageEmptyData] = useState("Belum ada data responder hari ini");

    const [getTotal, setTotal] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

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

    const searchInputRef = useRef(null);

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

    const TableRow = ({ num, id_responder, name, phone_number, email, detail }) => (
        <tr>
            <td className="text-center">{num}</td>
            <td>{name ? name : "-"}</td>
            <td className="text-center">{detail.member_code}</td>
            <td className="text-center">{detail.register_at}</td>
            <td className="text-center">{phone_number ? phone_number : "-"}</td>
            <td>{email ? email : "-"}</td>
            <td className="text-center">
                <Link to={`/tab/responder/${id_responder}`}>
                    <Button variant="primary" size="sm" className="text-white">
                        <FontAwesomeIcon icon={faThList} />
                    </Button>
                </Link>
            </td>
        </tr>
    );

    const fetchData = async () => {

        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/responder/all`, {
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

        let responseDataMix = await Promise.all(filteredData.map(async (item) => {
            const responseShowFirst = await fetch(`${process.env.REACT_APP_API_TAB_URL}/responder/${item.id_responder}/show`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!responseShowFirst.ok) {
                throw new Error(`HTTP error! status: ${responseShowFirst.status}`);
            }

            const dataShowFirst = await responseShowFirst.json();

            return {
                ...item,
                detail: dataShowFirst.data
            };
        }));

        if (selectedTABFilter === 0) {
            responseDataMix = responseDataMix.filter(item =>
                item.name != null &&
                !item.name.includes("User") &&
                !item.name.includes("test") &&
                !item.name.includes("Test") &&
                !item.name.includes("223283828238238283") &&
                !item.name.includes("tes") &&
                !item.name.includes("Vvfffhjjjj") &&
                !item.name.includes("Hdjdhdjdjjd") &&
                !item.detail.register_at.includes("Invalid date")
            );
        } else if (selectedTABFilter === 1) {
            responseDataMix = responseDataMix.filter(item =>
                item.name == null ||
                item.name.includes("User") ||
                item.name.includes("test") ||
                item.name.includes("Test") ||
                item.name.includes("223283828238238283") ||
                item.name.includes("tes") ||
                item.name.includes("Vvfffhjjjj") ||
                item.name.includes("Hdjdhdjdjjd") ||
                item.detail.register_at.includes("Invalid date")
            );
        }

        if (startDate && endDate) {
            responseDataMix = responseDataMix.filter(item => {
                const itemDate = moment(item.detail.register_at, "D MMM YYYY HH:mm Z").format("YYYY-MM-DD");
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return moment(itemDate).isBetween(start, end, null, '[]');
            });
        }

        responseDataMix.sort((a, b) => {
            const dateA = moment(a.detail.register_at, "D MMM YYYY HH:mm Z")
            const dateB = moment(b.detail.register_at, "D MMM YYYY HH:mm Z")
            return dateB.diff(dateA)
        })

        setTotal(responseDataMix.length)

        setOriginalData(responseDataMix)
        setResponderData(responseDataMix)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setResponderData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                (item.phone_number && item.phone_number.toLowerCase().includes(searchTerm)) ||
                (item.email && item.email.toLowerCase().includes(searchTerm)) ||
                (item.detail.member_code && item.detail.member_code.toLowerCase().includes(searchTerm))
            );
        });

        setResponderData(filteredData);
    };

    return (
        <>
            <Preloader show={getTotal === null ? true : false} />

            {isLoading && <Loading/> }

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form className="navbar-search mb-3">
                            <Row>
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
                                            <Form.Label>Tanggal Mendaftar</Form.Label>
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
                            getMenu={`tab-responder`}
                            data={
                                <table className="table table-hover align-items-center">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0 text-center">Kode Responder</th>
                                            <th className="border-0 text-center">Tanggal Mendaftar</th>
                                            <th className="border-0 text-center">No. Handphone</th>
                                            <th className="border-0">Email</th>
                                            <th className="border-0 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getResponderData.length > 0 ? (
                                            getResponderData.map((m, index) => (
                                                <TableRow
                                                    key={`member-${m.id_responder}`}
                                                    num={index + 1}
                                                    id_responder={m.id_responder}
                                                    name={m.name}
                                                    phone_number={m.phone_number}
                                                    email={m.email}
                                                    register_at={m.register_at}
                                                    detail={m.detail}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={7}>{messageEmptyData}</td>
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

}