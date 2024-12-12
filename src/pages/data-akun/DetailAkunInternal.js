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
    Button,
    OverlayTrigger,
    Tooltip
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {

    const [originalDataInsiden, setOriginalDataInsiden] = useState([]);
    const [originalDataUser, setOriginalDataUser] = useState([]);
    const [originalDataResponder, setOriginalDataResponder] = useState([]);
    const [selectedFilterInsiden, setSelectedFilterInsiden] = useState(1);
    const [selectedFilterUser, setSelectedFilterUser] = useState(1);
    const [selectedFilterResponder, setSelectedFilterResponder] = useState(1);
    const [selectedStatusInsiden, setSelectedStatusInsiden] = useState(0);
    const [selectedStatusUser, setSelectedStatusUser] = useState(0);
    const [selectedStatusResponder, setSelectedStatusResponder] = useState(0);
    const [getDataResponder, setDataResponder] = useState([]);
    const [getDataInsiden, setDataInsiden] = useState([]);
    const [getDataUser, setDataUser] = useState([]);

    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum Ada Data"
    )

    const location = useLocation()
    const member_account_code = location.pathname.split("/")[3];

    const searchInputRefInsiden = useRef(null);
    const searchInputRefUser = useRef(null);
    const searchInputRefResponder = useRef(null);

    const [getFilterTestUser] = useState([
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

    const [getFilterTestInsiden] = useState([
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

    const [getFilterTestResponder] = useState([
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

    const [getStatusUser] = useState([
        {
            key: "status_user_0",
            value: 0,
            defaultValue: "Semua Status",
        },
        {
            key: "status_user_1",
            value: 1,
            defaultValue: "Aktif",
        },
        {
            key: "status_user_2",
            value: 2,
            defaultValue: "Tidak Aktif",
        }
    ]);

    const [getStatusResponder] = useState([
        {
            key: "status_user_0",
            value: 0,
            defaultValue: "Semua Status",
        },
        {
            key: "status_user_1",
            value: 1,
            defaultValue: "Aktif",
        },
        {
            key: "status_user_2",
            value: 2,
            defaultValue: "Tidak Aktif",
        }
    ]);

    const handleSearchResponder = () => {
        const searchTerm = searchInputRefResponder.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setDataResponder([...originalDataResponder]);
            return;
        }

        const filteredData = originalDataResponder.filter(item => {
            return (
                (item.detail?.nama && item.detail?.nama.toLowerCase().includes(searchTerm)) ||
                (item.detail?.phone_number && item.detail?.phone_number.toLowerCase().includes(searchTerm))
            );
        });

        setDataResponder(filteredData);
    };

    const handleSearchUser = () => {
        const searchTerm = searchInputRefUser.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setDataUser([...originalDataUser]);
            return;
        }

        const filteredData = originalDataUser.filter(item => {
            return (
                (item.detail?.nama && item.detail?.nama.toLowerCase().includes(searchTerm)) ||
                (item.detail?.phone_number && item.detail?.phone_number.toLowerCase().includes(searchTerm))
            );
        });

        setDataUser(filteredData);
    };

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

    const getResponder = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/responder/${member_account_code}/admin`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilterResponder === 1) {
                filteredData = filteredData.filter(item => !item.detail?.nama.includes("test") && !item.detail?.nama.includes("Test") && !item.detail?.nama.includes("Testing"));
            } else if (selectedFilterResponder === 2) {
                filteredData = filteredData.filter(item => item.detail?.nama.includes("test") || item.detail?.nama.includes("Test") || item.detail?.nama.includes("Testing"));
            }

            if (selectedStatusResponder === 0) {
                filteredData = filteredData
            } else if (selectedStatusResponder === 1) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id === "active");
            } else if (selectedStatusResponder === 2) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id === "inactive");
            }

            setOriginalDataResponder(filteredData);
            setDataResponder(filteredData);
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    }

    const getUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/user/${member_account_code}/admin`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilterUser === 1) {
                filteredData = filteredData.filter(item => !item.detail?.nama.includes("test") && !item.detail?.nama.includes("Test"));
            } else if (selectedFilterUser === 2) {
                filteredData = filteredData.filter(item => item.detail?.nama.includes("test") || item.detail?.nama.includes("Test"));
            }

            if (selectedStatusUser === 0) {
                filteredData = filteredData
            } else if (selectedStatusUser === 1) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id === "active");
            } else if (selectedStatusUser === 2) {
                filteredData = filteredData.filter(item => item.detail?.account_status_id === "inactive");
            }

            setOriginalDataUser(filteredData);
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

            if (selectedFilterInsiden === 1) {
                filteredData = filteredData.filter(item => !item.nama.includes("User") && !item.nama.includes("test") && !item.nama.includes("Test"));
            } else if (selectedFilterInsiden === 2) {
                filteredData = filteredData.filter(item => item.nama.includes("User") || item.nama.includes("test"));
            }

            if (selectedStatusInsiden === 0) {
                filteredData = filteredData.filter(item => item.status === "Selesai" || item.status === "Menunggu Responder" || item.status === "Sedang Ditangani");
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

    useEffect(() => {
        getResponder();
        getUser();
        getInsiden();
    }, [selectedFilterInsiden, selectedStatusInsiden, selectedFilterUser, selectedStatusUser, selectedFilterResponder, selectedStatusResponder]);

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
                <td className="text-center">
                    <Badge bg={detail?.account_status_id === "active" ? "success" : "danger"} className="badge-lg">
                        {detail?.account_status_id === "active" ? "Aktif" : "Tidak Aktif"}
                        &nbsp;
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{detail?.account_status_id === "active" ? 'Status Akun Aktif' : 'Status Akun Tidak Aktif'}</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    </Badge>
                </td>
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
                <td className="text-center">
                    <Badge bg={detail?.account_status_id === "active" ? "success" : "danger"} className="badge-lg">
                        {detail?.account_status_id === "active" ? "Aktif" : "Tidak Aktif"}
                        &nbsp;
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{detail?.account_status_id === "active" ? 'Status Akun Aktif' : 'Status Akun Tidak Aktif'}</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    </Badge>
                </td>
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
                <Tab.Container defaultActiveKey="akun_external_responder">
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
                                    <Nav.Link eventKey="akun_internal_insiden">Insiden</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="akun_external_responder">
                                    <Card border="light">
                                        <Card.Body>
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
                                                                    ref={searchInputRefResponder}
                                                                />
                                                                <Button variant="primary" onClick={handleSearchResponder}>
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
                                                            value={selectedStatusResponder}
                                                            onChange={(e) => setSelectedStatusResponder(parseInt(e.target.value))}
                                                        >
                                                            {getStatusResponder?.map((item) => (
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
                                                            value={selectedFilterResponder}
                                                            onChange={(e) => setSelectedFilterResponder(parseInt(e.target.value))}
                                                            required
                                                        >
                                                            {getFilterTestResponder?.map((item) => (
                                                                <option key={item.key} value={item.value}>
                                                                    {item.defaultValue}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <TnosDataTable
                                                getExportData={getDataResponder}
                                                getMenu={`detail-akun-responder`}
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0">Nama</th>
                                                                <th className="border-0 text-center">Nomor HP</th>
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
                                                            <Form.Label>Cari Pengguna</Form.Label>
                                                            <InputGroup className="input-group-merge search-bar">
                                                                <InputGroup.Text>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Cari Pengguna"
                                                                    id="all_search"
                                                                    ref={searchInputRefUser}
                                                                />
                                                                <Button variant="primary" onClick={handleSearchUser}>
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
                                                            value={selectedFilterUser}
                                                            onChange={(e) => setSelectedFilterUser(parseInt(e.target.value))}
                                                            required
                                                        >
                                                            {getFilterTestUser?.map((item) => (
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
                                                getMenu={`detail-akun-user`}
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

                                <Tab.Pane eventKey="akun_internal_insiden">
                                    <Card border="light">
                                        <Card.Body>
                                            <Row className="mb-3">
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
                                                <Col md={2}>
                                                    <Form.Group id="filter_test">
                                                        <Form.Label>Filter</Form.Label>
                                                        <Form.Select
                                                            name="transaction_status"
                                                            value={selectedFilterInsiden}
                                                            onChange={(e) => setSelectedFilterInsiden(parseInt(e.target.value))}
                                                            required
                                                        >
                                                            {getFilterTestInsiden?.map((item) => (
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
                                                getMenu={`detail-akun-internal`}
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
