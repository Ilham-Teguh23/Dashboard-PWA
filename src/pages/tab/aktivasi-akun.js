import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faThList } from "@fortawesome/free-solid-svg-icons";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import CurrencyFormatter from "../../components/CurrencyFormatter";
import TodayDate from "../../components/TodayDate";
import DateBetweenFilter from "../../components/DateBetweenFilter";

export default () => {

    const [getTabPaymentData, setTabPaymentData] = useState([])
    const [getAllTransactionData, setAllTransactionData] = useState();
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

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
                    <Badge bg={status_transaksi == "PENDING" ? 'warning' : status_transaksi == "PAID" || status_transaksi == "SETTLED" ? 'success' : 'danger'} className="badge-lg">
                        {status_transaksi == "PENDING" ? 'Menunggu Pembayaran' : status_transaksi == "PAID" || status_transaksi == "SETTLED" ? "Selesai" : 'Expired'}
                        &nbsp;
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{status_transaksi == "PENDING" ? 'Menunggu Pembayaran' : status_transaksi == "PAID" ? "Selesai" : 'Expired'}</Tooltip>}
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
                <td className="">{name == null ? name : '-'}</td>
                <td className="">{name == null ? name : '-'}</td>
                <td className="text-center">
                    <CurrencyFormatter amount={amount} />
                </td>
                <td className="text-center">
                    <Link to={`/tab/transaksi/detail`} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" className="text-white" onClick={() => {
                            localStorage.setItem(
                                "tabTransaksiByExternalId",
                                JSON.stringify(
                                    getAllTransactionData.filter((item) => item.external_id === external_id)
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

    const getDataBetweenDate = (datas, startDate, endDate) => {
        return DateBetweenFilter(datas, "timestamp", startDate, endDate);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_TAB_URL}/payment/all`)
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem(
                    "getStartDatePwaB2bTransaction",
                    TodayDate() + " 00:00:00"
                );
                localStorage.setItem(
                    "getEndDatePwaB2bTransaction",
                    TodayDate() + " 23:59:59"
                );

                setTabPaymentData(data)
            }).catch((err) => {
                console.log(err);
            })
    })

    const updateTransactionData = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const splitDate = (date) => {
            let str = date.split("");
            str[10] = " ";
            str = str.join("");
            return str;
        };
        localStorage.setItem(
            "getStartDatePwaB2bTransaction",
            splitDate(formData.get("start_date_time"))
        );
        localStorage.setItem(
            "getEndDatePwaB2bTransaction",
            splitDate(formData.get("end_date_time"))
        );

        let sortTransactionData = getAllTransactionData.sort(
            (a, b) =>
                new Date(
                    b.created_at.split("T")[0] +
                    " " +
                    b.created_at.split("T")[1].split(".")[0]
                ) -
                new Date(
                    a.created_at.split("T")[0] +
                    " " +
                    a.created_at.split("T")[1].split(".")[0]
                )
        );

        sortTransactionData =
            formData.get("service_type") !== "0"
                ? sortTransactionData.filter(
                    (item) =>
                        item.service_datas.id === parseInt(formData.get("service_type"))
                )
                : sortTransactionData;

        sortTransactionData =
            formData.get("transaction_status") !== "0"
                ? sortTransactionData.filter(
                    (item) =>
                        item.payment_status_datas.id ===
                        parseInt(formData.get("transaction_status"))
                )
                : sortTransactionData;

        let dataBetween = getDataBetweenDate(
            sortTransactionData,
            formData.get("start_date_time"),
            formData.get("end_date_time")
        );
        setTabPaymentData(dataBetween);
        let totalAmountBetween = 0;
        dataBetween.forEach((item) => {
            totalAmountBetween = totalAmountBetween + parseInt(item.order_total);
        });
        dataBetween.length === 0 &&
            setMessageEmptyData("Tidak ada transaksi diantara tanggal ini");
        // setTotalAmountBetween(totalAmountBetween.toLocaleString("id-ID", {}));
    };

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
                                    <thead className="thead-light">
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