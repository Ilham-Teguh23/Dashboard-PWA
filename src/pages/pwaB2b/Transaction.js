import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ReadableDateTime from "../../components/ReadableDateTime";
import { faInfoCircle, faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Preloader from "../../components/Preloader";
import "../../styles/loading.css"
import Loading from "../../components/Loading";

const Transaction = () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedTipeLayanan, setSelectedTipeLayanan] = useState(0)
    const [selectedTipe, setSelectedTipe] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [getTransactionData, setTransactionData] = useState([]);
    const [getMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    );
    const [isLoading, setIsLoading] = useState(false);

    const searchInputRef = useRef(null);

    const [getTotalAmountToday, setTotalAmountToday] = useState();

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
            us: "PAID_SETTLED",
            desc: "Tautan pembayaran sudah berhasil dibayarkan oleh pelanggan Anda",
            color: "success",
        },
        {
            key: "payment_status_5",
            value: 4,
            defaultValue: "Kadaluarsa",
            us: "EXPIRED",
            desc: "Pembayaran Kadaluarsa",
            color: "danger",
        },
    ]);

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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setTransactionData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.tnos_invoice_id && item.tnos_invoice_id.toLowerCase().includes(searchTerm)) ||
                (item.external_id && item.external_id.toLowerCase().includes(searchTerm)) ||
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });
        setTransactionData(filteredData)
    };

    const fetchData = async () => {

        setIsLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/order?type=transaksi`);
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

        if (selectedStatus === 0) {
            filteredData = filteredData
        } else if (selectedStatus === 1) {
            filteredData = filteredData.filter(item => item.payment_status === "ORDER")
        } else if (selectedStatus === 2) {
            filteredData = filteredData.filter(item => item.payment_status === "UNPAID")
        } else if (selectedStatus === 3) {
            filteredData = filteredData.filter(item => item.payment_status === "PAID" || item.payment_status === "SETTLED")
        } else if (selectedStatus === 4) {
            filteredData = filteredData.filter(item => item.payment_status === "EXPIRED")
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
        setTransactionData(filteredData)
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [])

    const TableRow = (props) => {
        const {
            external_id,
            tnos_subservice_id,
            tnos_service_id,
            tnos_invoice_id,
            id,
            created_at,
            paid_at,
            order_total,
            user_id,
            name,
            phone,
            partner_name,
            payment_method,
            payment_channel,
            status_order,
            payment_status
        } = props;

        return (
            <tr>
                <td className="text-center">{props.num}</td>
                <td className="text-center">
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
                                const selectedData = getTransactionData.find((item) => item.id === id);
                                localStorage.setItem("pwaB2bOrderDataById", JSON.stringify(selectedData))
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
                <td className="text-center">
                    {payment_status === "EXPIRED" ? (
                        <Badge bg="danger" className="badge-lg">
                            Tidak Ada Invoice &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Tidak Ada Invoice, Karena Sudah Kadaluarsa
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : payment_status === "PAID" || payment_status === "SETTLED" ? (
                        <span>
                            {tnos_invoice_id}
                        </span>
                    ) : payment_status === "ORDER" ? (
                        <Badge bg="warning" className="badge-lg">
                            Belum Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sudah Memesan, Namun Belum Melakukan Pembayaran
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : payment_status === "UNPAID" ? (
                        <Badge bg="primary" className="badge-lg">
                            Menunggu Pembayaran &nbsp;
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
                        <>
                            {payment_status}
                        </>
                    )}
                </td>
                <td className="text-center">{external_id}</td>
                <td className="text-center">
                    {payment_status === "EXPIRED" ? (
                        <Badge bg="danger" className="badge-lg">
                            Kadaluarsa &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Waktu Pembayaran Telah Kadaluarsa
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : payment_status === "PAID" || payment_status === "SETTLED" ? (
                        <Badge bg="success" className="badge-lg">
                            Sudah Dibayar {payment_status == "PAID" ? "PAID" : "SETTLED"} &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sudah Melakukan Pembayaran
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : payment_status === "ORDER" ? (
                        <Badge bg="warning" className="badge-lg">
                            Belum Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Sudah Memesan, Namun Belum Melakukan Pembayaran
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : payment_status === "UNPAID" ? (
                        <Badge bg="primary" className="badge-lg">
                            Menunggu Pembayaran &nbsp;
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
                        <>
                            {payment_status}
                        </>
                    )}
                </td>
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
                                        Waktu Pembayaran Telah Kadaluarsa
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
                    {ReadableDateTime(created_at)}
                </td>
                <td className="text-center">
                    {paid_at === null ? (
                        "-"
                    ) : (
                        ReadableDateTime(paid_at)
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
                    ) : tnos_service_id === "3" && tnos_subservice_id === "9" ? (
                        "Manual Order"
                    ) : (
                        <>
                            &nbsp;
                        </>
                    )}
                </td>
                <td className="text-center">
                    <a
                        href={"/member/profile/" + user_id}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {name}
                    </a>
                </td>
                <td className="text-center">
                    {partner_name === null ? "-" : partner_name}
                </td>
                <td className="text-center">{phone}</td>
                <td className="text-center">
                    {payment_status === "EXPIRED" ? (
                        "Tidak Ada"
                    ) : payment_status === "ORDER" ? (
                        <Badge bg="warning" className="badge-lg">
                            Belum Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Customer Sudah Memesan, Namun Belum Melakukan Pembayaran
                                    </Tooltip>
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : !payment_method && !payment_channel ? (
                        <Badge bg="primary" className="badge-lg">
                            Menunggu Pembayaran &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        Metode Pembayaran akan muncul setelah pembayaran selesai
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
                        <span className="fw-bold">
                            {`${payment_method} - (${payment_channel})`}
                        </span>
                    )}
                </td>
                <td className="text-center">
                    {"IDR " + parseInt(order_total).toLocaleString("id-ID", {})}
                </td>
            </tr>
        );
    };

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
                            getExportData={getTransactionData}
                            getMenu={`pwa-transaction`}
                            getTanggalMulai={startDate}
                            getTanggalAkhir={endDate}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Detail</th>
                                            <th className="border-0 text-center">No. Invoice</th>
                                            <th className="border-0 text-center">ID Referensi</th>
                                            <th className="border-0 text-center">Status Transaksi</th>
                                            <th className="border-0 text-center">Status Pemesanan</th>
                                            <th className="border-0 text-center">Waktu Pesanan Dibuat</th>
                                            <th className="border-0 text-center">Waktu Transaksi</th>
                                            <th className="border-0 text-center">Layanan</th>
                                            <th className="border-0 text-center">Member</th>
                                            <th className="border-0 text-center">Nama Partner</th>
                                            <th className="border-0 text-center">Nomor HP</th>
                                            <th className="border-0 text-center">
                                                Metode Pembayaran
                                            </th>
                                            <th className="border-0 text-center">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getTransactionData?.length > 0 ? (
                                            getTransactionData?.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    {...td}
                                                    num={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colspan={14}>{getMessageEmptyData}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            }
                        >

                        </TnosDataTable>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default Transaction