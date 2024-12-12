import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Preloader from "../../components/Preloader";
import { TnosDataTable } from "../../components/TnosDataTable";
import ReadableDateTime from "../../components/ReadableDateTime";
import { faEdit, faInfoCircle, faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import TodayDate from "../../components/TodayDate";
import DateBetweenFilter from "../../components/DateBetweenFilter";
import moment from "moment";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [getLoadingData, setLoadingData] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedTipeLayanan, setSelectedTipeLayanan] = useState(0)
    const [selectedTipe, setSelectedTipe] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [getOrderData, setOrderData] = useState();
    const [getAllOrderData, setAllOrderData] = useState();
    const [getTotalAmountToday, setTotalAmountToday] = useState()
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada pemesanan pada hari ini"
    )
    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null);

    const [getServiceTypeArr] = useState([
        {
            key: "service_type_0",
            value: 0,
            defaultValue: "Semua Layanan",
            tnos_service_id: 0,
            tnos_subservice_id: 0,
        },
        {
            key: "service_type_1",
            value: 1,
            defaultValue: "Pengamanan Usaha & Bisnis",
            tnos_service_id: 2,
            tnos_subservice_id: 2,
        },
        {
            key: "service_type_2",
            value: 2,
            defaultValue: "Badan Hukum PT",
            tnos_service_id: 3,
            tnos_subservice_id: 1,
        },
        {
            key: "service_type_3",
            value: 3,
            defaultValue: "Badan Usaha CV",
            tnos_service_id: 3,
            tnos_subservice_id: 2,
        },
        {
            key: "service_type_4",
            value: 4,
            defaultValue: "Yayasan",
            tnos_service_id: 3,
            tnos_subservice_id: 3,
        },
        {
            key: "service_type_5",
            value: 5,
            defaultValue: "Perkumpulan",
            tnos_service_id: 3,
            tnos_subservice_id: 4,
        },
        {
            key: "service_type_6",
            value: 6,
            defaultValue: "Legalitas Lainnya",
            tnos_service_id: 3,
            tnos_subservice_id: 6,
        },
        {
            key: "service_type_7",
            value: 7,
            defaultValue: "Komprehensif Solusi Hukum",
            tnos_service_id: 3,
            tnos_subservice_id: 7,
        },
        {
            key: "service_type_8",
            value: 8,
            defaultValue: "Pembayaran Lainnya",
            tnos_service_id: 3,
            tnos_subservice_id: 8,
        },
        {
            key: "service_type_9",
            value: 9,
            defaultValue: "Manual Order",
            tnos_service_id: 3,
            tnos_subservice_id: 9
        }
    ])

    const [getDetailLayanan] = useState([
        {
            key: "detail_layanan_0",
            value: 0,
            defaultValue: "Pilih Layanan"
        },
        {
            key: "detail_layanan_1",
            value: 1,
            defaultValue: "PAS"
        },
        {
            key: "detail_layanan_2",
            value: 2,
            defaultValue: "P1 Force"
        },
        {
            key: "detail_layanan_3",
            value: 3,
            defaultValue: "Pengamanan Usaha & Bisnis"
        }
    ])

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
    ])

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [getOrderStatusArr] = useState([
        {
            key: "order_status_2",
            value: 2,
            defaultValue: "Order diproses",
            us: "002",
            desc: "Admin sedang memproses order",
            color: "primary",
        },
        {
            key: "order_status_3",
            value: 3,
            defaultValue: "Siap Bertugas",
            us: "003",
            desc: "Mitra telah tersedia",
            color: "primary",
        },
        {
            key: "order_status_4",
            value: 4,
            defaultValue: "Menuju Lokasi",
            us: "004",
            desc: "Mitra sedang menuju lokasi",
            color: "primary",
        },
        {
            key: "order_status_5",
            value: 5,
            defaultValue: "Hadir dan Sedang Bertugas",
            us: "005",
            desc: "Mitra telah hadir di lokasi",
            color: "primary",
        },
        {
            key: "order_status_6",
            value: 6,
            defaultValue: "Selesai",
            us: "010",
            desc: "Hardcopy telah diterima oleh Klien",
            color: "primary",
        },
    ]);

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
            defaultValue: "Memesan",
            us: "ORDER",
            desc: "Memesan tapi belum masuk ke menu pembayaran",
            color: "primary",
        },
        {
            key: "payment_status_2",
            value: 2,
            defaultValue: "Belum Dibayar",
            us: "UNPAID",
            desc: "Tautan pembayaran sudah berhasil dibuat dan dapat dibayarkan oleh Pelanggan Anda sampai tanggal kedaluwarsa yang Anda tentukan",
            color: "danger",
        },
        {
            key: "payment_status_3",
            value: 3,
            defaultValue: "Sudah Dibayar",
            us: "PAID",
            desc: "Tautan pembayaran sudah berhasil dibayarkan oleh pelanggan Anda",
            color: "success",
        },
        {
            key: "payment_status_4",
            value: 4,
            defaultValue: "Selesai",
            us: "SETTLED",
            desc: "Dana sudah berhasil diteruskan ke akun Xendit Anda dan dapat ditarik melalui tab Saldo",
            color: "success",
        },
        {
            key: "payment_status_5",
            value: 5,
            defaultValue: "Kadaluarsa",
            us: "EXPIRED",
            desc: "Pembayaran Kadaluarsa",
            color: "danger",
        },
    ])

    const handleOrderStatusChange = (id) => (event) => {
        const selectedOrderStatus = event.target.value;
        const selectedOrderStatusData = getOrderStatusArr.find(
            (status) => status.value === parseInt(selectedOrderStatus)
        );

        Swal.fire({
            title: "Konfirmasi",
            html: `<p>Apakah anda yakin ingin mengubah status menjadi <br> <strong>${selectedOrderStatusData.defaultValue}</strong> ?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
        })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(
                        `${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/pemesanan/${id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                status_order: selectedOrderStatusData.us,
                            }),
                        }
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.status == true) {
                                Swal.fire("Success!", data.message, "success");
                                fetchData()
                            }
                        })
                        .catch((err) => {
                            Swal.fire("Error!", err, "error");
                        });
                }
            })
            .catch((error) => {
                Swal.fire("Error!", error, "error");
            });
    };

    const showButton = (id) => {

        const url = `${window.location.href}/${id}/form`;

        Swal.fire({
            title: "Silahkan Copy Link Dibawah Ini",
            html: `<strong>${url}</strong>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
        }).then((res) => {
            if (res.isConfirmed) {
                Swal.fire("success", "Berhasil Copy Link", "success");
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const TableRow = (props) => {
        const {
            id,
            tnos_invoice_id,
            external_id,
            paid_at,
            order_total,
            user_id,
            name,
            partner_name,
            status_order,
            tnos_service_id,
            tnos_subservice_id
        } = props;

        return (
            <tr className="text-center">
                <td>{props.num}</td>
                <td>
                    {!tnos_invoice_id ? (
                        <Badge bg="primary" className="badge-lg">
                            Menunggu Konfirmasi &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        No. Invoice akan muncul setelah pemesanan dikonfirmasi
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : (
                        <Link
                            to={`/pwa-b2b/order/detail`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span
                                onClick={() => {
                                    localStorage.setItem(
                                        "pwaB2bOrderDataById",
                                        JSON.stringify(
                                            getAllOrderData.filter((item) => item.id === id)[0]
                                        )
                                    );
                                }}
                            >
                                {tnos_invoice_id}
                            </span>
                        </Link>
                    )}
                </td>
                <td>{external_id}</td>
                <td>{ReadableDateTime(paid_at)}</td>
                <td>
                    {status_order === "010" ? (
                        <>
                            <Badge bg="success" className="badge-lg">
                                Selesai &nbsp;
                                <OverlayTrigger
                                    trigger={["hover", "focus"]}
                                    overlay={
                                        <Tooltip>
                                            Status Pemesanan Telah Selesai
                                        </Tooltip>
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        style={{ cursor: "pointer" }}
                                    />
                                </OverlayTrigger>
                            </Badge>
                        </>
                    ) : (
                        <>
                            <Form.Select
                                value={
                                    getOrderStatusArr.find((status) => status.us === status_order)?.value || ""
                                }
                                size="sm"
                                onChange={handleOrderStatusChange(id)}
                                style={{ width: "250px" }}
                            >
                                <option value="">- Pilih -</option>
                                {getOrderStatusArr
                                    .filter((status) => status.us >= status_order) // Filter out previous statuses
                                    .map((status) => (
                                        <option key={status.key} value={status.value}>
                                            {status.defaultValue}
                                        </option>
                                    ))}
                            </Form.Select>
                        </>
                    )}
                </td>
                <td className="text-center">
                    {tnos_service_id === "2" && tnos_subservice_id === "2" ? (
                        "Pengamanan Usaha & Bisnis"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "1" ? (
                        "Badan Hukum PT"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "2" ? (
                        "Badan Usaha CV"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "3" ? (
                        "Yayasan"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "4" ? (
                        "Perkumpulan"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "5" ? (
                        "Asosiasi"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "6" ? (
                        "Legalitas Lainnya"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "7" ? (
                        "Komprehensif Solusi Hukum"
                    ) : tnos_service_id === "3" && tnos_subservice_id === "8" ? (
                        "Pembayaran Lainnya"
                    ) : tnos_service_id === "4" && tnos_subservice_id === "1" ? (
                        "PAS"
                    ) : tnos_service_id === "6" && tnos_subservice_id === "1" ? (
                        "P1 Force"
                    ) : (
                        <>
                            &nbsp;
                        </>
                    )}
                </td>
                <td>
                    <a
                        href={"/member/profile/" + user_id}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {name}
                    </a>
                </td>
                <td>{partner_name == null ? "-" : partner_name}</td>
                <td>{"IDR " + parseInt(order_total).toLocaleString("id-ID", {})}</td>
                <td>
                    <Link
                        to={`/pwa-b2b/order/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                const selectedData = getOrderData.find((item) => item.id === id);
                                localStorage.setItem("pwaB2bOrderDataById", JSON.stringify(selectedData))
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                    <Button
                        variant="primary"
                        size="sm"
                        className="text-white"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                            showButton(id)
                        }}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                </td>
            </tr>
        );
    };

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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setOrderData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.tnos_invoice_id && item.tnos_invoice_id.toLowerCase().includes(searchTerm)) ||
                (item.external_id && item.external_id.toLowerCase().includes(searchTerm)) ||
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setOrderData(filteredData);
    };

    const fetchData = async () => {

        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/order?type=pendapatan`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let extractedData = Array.isArray(data.detail) ? data.detail : Array.isArray(data) ? data : [];

        let filteredData = extractedData;

        if (selectedTipe === 0) {
            filteredData = filteredData
        } else if (selectedTipe === 1) {
            if (selectedTipeLayanan === 1) {
                filteredData = filteredData.filter(item => item.tnos_service_id === "4" && item.tnos_subservice_id === "1")
            } else if (selectedTipeLayanan === 2) {
                filteredData = filteredData.filter(item => item.tnos_service_id === "6" && item.tnos_subservice_id === "1")
            } else if (selectedTipeLayanan === 3) {
                filteredData = filteredData.filter(item => item.tnos_service_id === "2" && item.tnos_subservice_id === "2")
            }
        } else if (selectedTipe === 2) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "1")
        } else if (selectedTipe === 3) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "2")
        } else if (selectedTipe === 4) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "3")
        } else if (selectedTipe === 5) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "4")
        } else if (selectedTipe === 6) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "6")
        } else if (selectedTipe === 7) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "7")
        } else if (selectedTipe === 8) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "8")
        } else if (selectedTipe === 9) {
            filteredData = filteredData.filter(item => item.tnos_service_id === "3" && item.tnos_subservice_id === "9")
        }

        if (selectedTipe !== 1) {
            setSelectedTipeLayanan(0)
        }

        if (selectedFilter === 1) {
            filteredData = filteredData.filter(
                item => item.name != null &&
                    !item.name.includes("GUEST") &&
                    !item.name.includes("US3R T35T!N6 001") &&
                    !item.name.includes("Test") &&
                    !(item.external_id && item.external_id.includes("TESTING"))
            );
        } else if (selectedFilter === 2) {
            filteredData = filteredData.filter(
                item => !item.name ||
                    item.name.includes("GUEST") ||
                    item.name.includes("US3R T35T!N6 001") ||
                    item.name.includes("Test") ||
                    (item.external_id && item.external_id.includes("TESTING"))
            );
        }

        if (startDate && endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = moment(item.created_at).format("YYYY-MM-DD");
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return moment(itemDate).isBetween(start, end, null, '[]');
            });
        }

        filteredData.sort((a, b) => b.created_at - a.created_at);
        const totalAmountToday = filteredData.reduce((sum, item) => sum + parseFloat(item.order_total || 0), 0);

        const formattedTotalAmount = totalAmountToday.toLocaleString("id-ID", {
            minimumFractionDigits: 0
        });

        setTotalAmountToday(formattedTotalAmount)
        setOriginalData(filteredData)
        setOrderData(filteredData)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Preloader show={!getTotalAmountToday ? true : false} />

            {isLoading && <Loading/> }

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={2}>
                                <Form.Group id="service_type">
                                    <Form.Label>Layanan</Form.Label>
                                    <Form.Select
                                        name="service_type"
                                        value={selectedTipe}
                                        onChange={(e) => setSelectedTipe(parseInt(e.target.value))}
                                        required
                                    >
                                        {getServiceTypeArr?.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {selectedTipe === 1 && (
                                <Col md={2}>
                                    <Form.Group id="detail_layanan">
                                        <Form.Label>Detail Layanan</Form.Label>
                                        <Form.Select
                                            name="detail_layanan"
                                            value={selectedTipeLayanan}
                                            onChange={(e) => setSelectedTipeLayanan(parseInt(e.target.value))}
                                            required
                                        >
                                            {getDetailLayanan?.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            )}

                            <Col md={2}>
                                <Form.Group id="transaction_status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                        required
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

                        <Row className="mb-3">
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari"
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
                        </Row>

                        <TnosDataTable
                            title={
                                `Total : IDR ${getTotalAmountToday} `
                            }
                            getExportData={getOrderData}
                            getMenu={`pwa-b2b-order`}
                            data={
                                <>
                                    <thead className="thead-light text-center" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">No. Invoice</th>
                                            <th className="border-0 text-center">ID Referensi</th>
                                            <th className="border-0">Waktu Transaksi</th>
                                            <th className="border-0">Status Pemesanan</th>
                                            <th className="border-0">Layanan</th>
                                            <th className="border-0">Member</th>
                                            <th className="border-0">Partner</th>
                                            <th className="border-0">Jumlah</th>
                                            <th className="border-0">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getOrderData?.length > 0 ? (
                                            getOrderData?.map((td, index) => (
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
    );
};