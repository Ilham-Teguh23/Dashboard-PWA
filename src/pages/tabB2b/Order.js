import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faThList } from "@fortawesome/free-solid-svg-icons";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import CurrencyFormatter from "../../components/CurrencyFormatter";
import TodayDate from "../../components/TodayDate";

export default () => {

    const [selectedFilter, setSelectedFilter] = useState(1);
    const [getTabPaymentData, setTabPaymentData] = useState([])
    const [getAllTransactionData] = useState();
    const [getMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

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
            value: [3, 4],
            defaultValue: "Sudah Dibayar",
            us: "PAID_SETTLED",
            desc: "Tautan pembayaran sudah berhasil dibayarkan oleh pelanggan Anda",
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
    ]);

    const TableRow = (props) => {
        const {
            member_code,
            external_id,
            start_date,
            status_transaksi,
            name,
            amount,
            timestamp
        } = props;

        return (
            <tr>
                <td className="text-center">{member_code ? member_code : "-"}</td>
                <td className="text-center">{external_id ? external_id : "-"}</td>
                <td className="text-center">
                    <Badge bg={status_transaksi === "PENDING" ? 'warning' : status_transaksi === "PAID" || status_transaksi === "SETTLED" ? 'success' : 'danger'} className="badge-lg">
                        {status_transaksi === "PENDING" ? 'Menunggu Pembayaran' : status_transaksi === "PAID" || status_transaksi === "SETTLED" ? "Selesai" : 'Expired'}
                        &nbsp;
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{status_transaksi === "PENDING" ? 'Menunggu Pembayaran' : status_transaksi === "PAID" ? "Selesai" : 'Expired'}</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    </Badge>
                </td>
                <td className="">
                    <ConvertTimestamps timestamp={timestamp} />
                </td>
                <td className="">
                    <ConvertTimestamps timestamp={start_date} />
                </td>
                <td className=""></td>
                <td className="">{name == null ? '-' : name}</td>
                <td className="">{name == null ? '-' : name}</td>
                <td className="text-center">
                    <CurrencyFormatter amount={amount} />
                </td>
                <td className="text-center">
                    <Link to={`/tab/transaksi/detail`} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" className="text-white" onClick={() => {
                            localStorage.setItem(
                                "tabTransaksiByExternalId",
                                JSON.stringify(
                                    getAllTransactionData.filter((item) => item.external_id == external_id)
                                )
                            );
                        }} >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
            </tr>
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/payment/all`);
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
    
                let filteredData = [];
    
                if (selectedFilter === 1) {
                    filteredData = extractedData.filter(item => item.name != null && !item.name.includes("User"));
                } else if (selectedFilter === 2) {
                    filteredData = extractedData.filter(item => {
                        return (!item.name || item.name.includes("User"));
                    });
                }
    
                setTabPaymentData(filteredData);
            } catch (error) {
                console.error("Fetching data failed:", error);
            }
        };
    
        fetchData();
    }, [selectedFilter]);
    
    return (
        <>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form method="POST">
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Form.Label>Tanggal Transaksi</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="datetime-local"
                                            name="start_date_time"
                                            step="1"
                                            defaultValue={TodayDate() + "T00:00:00"}
                                            required
                                        />
                                        <InputGroup.Text>&#x2192;</InputGroup.Text>
                                        <Form.Control
                                            type="datetime-local"
                                            name="end_date_time"
                                            step="1"
                                            defaultValue={TodayDate() + "T23:59:59"}
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={2}>
                                    <Form.Group id="transaction_status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select name="transaction_status" required>
                                            {getPaymentStatusArr?.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group id="filter_test">
                                        <Form.Label>Filter Test?</Form.Label>
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
                                <Col>
                                    <Form.Label>&nbsp;</Form.Label>
                                    <Form.Control
                                        className="btn btn-primary"
                                        type="submit"
                                        name="btn_search_transaction"
                                        value="Cari Transaksi"
                                    />
                                </Col>
                            </Row>
                        </Form>
                        <TnosDataTable
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">Member Code</th>
                                            <th className="border-0 text-center">ID Transaksi</th>
                                            <th className="border-0 text-center">Status Transaksi</th>
                                            <th className="border-0 text-center">Waktu Pesanan Dibuat</th>
                                            <th className="border-0 text-center">Waktu Transaksi</th>
                                            <th className="border-0 text-center">Membership</th>
                                            <th className="border-0 text-center">Nama</th>
                                            <th className="border-0 text-center">Metode Pembayaran</th>
                                            <th className="border-0 text-center">Jumlah</th>
                                            <th className="border-0 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getTabPaymentData?.length > 0 ? (
                                            getTabPaymentData?.map((td, index) => (
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
            </Col>
        </>
    )
}