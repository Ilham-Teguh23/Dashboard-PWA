import { Card, Col, Nav, OverlayTrigger, Row, Tab, Tooltip } from "@themesberg/react-bootstrap"
import React, { useEffect } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLongArrowAltUp, faMoneyBill } from "@fortawesome/free-solid-svg-icons"

export default () => {

    const [getPayment, setPayment] = useState([])

    const fetchDataTransaksi = () => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => res.json())
            .then((data) => {
                let transactionPayment = data.data

                console.log(transactionPayment);

            })
    }

    const fetchDataPayment = () => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/global/company/fee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
        .then((data) => {
            setPayment(data.data)
        })
    }

    useEffect(() => {
        fetchDataTransaksi()
        fetchDataPayment()
    }, [])

    const TableRowIncome = (props) => {
        const {
            order_id,
            id,
            trx_code,
            type,
            fee,
            saldo,
            create_at,
            create_by
        } = props;

        return (
            <tr>
                <td>{props.num}.</td>
                <td className="text-center">{order_id}</td>
                <td>
                    {trx_code} &nbsp;
                    {fee === "0" && (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Pesanan ini menggunakan voucher</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    )}
                </td>
                <td className="text-center"></td>
                <td className="text-center">{type}</td>
                <td className={fee !== "0" && "text-success fw-bold"}>
                    {"IDR " + parseInt(fee).toLocaleString("id-ID", {})}
                    &nbsp;
                    {fee !== "0" && "+"}
                </td>
                <td className={fee !== "0" && "text-success fw-bold"}>
                    {"IDR " + parseInt(saldo).toLocaleString("id-ID", {})}
                    &nbsp;
                    {fee !== "0" && <FontAwesomeIcon icon={faLongArrowAltUp} />}
                </td>
                <td>
                    {create_at.split("+")[0].split("T")[1] +
                        " " +
                        create_at.split("+")[0].split("T")[0].split("-")[2] +
                        "-" +
                        create_at.split("+")[0].split("T")[0].split("-")[1] +
                        "-" +
                        create_at.split("+")[0].split("T")[0].split("-")[0]}
                </td>
                <td>{!create_by || create_by === "undefined" ? "-" : create_by}</td>
            </tr>
        )
    }

    return (
        <>
            <Col xl={12} className="mt-2">
                <Tab.Container defaultActiveKey="income_tab">
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="transaction_tab">Transaksi</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="income_tab">Pendapatan</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="transaction_tab">
                                    <Card border="light">
                                        <Card.Body>
                                            <TnosDataTable
                                                data={
                                                    <>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th className="border-0">No.</th>
                                                                <th className="border-0">Id Pemesanan</th>
                                                                <th className="border-0">Status Pemesanan</th>
                                                                <th className="border-0">Tipe Pembayaran</th>
                                                                <th className="border-0">Jumlah</th>
                                                                <th className="border-0">Harga Invoice</th>
                                                                <th className="border-0">Biaya Pembatalan</th>
                                                                <th className="border-0">Pendapatan Mitra</th>
                                                                <th className="border-0">
                                                                    Pendapatan Perusahaan
                                                                </th>
                                                                <th className="border-0">Waktu Transaksi</th>
                                                                <th className="border-0">Status Transaksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {getTransactionData?.length > 0 ? (
                                                                getTransactionData?.map((td, index) => (
                                                                    <TableRowTransaction
                                                                        key={`page-traffic-${td.order_id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={6}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )} */}
                                                        </tbody>
                                                    </>
                                                }
                                            />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="income_tab">
                                    <Card border="light">
                                        <Card.Body>
                                            <TnosDataTable
                                                data={
                                                    <>
                                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                            <tr>
                                                                <th className="border-0">No.</th>
                                                                <th className="border-0">Invoice</th>
                                                                <th className="border-0">Id Pemesanan</th>
                                                                <th className="border-0">Status Pemesanan</th>
                                                                <th className="border-0">Tipe</th>
                                                                <th className="border-0">Biaya Layanan</th>
                                                                <th className="border-0">Total Pendapatan</th>
                                                                <th className="border-0">Waktu Pemasukan</th>
                                                                <th className="border-0">Dibuat Oleh</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getPayment.length > 0 ? (
                                                                getPayment.map((td, index) => (
                                                                    <TableRowIncome
                                                                        key={`page-income-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <>
                                                                </>
                                                            ) }
                                                            {/* {getIncomeData?.length > 0 ? (
                                                                getIncomeData?.map((td, index) => (
                                                                    <TableRowIncome
                                                                        key={`page-traffic-${td.id}`}
                                                                        {...td}
                                                                        num={index + 1}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <tr className="text-center">
                                                                    <td colspan={6}>{getMessageEmptyData}</td>
                                                                </tr>
                                                            )} */}
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