import React, { useState, useEffect, useRef } from "react";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
    Tab,
    Nav,
    Badge,
    Form,
    InputGroup,
    Button
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const [originalDataInsiden, setOriginalDataInsiden] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [getDataResponder, setDataResponder] = useState([]);
    const [selectedStatusInsiden, setSelectedStatusInsiden] = useState(0);
    const [selectedStatusUser, setSelectedStatusUser] = useState(0);
    const [getDataUser, setDataUser] = useState([]);
    const [getDataInsiden, setDataInsiden] = useState([]);

    const [getMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    )

    const location = useLocation()
    const member_account_code = location.pathname.split("/")[3];

    const searchInputRefInsiden = useRef(null);
    const searchInputRefUser = useRef(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    const [getStatusUser] = useState([
        {
            key: "key_status_user_0",
            value: 0,
            defaultValue: "Semua Status",
        },
        {
            key: "key_status_user_1",
            value: 1,
            defaultValue: "Aktif"
        },
        {
            key: "key_status_user_2",
            value: 2,
            defaultValue: "Tidak Aktif"
        }
    ]);

    const [getStatusInsiden] = useState([
        {
            key: "payment_status_0",
            value: 0,
            defaultValue: "Semua Status"
        },
        {
            key: "payment_status_1",
            value: 1,
            defaultValue: "Menunggu Responder"
        },
        {
            key: "payment_status_2",
            value: 2,
            defaultValue: "Sedang Ditangani"
        },
        {
            key: "payment_status_3",
            value: 2,
            defaultValue: "Selesai"
        },
    ]);

    const getResponder = () => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/responder/${member_account_code}/admin`)
            .then((res) => res.json())
            .then((response) => {

                console.log("Data");
                console.log(response.data);

                setDataResponder(response.data)

            }).catch((error) => {
                toast(error)
            });
    }

    const getUser = async () => {
        // fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/user/${member_account_code}/admin`)
        //     .then((res) => res.json())
        //     .then((response) => {

        //         setDataUser(response.data)

        //     }).catch((error) => {
        //         toast(error)
        //     });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/user/${member_account_code}/admin`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item => !item.detail?.nama.includes("test") && !item.detail?.nama.includes("Test") && !item.detail?.nama.includes("Testing") && !item.detail?.nama.includes("testing"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter(item => item.detail?.nama.includes("test") || item.detail?.nama.includes("Test") || item.detail?.nama.includes("Testing") || item.detail?.nama.includes("testing"));
            }

            if (selectedStatusUser === 0) {
                filteredData = filteredData
            } else if (selectedStatusUser === 1) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id === "active")
            } else if (selectedStatusUser === 2) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id == "inactive")
            }

            setOriginalDataInsiden(filteredData);
            setDataUser(filteredData);
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    }

    const getInsiden = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/panic_report/${member_account_code}/show_organization`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item => !item.nama.includes("test") && !item.nama.includes("Test") && !item.nama.includes("Testing") && !item.nama.includes("testing"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter(item => item.nama.includes("test") || item.nama.includes("Test") || item.nama.includes("Testing") || item.nama.includes("testing"));
            }

            if (selectedStatusInsiden === 0) {
                filteredData = filteredData
            } else if (selectedStatusInsiden === 1) {
                filteredData = filteredData.filter(item => item.status === "Menunggu Responder");
            } else if (selectedStatusInsiden === 2) {
                filteredData = filteredData.filter(item => item.status === "Sedang Ditangani");
            } else if (selectedStatusInsiden === 3) {
                filteredData = filteredData.filter(item => item.status === "Selesai");
            }

            setOriginalDataInsiden(filteredData);
            setDataInsiden(filteredData);
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    }

    const handleSearchInsiden = () => {
        const searchTerm = searchInputRefInsiden.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setDataInsiden([...originalDataInsiden]);
            return;
        }

        const filteredData = originalDataInsiden.filter(item => {
            return (
                (item.nama && item.nama.toLowerCase().includes(searchTerm)) ||
                (item.phone_number && item.phone_number.toLowerCase().includes(searchTerm))
            );
        });

        setDataInsiden(filteredData);
    };

    useEffect(() => {
        getResponder();
        getUser();
        getInsiden()
    }, [selectedFilter, selectedStatusInsiden, selectedStatusUser]);

    const TableRow = (props) => {
        const {
            detail,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td>{detail?.nama}</td>
                <td className="text-center">{detail?.phone_number}</td>
                <td>{detail?.username}</td>
                <td className="text-center">{detail?.account_status_id}</td>
                <td className="text-center">{detail?.nama_institusi}</td>
            </tr>
        );
    }

    const TableRowUser = (props) => {
        const {
            detail,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td>{detail?.nama}</td>
                <td className="text-center">{detail?.phone_number}</td>
                <td>{detail?.username}</td>
                <td className="text-center">{detail?.account_status_id}</td>
            </tr>
        );
    }

    const TableRowInsiden = (props) => {
        const {
            nama,
            jam,
            phone_number,
            responder_name,
            responder_phone_number,
            status,
            tanggal,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td>{nama}</td>
                <td className="text-center">{phone_number}</td>
                <td className="text-center">{jam}</td>
                <td>{responder_name ? responder_name : '-'}</td>
                <td className="text-center">{responder_phone_number ? responder_phone_number : '-'}</td>
                <td className="text-center">{tanggal}</td>
                <td className="text-center">
                    {status === "Selesai" ? (
                        <>
                            <Badge bg="success" className="badge-lg">
                                Selesai
                            </Badge>
                        </>
                    ) : status === "Menunggu Responder" ? (
                        <>
                            <Badge bg="warning" className="badge-lg">
                                Menunggu Responder
                            </Badge>
                        </>
                    ) : status === "Sedang Ditangani" ? (
                        <>
                            <Badge bg="primary" className="badge-lg">
                                Sedang Ditangani
                            </Badge>
                        </>
                    ) : "-"}
                </td>
            </tr>
        );
    }

    return (
        <>
            <Row>
                <Preloader show={!getDataResponder ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/pwa-b2b/order">
                        Data Akun
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Akun External</Breadcrumb.Item>
                </Breadcrumb>
                <Tab.Container defaultActiveKey="akun_external_user">
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="akun_external_responder">Responder</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="akun_external_user">User</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="akun_insiden">Insiden</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="akun_external_responder">
                                    <Card border="light">
                                        <Card.Body>
                                            <Row className="mb-3">
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
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0">Nama</th>
                                                                <th className="border-0">Nomor HP</th>
                                                                <th className="border-0">Username</th>
                                                                <th className="border-0 text-center">Status</th>
                                                                <th className="border-0 text-center">Org</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getDataResponder?.length > 0 ? (
                                                                getDataResponder?.map((td, index) => (
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
                                </Tab.Pane>

                                <Tab.Pane eventKey="akun_external_user">
                                    <Card border="light">
                                        <Card.Body>
                                            <Row className="mb-3">
                                                <Col md={5}>
                                                    <Form>
                                                        <Form.Group id="topbarSearch">
                                                            <Form.Label>Cari Transaksi</Form.Label>
                                                            <InputGroup className="input-group-merge search-bar">
                                                                <InputGroup.Text>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Cari Transaksi"
                                                                    id="all_search"
                                                                    ref={searchInputRefUser}
                                                                />
                                                                {/* <Button variant="primary" onClick={handleSearchUser}> */}
                                                                {/* Search */}
                                                                {/* </Button> */}
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Group id="transaction_status">
                                                        <Form.Label>Status</Form.Label>
                                                        <Form.Select
                                                            name="transaction_status"
                                                            value={selectedStatusUser}
                                                            onChange={(e) => setSelectedStatusUser(parseInt(e.target.value))}
                                                        >
                                                            {getStatusUser?.map((item) => (
                                                                <option key={item.key} value={item.value}>
                                                                    {item.defaultValue}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
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
                                                getExportData={getDataUser}
                                                getMenu={`detail-akun-user-siplah`}
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0">Nama</th>
                                                                <th className="border-0 text-center">Nomor HP</th>
                                                                <th className="border-0">Username</th>
                                                                <th className="border-0 text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getDataUser?.length > 0 ? (
                                                                getDataUser?.map((td, index) => (
                                                                    <TableRowUser
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
                                </Tab.Pane>

                                <Tab.Pane eventKey="akun_insiden">
                                    <Card border="light">
                                        <Card.Body>
                                            <Row className="mb-3">
                                                {/* <Col md={4}>
                                                    <Form onSubmit={handleSearchInsiden}>
                                                        <Form.Group id="topbarSearch">
                                                            <Form.Label>Tanggal Transaksi</Form.Label>
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
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col> */}

                                                <Col md={5}>
                                                    <Form>
                                                        <Form.Group id="topbarSearch">
                                                            <Form.Label>Cari Insiden</Form.Label>
                                                            <InputGroup className="input-group-merge search-bar">
                                                                <InputGroup.Text>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Cari Insiden"
                                                                    id="all_search"
                                                                    ref={searchInputRefInsiden}
                                                                />
                                                                <Button variant="primary" onClick={handleSearchInsiden}>
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
                                                            value={selectedStatusInsiden}
                                                            onChange={(e) => setSelectedStatusInsiden(parseInt(e.target.value))}
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
                                            <TnosDataTable
                                                getExportData={getDataInsiden}
                                                getMenu={`detail-akun-insiden-siplah`}
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0">Nama</th>
                                                                <th className="border-0 text-center">Nomor HP</th>
                                                                <th className="border-0 text-center">Jam</th>
                                                                <th className="border-0">Nama Responder</th>
                                                                <th className="border-0 text-center">Nomor HP Responder</th>
                                                                <th className="border-0 text-center">Tanggal</th>
                                                                <th className="border-0 text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getDataInsiden?.length > 0 ? (
                                                                getDataInsiden?.map((td, index) => (
                                                                    <TableRowInsiden
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
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Row>
        </>
    );
};
