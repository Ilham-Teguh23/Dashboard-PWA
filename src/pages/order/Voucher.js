import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faThList,
    faExternalLinkAlt,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Row,
    Button,
    Form,
    InputGroup,
    Tooltip,
    OverlayTrigger,
    Tab,
    Nav,
    Badge,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable"
import ReadableDateTime from "../../components/ReadableDateTime"
import Preloader from "../../components/Preloader";
import moment from "moment";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [originalDataPembayaran, setOriginalDataPembayaran] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [selectedFilterPembayaran, setSelectedFilterPembayaran] = useState(1)
    const [getMessageEmptyData] = useState("Tidak ada data")
    const [getTransaksiData, setMemberData] = useState()
    const [getPaymentData, setPaymentData] = useState()

    const calcAmount = (amount, times = true) => {
        const am = times ? amount * 10000 : amount;
        return "IDR " + am.toLocaleString("id-ID", {});
    };

    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null)

    const todayTransaksi = moment().format("YYYY-MM-DD")
    const [startDateTransaksi, setStartDateTransaksi] = useState(todayTransaksi)
    const [endDateTransaksi, setEndDateTransaksi] = useState(todayTransaksi)

    const todayPembayaran = moment().format("YYYY-MM-DD")
    const [startDatePembayaran, setStartDatePembayaran] = useState(todayPembayaran)
    const [endDatePembayaran, setEndDatePembayaran] = useState(todayPembayaran)

    const [getFilterTestTransaksi] = useState([
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

    const [getStatusArr] = useState([
        {
            key: "status_pemesanan_0",
            value: 0,
            defaultValue: "Semua Status",
            us: "All Status"
        },
        {
            key: "status_pemesanan_1",
            value: 1,
            defaultValue: "Menunggu",
            us: "W"
        },
        {
            key: "status_pemesanan_2",
            value: 2,
            defaultValue: "Gagal",
            us: "P"
        },
        {
            key: "status_pemesanan_3",
            value: 3,
            defaultValue: "Selesai",
            us: "D"
        },
    ]);

    const handleSearchByDateTransaksi = (e) => {
        e.preventDefault();

        if (!startDateTransaksi || !endDateTransaksi) {
            alert("Mohon isi tanggal mulai dan tanggal selesai.");
            return;
        }

        if (new Date(startDateTransaksi) > new Date(endDateTransaksi)) {
            alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
            return;
        }

        fetchOrderVoucher();
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setMemberData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.mmbr_name && item.mmbr_name.toLowerCase().includes(searchTerm)) ||
                (item.user_id && item.user_id.toLowerCase().includes(searchTerm)) ||
                (item.id && item.id.toLowerCase().includes(searchTerm))
            );
        });

        setMemberData(filteredData);
    };

    const handleSearchByDatePembayaran = (e) => {
        e.preventDefault();
        filterByDatePembayaran();
    };

    const filterByDatePembayaran = () => {
        const originalDataPembayaran = [...getPaymentData];

        let filteredDataPembayaran = originalDataPembayaran.filter(item => {
            const itemDate = moment(item.created_at).format("YYYY-MM-DD");
            const start = moment(startDatePembayaran).startOf('day');
            const end = moment(endDatePembayaran).endOf('day');

            return moment(itemDate).isBetween(start, end, null, '[]');
        });

        setPaymentData(filteredDataPembayaran);
    };

    const handleSearchPembayaran = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setPaymentData([...originalDataPembayaran]);
            return;
        }

        const filteredData = originalDataPembayaran.filter(item => {
            return (
                (item.id && item.id.toLowerCase().includes(searchTerm)) ||
                (item.invoice_id && item.invoice_id.toLowerCase().includes(searchTerm)) ||
                (item.user_id && item.user_id.toLowerCase().includes(searchTerm)) ||
                (item.gives_name && item.gives_name.toLowerCase().includes(searchTerm))
            );
        });

        setPaymentData(filteredData);
    };

    const orderText = (code) => {
        if (code === "001") {
            return "Menunggu";
        } else if (code === "010") {
            return "Selesai";
        } else if (code === "011") {
            return "Gagal";
        }
    }

    const iconLink = (value, url) => {
        return (
            <>
                {value} &nbsp;
                <OverlayTrigger
                    trigger={["hover", "focus"]}
                    overlay={<Tooltip>Lihat</Tooltip>}
                >
                    <Link
                        to={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </Link>
                </OverlayTrigger>
            </>
        );
    };

    const fetchOrderVoucher = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (data.success === true) {
                const latestTransactions = {};

                data.transaction.forEach((transaction) => {
                    if (
                        !latestTransactions[transaction.user_id] ||
                        new Date(transaction.created_at) > new Date(latestTransactions[transaction.user_id].created_at)
                    ) {
                        latestTransactions[transaction.user_id] = transaction;
                    }
                });

                const latestTransactionArray = Object.values(latestTransactions);

                const memberListRes = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: "" }),
                });

                const memberListData = await memberListRes.json();

                const userMap = {};
                if (Array.isArray(memberListData.data)) {
                    memberListData.data.forEach((member) => {
                        if (member.mmbr_code && member.mmbr_name) {
                            userMap[member.mmbr_code] = member.mmbr_name;
                        }
                    });
                }

                const filteredMembers = latestTransactionArray
                    .map((transaction) => {
                        const memberName = userMap[transaction.user_id]
                        if (memberName) {
                            return { ...transaction, mmbr_name: memberName }
                        }
                        return null
                    })
                    .filter(Boolean);

                let filteredDataTransaksi = filteredMembers;

                if (selectedFilter === 1) {
                    filteredDataTransaksi = filteredDataTransaksi.filter(item =>
                        !item.mmbr_name.includes("Test")
                    );
                } else if (selectedFilter === 2) {
                    filteredDataTransaksi = filteredDataTransaksi.filter(item =>
                        item.mmbr_name.includes("Test")
                    );
                }

                if (startDateTransaksi && endDateTransaksi) {
                    filteredDataTransaksi = filteredDataTransaksi.filter(item => {
                        const itemDate = moment(item.created_at).format("YYYY-MM-DD");
                        const start = moment(startDateTransaksi).startOf('day');
                        const end = moment(endDateTransaksi).endOf('day');
                        return moment(itemDate).isBetween(start, end, null, '[]');
                    });
                }

                filteredDataTransaksi.sort((a, b) => b.created_at - a.created_at);

                setOriginalData(filteredDataTransaksi)
                setMemberData(filteredDataTransaksi)
                setIsLoading(false)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPaymentVoucher = async () => {
        try {

            const res = await fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/payment-voucher`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            let extractedData = Array.isArray(data.payment) ? data.payment : Array.isArray(data) ? data : [];

            let filteredDataPembayaran = extractedData;

            if (startDatePembayaran && endDatePembayaran) {
                filteredDataPembayaran = filteredDataPembayaran.filter(item => {
                    const itemDate = moment(item.created_at).format("YYYY-MM-DD");
                    const start = moment(startDatePembayaran).startOf('day');
                    const end = moment(endDatePembayaran).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            filteredDataPembayaran.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            filteredDataPembayaran = filteredDataPembayaran.map((item) => {
                let parsedCustomer = {};
                try {
                    parsedCustomer = JSON.parse(item.customer);
                } catch (error) {
                    console.error("JSON parse error:", error);
                }

                return {
                    ...item,
                    gives_name: parsedCustomer.gives_name || "Nama tidak ditemukan",
                };
            });

            if (selectedStatus === 0) {
                filteredDataPembayaran = filteredDataPembayaran
            } else if (selectedStatus === 1) {
                filteredDataPembayaran = filteredDataPembayaran.filter((item) => item.status_order === "001")
            } else if (selectedStatus === 2) {
                filteredDataPembayaran = filteredDataPembayaran.filter((item) => item.status_order === "011")
            } else if (selectedStatus === 3) {
                filteredDataPembayaran = filteredDataPembayaran.filter((item) => item.status_order === "010")
            }

            if (selectedFilterPembayaran === 1) {
                filteredDataPembayaran = filteredDataPembayaran.filter(item =>
                    !item.gives_name.includes("Test") &&
                    !item.gives_name.includes("test") &&
                    !item.gives_name.includes("testt") &&
                    !item.gives_name.includes("Testing")
                );
            } else if (selectedFilterPembayaran === 2) {
                filteredDataPembayaran = filteredDataPembayaran.filter(item =>
                    item.gives_name.includes("Test") ||
                    item.gives_name.includes("test") ||
                    item.gives_name.includes("testt") ||
                    item.gives_name.includes("Testing")
                );
            }

            setOriginalDataPembayaran(filteredDataPembayaran)
            setPaymentData(filteredDataPembayaran)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrderVoucher();
        fetchPaymentVoucher();
    }, [selectedFilterPembayaran, selectedStatus]);

    const TableRowMember = (props) => {
        const {
            id,
            user_id,
            in_point,
            out_point,
            mmbr_name,
            description,
            created_at,
        } = props;

        return (
            <tr>
                <td className="text-center">{props.num}</td>
                <td className="text-center">{id}</td>
                <td>{mmbr_name} - {iconLink(user_id, `/member/profile/${user_id}`)}</td>
                <td className="text-center">{ReadableDateTime(created_at)}</td>
                <td className="text-center">
                    {in_point === null ? (
                        <span className="text-danger">{calcAmount(out_point)} -</span>
                    ) : (
                        <span className="text-success">{calcAmount(in_point)} +</span>
                    )}
                </td>
                <td>{description}</td>
                <td className="text-center">
                    <Link
                        to={`/order/voucher/order-voucher-detail/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                            &nbsp; Detail
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    };

    const TableRowPayment = (props) => {
        const {
            id,
            invoice_id,
            user_id,
            amount,
            description,
            status_order,
            payment_status,
            gives_name,
            created_at,
        } = props;

        return (
            <tr className="text-center">
                <td>{props.num}</td>
                <td>{id}</td>
                <td>{invoice_id}</td>
                <td>{gives_name} - {user_id}</td>
                <td>{calcAmount(amount, false)}</td>
                <td>{description}</td>
                <td>
                    <Badge bg={status_order === "001" ? "warning" : status_order === "010" ? "success" : status_order === "011" ? "danger" : ""} className="badge-lg">
                        {status_order === "001" ? 'Menunggu' : status_order === "010" ? "Selesai" : status_order === "011" ? "Gagal" : ""}
                    </Badge>
                </td>
                <td>{payment_status}</td>
                <td>{ReadableDateTime(created_at)}</td>
                <td>
                    <Link
                        to={`/order/voucher/payment-voucher-detail/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                            &nbsp; Detail
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    }

    return (
        <>
            <Preloader
                show={!getPaymentData && !getTransaksiData ? true : false}
            />

            {/* {isLoading && <Loading />} */}

            <Col xl={12} className="mt-2">
                <Tab.Container defaultActiveKey="member_voucher_tab">
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="member_voucher_tab">Transaksi</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="payment_voucher_tab">Pembayaran</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="member_voucher_tab">
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
                                                            {getFilterTestTransaksi?.map((item) => (
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
                                                                    value={startDateTransaksi}
                                                                    onChange={(e) => setStartDateTransaksi(e.target.value)}
                                                                />
                                                                <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                                <Form.Control
                                                                    type="date"
                                                                    name="end_date_time"
                                                                    step="1"
                                                                    required
                                                                    value={endDateTransaksi}
                                                                    onChange={(e) => setEndDateTransaksi(e.target.value)}
                                                                />
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={handleSearchByDateTransaksi}
                                                                >
                                                                    Search
                                                                </Button>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>

                                            <TnosDataTable
                                                getExportData={getTransaksiData}
                                                getMenu={`order-voucher-transaksi`}
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0 text-center">Id</th>
                                                                <th className="border-0">Pengguna</th>
                                                                <th className="border-0 text-center">Tanggal</th>
                                                                <th className="border-0 text-center">
                                                                    Voucher (
                                                                    <span className="text-success">
                                                                        {" "}
                                                                        Pembelian +{" "}
                                                                    </span>
                                                                    /
                                                                    <span className="text-danger">
                                                                        {" "}
                                                                        Penggunaan -{" "}
                                                                    </span>
                                                                    )
                                                                </th>
                                                                <th className="border-0">Deskripsi</th>
                                                                <th className="border-0 text-center"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getTransaksiData?.length > 0 ? (
                                                                getTransaksiData?.map((m, index) => (
                                                                    <TableRowMember
                                                                        key={`member-${m.mmbr_code}`}
                                                                        {...m}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={9}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </>
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>

                                <Tab.Pane eventKey="payment_voucher_tab">
                                    <Card border="light">
                                        <Card.Body>
                                            <Row className="mb-3">
                                                <Col md={5}>
                                                    <Form>
                                                        <Form.Group id="topbarSearch">
                                                            <Form.Label>Cari Pembayaran</Form.Label>
                                                            <InputGroup className="input-group-merge search-bar">
                                                                <InputGroup.Text>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Cari Pembayaran"
                                                                    id="all_search"
                                                                    ref={searchInputRef}
                                                                />
                                                                <Button variant="primary" onClick={handleSearchPembayaran}>
                                                                    Search
                                                                </Button>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>

                                                <Col md={1}>
                                                    <Form.Group id="transaction_status">
                                                        <Form.Label>Status</Form.Label>
                                                        <Form.Select
                                                            name="transaction_status"
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                                        >
                                                            {getStatusArr?.map((item) => (
                                                                <option key={item.key} value={item.value}>
                                                                    {item.defaultValue}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={1}>
                                                    <Form.Group id="filter_test">
                                                        <Form.Label>Filter</Form.Label>
                                                        <Form.Select
                                                            name="transaction_status"
                                                            value={selectedFilterPembayaran}
                                                            onChange={(e) => setSelectedFilterPembayaran(parseInt(e.target.value))}
                                                            required
                                                        >
                                                            {getFilterTestTransaksi?.map((item) => (
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
                                                                    name="start_date_time_pembayaran"
                                                                    step="1"
                                                                    required
                                                                    value={startDatePembayaran}
                                                                    onChange={(e) => setStartDatePembayaran(e.target.value)}
                                                                />
                                                                <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                                <Form.Control
                                                                    type="date"
                                                                    name="end_date_time_pembayaran"
                                                                    step="1"
                                                                    required
                                                                    value={endDatePembayaran}
                                                                    onChange={(e) => setEndDatePembayaran(e.target.value)}
                                                                />
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={handleSearchByDatePembayaran}
                                                                >
                                                                    Search
                                                                </Button>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>

                                            <TnosDataTable
                                                getExportData={getPaymentData}
                                                getMenu={`order-voucher-pembayaran`}
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr className="text-center">
                                                                <th className="border-0">No.</th>
                                                                <th className="border-0">Id</th>
                                                                <th className="border-0">Id Invoice</th>
                                                                <th className="border-0">Id User</th>
                                                                <th className="border-0">Jumlah</th>
                                                                <th className="border-0">Deskripsi</th>
                                                                <th className="border-0">Status Pemesanan</th>
                                                                <th className="border-0">Status Pembayaran</th>
                                                                <th className="border-0">Tanggal Dibuat</th>
                                                                <th className="border-0">Detail</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getPaymentData?.length > 0 ? (
                                                                getPaymentData?.map((td, index) => (
                                                                    <TableRowPayment
                                                                        key={`payment-voucher-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={10}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </>
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
        </>
    );
};
