import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThList, faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Row,
    Button,
    Form,
    InputGroup,
    Badge,
    OverlayTrigger,
    Tooltip,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import ReadableDateTime from "../../components/ReadableDateTime";
import moment from "moment";
import Preloader from "../../components/Preloader";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedTipeLayanan, setSelectedTipeLayanan] = useState(0)
    const [selectedTipe, setSelectedTipe] = useState(0)
    const [getIncomeData, setIncomeData] = useState();
    const [getAllIncomeData, setAllIncomeData] = useState();
    const [getTotalAmountToday, setTotalAmountToday] = useState();
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada pendapatan pada hari ini"
    );

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

    const [isLoading, setIsLoading] = useState(false);

    const searchInputRef = useRef(null)

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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setIncomeData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.tnos_invoice_id && item.tnos_invoice_id.toLowerCase().includes(searchTerm)) ||
                (item.invoice_id && item.invoice_id.toLowerCase().includes(searchTerm))
            )
        });

        setIncomeData(filteredData);
    };

    const fetchData = async () => {

        try {

            setIsLoading(true)
            const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/order?type=pemesanan`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let extractedData = Array.isArray(data.detail) ? data.detail : Array.isArray(data) ? data : [];

            let filteredData = extractedData

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

            filteredData = filteredData.filter((item) => item.status_order === "010")

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
            setIncomeData(filteredData)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        fetchData()
    }, [])

    const TableRow = (props) => {
        const {
            id,
            tnos_invoice_id,
            invoice_id,
            paid_at,
            tnos_service_id,
            tnos_subservice_id,
            status_order,
            pendapatan_tnos,
            finished_at
        } = props;

        return (
            <tr className="text-center">
                <td className="text-center">{props.num}</td>
                <td className="text-center">
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
                                            getAllIncomeData.filter((item) => item.id === id)[0]
                                        )
                                    );
                                }}
                            >
                                {tnos_invoice_id}
                            </span>
                        </Link>
                    )}
                </td>
                <td className="text-center">
                    {!invoice_id ? (
                        <Badge bg="primary" className="badge-lg">
                            Menunggu Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Id transaksi akan muncul setelah pembayaran selesai
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
                            to={`/pwa-b2b/transaction/detail`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span
                                onClick={() => {
                                    localStorage.setItem(
                                        "pwaB2bIncomeDataById",
                                        JSON.stringify(
                                            getAllIncomeData.filter((item) => item.id === id)[0]
                                        )
                                    );
                                }}
                            >
                                {invoice_id}
                            </span>
                        </Link>
                    )}
                </td>
                <td className="text-center">{ReadableDateTime(paid_at)}</td>
                <td className="text-center">{ReadableDateTime(finished_at)}</td>
                <td className="text-center">
                    {status_order === "001" ? (
                        <Badge bg="warning" className="badge-lg">
                            Belum Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Customer belum melanjutkan ke pembayaran
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "002" ? (
                        <Badge bg="primary" className="badge-lg">
                            Order Diproses &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Admin sedang memproses order
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "003" ? (
                        <Badge bg="primary" className="badge-lg">
                            Mitra telah tersedia &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Siap Bertugas
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "004" ? (
                        <Badge bg="info" className="badge-lg">
                            Mitra sedang menuju lokasi &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Menuju Lokasi
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "005" ? (
                        <Badge bg="info" className="badge-lg">
                            Hadir dan Sedang Bertugas &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Mitra telah hadir di lokasi
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "006" ? (
                        <Badge bg="info" className="badge-lg">
                            Proses Pembuatan Akta &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sedang Proses Pembuatan Akta
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "007" ? (
                        <Badge bg="info" className="badge-lg">
                            Proses SK MENKUMHAM &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sedang Proses Pembuatan SK MENKUMHAM
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "008" ? (
                        <Badge bg="info" className="badge-lg">
                            Proses NPWP &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sedang Proses Pembuatan NPWP
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "009" ? (
                        <Badge bg="info" className="badge-lg">
                            Proses NIB &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sedang Proses Pembuatan NIB
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "010" ? (
                        <Badge bg="success" className="badge-lg">
                            Selesai &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Hardcopy telah diterima oleh Klien
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : status_order === "011" ? (
                        <Badge bg="danger" className="badge-lg">
                            Gagal &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Gagal
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
                        <>
                            &nbsp;
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
                    {"IDR " + parseInt(pendapatan_tnos).toLocaleString("id-ID", {})}
                </td>
                <td>
                    <Link
                        to={`/pwa-b2b/transaction/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                localStorage.setItem(
                                    "pwaB2bIncomeDataById",
                                    JSON.stringify(
                                        getAllIncomeData.filter((item) => item.id === id)[0]
                                    )
                                );
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    }

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
                                    <Form.Label>Tipe Layanan</Form.Label>
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
                                            <Button variant="primary" onClick={handleSearchByDate}>
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
                                `Total IDR ${getTotalAmountToday}`
                            }
                            getExportData={getIncomeData}
                            getMenu={`pwa-b2b-income`}
                            data={
                                <>
                                    <thead
                                        className="thead-light"
                                        style={{ position: "sticky", top: 0, zIndex: 1 }}
                                    >
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">No. Invoice</th>
                                            <th className="border-0 text-center">ID Transaksi</th>
                                            <th className="border-0 text-center">Waktu Transaksi</th>
                                            <th className="border-0 text-center">Waktu Selesai</th>
                                            <th className="border-0 text-center">Status Pemesanan</th>
                                            <th className="border-0 text-center">Layanan</th>
                                            <th className="border-0 text-center">PENDAPATAN</th>
                                            <th className="border-0">Detail</th>
                                            {/* <th className="border-0">Export PDF</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getIncomeData?.length > 0 ? (
                                            getIncomeData?.map((td, index) => (
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

}