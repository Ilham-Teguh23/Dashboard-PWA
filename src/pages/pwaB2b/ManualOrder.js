import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faSearch, faThList, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import ReadableDateTime from "../../components/ReadableDateTime";
import moment from "moment";
import axios from "axios"
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import Preloader from "../../components/Preloader";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [getManualOrder, setManualOrder] = useState([]);
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada data pada hari ini"
    );

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [getTotalAmountToday, setTotalAmountToday] = useState(0)

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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/manual-order/in-order-manual/${id}`);
                fetchData();
                Swal.fire(
                    'Berhasil!',
                    'Data telah berhasil dihapus.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting data:', error);
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data.',
                    'error'
                );
            }
        }
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setManualOrder([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.tnos_invoice_id && item.tnos_invoice_id.toLowerCase().includes(searchTerm)) ||
                (item.external_id && item.external_id.toLowerCase().includes(searchTerm)) ||
                (item.name && item.name.toLowerCase().includes(searchTerm))
            );
        });

        setManualOrder(filteredData);
    };

    const fetchData = async () => {

        try {
        
            setIsLoading(true)

            const response = await fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/manual-order/in-order-manual`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item =>
                    !item.name.toLowerCase().includes("testing")
                );
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter(item => 
                    item.name.toLowerCase().includes("testing")
                )
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

            setTotalAmountToday(formattedTotalAmount);

            setOriginalData(filteredData)
            setManualOrder(filteredData)
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
            external_id,
            file_document,
            tnos_invoice_id,
            id,
            created_at,
            paid_at,
            order_total,
            user_id,
            name,
            phone,
            payment_method,
            payment_channel,
            status_order,
            payment_status,

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
                                const selectedData = getManualOrder.find((item) => item.id === id);
                                localStorage.setItem("pwaB2bOrderDataById", JSON.stringify(selectedData))
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                    <Link
                        to={`/pwa-b2b/manual-order/${id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            style={{ marginLeft: '5px' }}
                            variant="warning"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                const selectedData = getManualOrder.find((item) => item.id === id);
                                localStorage.setItem("pwaB2bOrderDataById", JSON.stringify(selectedData))
                            }}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </Link>
                    <Button
                        style={{ marginLeft: '5px' }}
                        variant="danger"
                        size="sm"
                        className="text-white"
                        onClick={() => handleDelete(id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </td>
                <td className="text-center">
                    {file_document === null ? (
                        <>
                            <Link
                                to={`/pwa-b2b/manual-order/${id}/upload`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="text-white"
                                >
                                    <FontAwesomeIcon icon={faUpload} /> Upload
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {typeof file_document === "string" ? (
                                JSON.parse(file_document).length > 0 ? (
                                    JSON.parse(file_document).map((file, idx) => (
                                        <img
                                            key={idx}
                                            src={file.image_url}
                                            alt={file.image_name}
                                            width="50"
                                            height="50"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ))
                                ) : (
                                    "No image available"
                                )
                            ) : (
                                "Invalid format"
                            )}
                        </>
                    )}
                </td>
                <td className="text-center">
                    {file_document === null ? (
                        <Badge bg="warning" className="badge-lg">
                            Belum Pembayaran &nbsp;
                        </Badge>
                    ) : (
                        <span>
                            {tnos_invoice_id}
                        </span>
                    )}
                </td>
                <td className="text-center">{external_id}</td>
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
                    Pembayaran Lainnya (Manual Order)
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
                    -
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
                                                placeholder="Cari Transaksi"
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
                            title={
                                `Total : IDR ${getTotalAmountToday}`
                            }
                            getExportData={getManualOrder}
                            getMenu={"manual-order"}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Detail</th>
                                            <th className="border-0 text-center">Bukti Bayar</th>
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
                                        {getManualOrder?.length > 0 ? (
                                            getManualOrder?.map((td, index) => (
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
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    )

}