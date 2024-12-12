import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import ReactExport from "react-export-excel";
import { TnosDataTable } from "../../components/TnosDataTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import moment from "moment";
import Preloader from "../../components/Preloader";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [getTransactionData, setTransactionData] = useState()
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

    const [getTotalAmountToday, setTotalAmountToday] = useState(0);

    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null)

    const [getPaymentStatusArr] = useState([
        {
            key: "payment_status_0",
            value: 0,
            defaultValue: "Semua Status"
        },
        {
            key: "payment_status_1",
            value: 1,
            defaultValue: "Sudah Dibayar"
        },
        {
            key: "payment_status_2",
            value: 2,
            defaultValue: "Pending"
        },
        {
            key: "payment_status_3",
            value: 3,
            defaultValue: "Deny"
        },
        {
            key: "payment_status_4",
            value: 4,
            defaultValue: "Cancel"
        },
        {
            key: "payment_status_5",
            value: 5,
            defaultValue: "Expire"
        },
        {
            key: "payment_status_6",
            value: 6,
            defaultValue: "Refund"
        },
        {
            key: "payment_status_7",
            value: 7,
            defaultValue: "Partial Refund"
        },
    ])

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setTransactionData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.order_id && item.order_id.toLowerCase().includes(searchTerm))
            )
        });

        setTransactionData(filteredData);
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

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const humanizeText = (str) => {
        var i,
            frags = str.split("_");
        for (i = 0; i < frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(" ");
    };

    const TableRow = (props) => {
        const {
            order_id,
            order_id_master,
            order_status,
            payment_type,
            currency,
            gross_amount,
            invoice_price,
            cut_price,
            transaction_time,
            transaction_status,
        } = props;

        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const formatTransactionTime = (transactionTime) => {
            const date = new Date(transactionTime);
            const day = String(date.getDate()).padStart(2, '0');
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${hours}:${minutes}:${seconds} - ${day} / ${month} / ${year}`;
        };

        return (
            <tr>
                <td className="text-center">{props.num}</td>
                <td>{order_id}</td>
                <td className="text-center">
                    <Badge
                        bg={
                            transaction_status === "capture"
                                ? "soft-green"
                                : transaction_status === "settlement"
                                    ? "soft-green"
                                    : transaction_status === "pending"
                                        ? "secondary"
                                        : transaction_status === "deny"
                                            ? "danger"
                                            : transaction_status === "cancel"
                                                ? "danger"
                                                : transaction_status === "expire"
                                                    ? "danger"
                                                    : transaction_status === "refund"
                                                        ? "blue"
                                                        : transaction_status === "partial_refund"
                                                            ? "blue"
                                                            : transaction_status === "SUCCEEDED"
                                                                ? "soft-green" : transaction_status === "CAPTURED" ? "success"
                                                                    : transaction_status === "SETTLED" ? "soft-green"
                                                                        : ""
                        }
                        className="badge-lg"
                    >
                        {transaction_status === "capture"
                            ? "Capture"
                            : transaction_status === "settlement"
                                ? "Settlement"
                                : transaction_status === "pending"
                                    ? "Pending"
                                    : transaction_status === "deny"
                                        ? "Deny"
                                        : transaction_status === "cancel"
                                            ? "Cancel"
                                            : transaction_status === "expire"
                                                ? "Expire"
                                                : transaction_status === "refund"
                                                    ? "Refund"
                                                    : transaction_status === "partial_refund"
                                                        ? "Partial Refund"
                                                        : transaction_status === "SUCCEEDED" ? "Succeeded"
                                                            : transaction_status === "CAPTURED" ? "Captured"
                                                                : transaction_status === "SETTLED" ? "Settled"
                                                                    : ""}
                    </Badge>
                </td>
                <td className="text-center">{humanizeText(payment_type)}</td>
                <td>
                    {currency + " " + parseInt(gross_amount).toLocaleString("id-ID", {})}
                </td>
                <td>
                    {order_status.status === "Selesai" ||
                        order_status.status === "Dibatalkan" ||
                        order_status.status === "Penugasan" ||
                        order_status.status === "Sedang Berlangsung"
                        ? currency +
                        " " +
                        parseInt(invoice_price).toLocaleString("id-ID", {})
                        : "Tidak Ada"}
                </td>
                <td>
                    {currency + " " + parseInt(cut_price).toLocaleString("id-ID", {})}
                </td>
                <td>{formatTransactionTime(transaction_time)}</td>
                <td className="text-center">
                    {order_status.status === "Selesai" ||
                        order_status.status === "Dibatalkan" ||
                        order_status.status === "Penugasan" ||
                        order_status.status === "Sedang Berlangsung" ? (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Cek Pesanan</Tooltip>}
                        >
                            <Link
                                to={`/order/on-progress/detail`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Badge
                                    bg={order_status.status_color}
                                    className="badge-lg"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        localStorage.setItem("orderIdMaster", order_id_master);
                                    }}
                                >
                                    {order_status.status}
                                </Badge>
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <Badge bg={order_status.status_color} className="badge-lg">
                            {order_status.status}
                        </Badge>
                    )}
                </td>
                <td className="text-center">
                    <Link
                        to={`/order/transaction/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                localStorage.setItem("orderId", order_id);
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                            &nbsp; Detail
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    };

    const fetchData = async () => {

        try {
            setIsLoading(true)
            // Payment
            const response = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;
            // End

            // Order
            const responseOrder = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!responseOrder.ok) {
                throw new Error(`HTTP error! status: ${responseOrder.status}`);
            }

            const dataOrder = await responseOrder.json();
            let extractedDataOrder = Array.isArray(dataOrder.data) ? dataOrder.data : Array.isArray(dataOrder) ? dataOrder : [];

            let filteredDataOrder = extractedDataOrder;
            // End
            let transactionOrderData = []
            filteredData.forEach((item) => {
                if (!item.order_id.startsWith("TAB")) {
                    transactionOrderData.push({
                        ...item,
                        order_id_master: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) !== "[]" &&
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].id,
                        order_status: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) === "[]" ?
                            { status: "Tidak Ada", status_color: "gray" } :
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 1 ?
                                { status: "Menerima Pesanan", status_color: "primary" } :
                                filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 2 ?
                                    { status: "Dalam Perjalanan", status_color: "primary" } :
                                    filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 3 ?
                                        { status: "Hadir dan Sedang Bertugas", status_color: "primary" } :
                                        filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 990 ?
                                            { status: "Sedang Berlangsung", status_color: "blue" } :
                                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 999 ?
                                                { status: "Selesai", status_color: "success" } :
                                                filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].status === 1001 ?
                                                    { status: "Dibatalkan", status_color: "danger" } :
                                                    { status: "Tidak Ada", status_color: "gray" },
                        invoice_price: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) !== "[]" &&
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].price,
                        mitrafee: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) !== "[]" ?
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].mitraprice : 0,
                        tnosfee: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) !== "[]" ?
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].tnosfee : 0,
                        cut_price: JSON.stringify(filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)) !== "[]" ?
                            filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].alasan_batal === "assLbl55" ?
                                (10 / 100) * filteredDataOrder.filter((itemOrder) => itemOrder.sid === item.order_id)[0].price : 0 : 0,
                    });
                }
            })

            if (selectedStatus === 0) {
                transactionOrderData = transactionOrderData
            } else if (selectedStatus === 1) {
                transactionOrderData = transactionOrderData.filter((item) =>
                    item.transaction_status === "CAPTURED" ||
                    item.transaction_status === "settlement" ||
                    item.transaction_status === "SETTLED" ||
                    item.transaction_status === "SUCCEEDED"
                )
            } else if (selectedStatus === 2) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "pending")
            } else if (selectedStatus === 3) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "deny")
            } else if (selectedStatus === 4) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "cancel")
            } else if (selectedStatus === 5) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "expire")
            } else if (selectedStatus === 6) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "refund")
            } else if (selectedStatus === 7) {
                transactionOrderData = transactionOrderData.filter((item) => item.transaction_status === "partial_refund")
            }

            if (startDate && endDate) {
                transactionOrderData = transactionOrderData.filter(item => {
                    const itemDate = moment(item.transaction_time).format("YYYY-MM-DD");
                    const start = moment(startDate).startOf('day');
                    const end = moment(endDate).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            transactionOrderData.sort((a, b) => moment(b.transaction_time).diff(moment(a.transaction_time)));

            const totalAmountToday = transactionOrderData.reduce((sum, item) => sum + parseFloat(item.gross_amount || 0), 0);

            const formattedTotalAmount = totalAmountToday.toLocaleString("id-ID", {
                minimumFractionDigits: 0
            });

            setTotalAmountToday(formattedTotalAmount);
            setOriginalData(transactionOrderData)
            setTransactionData(transactionOrderData)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
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
                            <Col md={5}>
                                <Form>
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
                                `Total Transaksi : IDR ${getTotalAmountToday} `
                            }
                            data={
                                <table className="table table-hover align-items-center">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">Id Pemesanan</th>
                                            <th className="border-0">Status Transaksi</th>
                                            <th className="border-0 text-center">Tipe Pembayaran</th>
                                            <th className="border-0">Jumlah</th>
                                            <th className="border-0">Harga Invoice</th>
                                            <th className="border-0">Biaya Pembatalan</th>
                                            <th className="border-0">Waktu Transaksi</th>
                                            <th className="border-0">Status Pemesanan</th>
                                            <th className="border-0">
                                                <ExcelFile
                                                    element={
                                                        <Badge
                                                            bg="primary"
                                                            className="badge-lg"
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <FontAwesomeIcon icon={faFileExcel} /> Export
                                                            Excel
                                                        </Badge>
                                                    }
                                                    filename={`Transaksi Pembayaran`}
                                                >
                                                    <ExcelSheet
                                                        data={getTransactionData}
                                                        name="Data Transaksi"
                                                    >
                                                        <ExcelColumn
                                                            label="ID Pemesanan"
                                                            value="order_id"
                                                        />
                                                        <ExcelColumn
                                                            label="Status Pemesanan"
                                                            value={(col) => col.order_status.status}
                                                        />
                                                        <ExcelColumn
                                                            label="Tipe Pembayaran"
                                                            value={(col) => humanizeText(col.payment_type)}
                                                        />
                                                        <ExcelColumn
                                                            label="Jumlah"
                                                            value={(col) =>
                                                                col.currency +
                                                                " " +
                                                                parseInt(col.gross_amount).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Harga Invoice"
                                                            value={(col) =>
                                                                col.order_status.status === "Selesai" ||
                                                                    col.order_status.status === "Dibatalkan" ||
                                                                    col.order_status.status === "Penugasan" ||
                                                                    col.order_status.status === "Sedang Berlangsung"
                                                                    ? col.currency +
                                                                    " " +
                                                                    parseInt(col.invoice_price).toLocaleString(
                                                                        "id-ID",
                                                                        {}
                                                                    )
                                                                    : "Tidak Ada"
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Biaya Pembatalan"
                                                            value={(col) =>
                                                                col.currency +
                                                                " " +
                                                                parseInt(col.cut_price).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Pendapatan Mitra"
                                                            value={(col) =>
                                                                col.currency +
                                                                " " +
                                                                parseInt(col.mitrafee).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Pendapatan Perusahaan"
                                                            value={(col) =>
                                                                col.currency +
                                                                " " +
                                                                parseInt(col.tnosfee).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Waktu Transaksi"
                                                            value="transaction_time"
                                                        />
                                                        <ExcelColumn
                                                            label="Status Transaksi"
                                                            value={(col) =>
                                                                col.transaction_status === "capture"
                                                                    ? "Capture"
                                                                    : col.transaction_status === "settlement"
                                                                        ? "Settlement"
                                                                        : col.transaction_status === "pending"
                                                                            ? "Pending"
                                                                            : col.transaction_status === "deny"
                                                                                ? "Deny"
                                                                                : col.transaction_status === "cancel"
                                                                                    ? "Cancel"
                                                                                    : col.transaction_status === "expire"
                                                                                        ? "Expire"
                                                                                        : col.transaction_status === "refund"
                                                                                            ? "Refund"
                                                                                            : col.transaction_status === "partial_refund"
                                                                                                ? "Partial Refund"
                                                                                                : ""
                                                            }
                                                        />
                                                    </ExcelSheet>
                                                    {/* If you want to add sheet just copy ExcelSheet */}
                                                </ExcelFile>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getTransactionData?.length > 0 ? (
                                            getTransactionData?.map((td, index) => (
                                                <TableRow
                                                    key={`page-traffic-${td.order_id}`}
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
                                </table>
                            }
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    )

}