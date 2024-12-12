import { Button, Card, Col, Nav, OverlayTrigger, Row, Tab, Tooltip } from "@themesberg/react-bootstrap"
import React, { useEffect, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import ReadableDateTime from "../../components/ReadableDateTime"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLinkAlt, faThList } from "@fortawesome/free-solid-svg-icons"

export default () => {

    const [getTransaksiData, setTransaksiData] = useState([])
    const [getPembayaranData, setPembayaranData] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState("Belum ada transaksi pada hari ini")

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher`, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((data) => {

                if (data.success === true) {
                    const latestTransactions = {};
                    data.transaction.forEach((transaction) => {
                        if (
                            !latestTransactions[transaction.user_id] ||
                            new Date(transaction.created_at) >
                            new Date(latestTransactions[transaction.user_id].created_at)
                        ) {
                            latestTransactions[transaction.user_id] = transaction;
                        }
                    });

                    const latestTransactionArray = Object.values(latestTransactions);
                    setTransaksiData(latestTransactionArray);
                }
            })
    }

    const fetchDataPembayaran = () => {
        fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher`, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((response) => {
                setTransaksiData(response.transaction)

            })
    }

    useEffect(() => {

        fetchData()
        fetchDataPembayaran()

    }, [])

    const calcAmount = (amount, times = true) => {
        const am = times ? amount * 10000 : amount;
        return "IDR " + am.toLocaleString("id-ID", {});
    };

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

    const TableRow = (props) => {
        const { id, user_id, in_point, out_point, created_at, description, num } = props

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">
                    <Link
                        to={`/pwa-b2b/voucher/order-voucher-detail/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                            &nbsp; Detail
                        </Button>
                    </Link>
                </td>
                <td className="text-center">{id}</td>
                <td className="text-center">
                    {iconLink(user_id, `/member/profile/${user_id}`)}
                </td>
                <td className="text-center">
                    {ReadableDateTime(created_at)}
                </td>
                <td className="text-center">
                    {in_point === null ? (
                        <span className="text-danger">{calcAmount(out_point)} -</span>
                    ) : (
                        <span className="text-success">{calcAmount(in_point)} +</span>
                    )}
                </td>
                <td className="text-center">{description}</td>
            </tr>
        )
    }

    return (
        <>
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
                                <Nav.Item>
                                    <Nav.Link eventKey="payment_voucher_penyesuaian">Penyesuaian</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="member_voucher_tab">
                                    <Card border="light">
                                        <Card.Body>
                                            <TnosDataTable
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0 text-center">Detail</th>
                                                                <th className="border-0 text-center">ID</th>
                                                                <th className="border-0 text-center">ID Pengguna</th>
                                                                <th className="border-0 text-center">Tanggal</th>
                                                                <th className="border-0 text-center">
                                                                    Voucher (
                                                                    <span className="text-success">
                                                                        {" "}
                                                                        Masuk +{" "}
                                                                    </span>
                                                                    /
                                                                    <span className="text-danger">
                                                                        {" "}
                                                                        Keluar -{" "}
                                                                    </span>
                                                                    )
                                                                </th>
                                                                <th className="border-0 text-center">Deskripsi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getTransaksiData?.length > 0 ? (
                                                                getTransaksiData?.map((td, index) => (
                                                                    <TableRow
                                                                        key={`order-success-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colSpan={6}>{getMessageEmptyData}</td>
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
                                            <TnosDataTable
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0 text-center">No.</th>
                                                                <th className="border-0 text-center">Detail</th>
                                                                <th className="border-0 text-center">ID</th>
                                                                <th className="border-0 text-center">ID Invoice</th>
                                                                <th className="border-0 text-center">ID User</th>
                                                                <th className="border-0 text-center">Jumlah</th>
                                                                <th className="border-0 text-center">Deskripsi</th>
                                                                <th className="border-0 text-center">Status Pemesanan</th>
                                                                <th className="border-0 text-center">Status Pembayaran</th>
                                                                <th className="border-0 text-center">Tanggal Dibuat</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getTransaksiData?.length > 0 ? (
                                                                getTransaksiData?.map((td, index) => (
                                                                    <TableRow
                                                                        key={`order-success-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colSpan={6}>{getMessageEmptyData}</td>
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
    )

}