import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltUp, faMoneyBill, faSearch, faThList, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import moment from "moment";
import Loading from "../../components/Loading";
import Preloader from "../../components/Preloader";

export default () => {

    const [getPendapatan, setPendapatan] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState("Belum ada data pada hari ini")
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState("0")
    const [getTotalAmountToday, setTotalAmountToday] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const searchInputRef = useRef(null)

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

    const [getServiceTypeArr] = useState([
        {
            key: "service_type_0",
            value: "0",
            defaultValue: "Semua Layanan",
        },
        {
            key: "service_type_1",
            value: "1",
            defaultValue: "Pengamanan",
        },
        {
            key: "service_type_2",
            value: "2",
            defaultValue: "Pengamanan (Silver)",
        },
        {
            key: "service_type_3",
            value: "3",
            defaultValue: "Pengamanan (Platinum)",
        },
        {
            key: "service_type_4",
            value: "4",
            defaultValue: "Pendampingan",
        },
        {
            key: "service_type_5",
            value: "5",
            defaultValue: "Pengacara (Pendampingan)",
        },
        {
            key: "service_type_6",
            value: "6",
            defaultValue: "Pengacara (Konsultasi)",
        },
    ])

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setPendapatan([...getPendapatan]);
            return;
        }

        const filteredData = getPendapatan.filter(item => {
            return (
                (item.sid && item.sid.toLowerCase().includes(searchTerm)) ||
                (item.id && item.id.toLowerCase().includes(searchTerm)) ||
                (item.invoice && item.invoice.toLowerCase().includes(searchTerm)) ||
                (item.mmbr_name && item.mmbr_name.toLowerCase().includes(searchTerm)) ||
                (item.mitracode && item.mitracode.includes(searchTerm))
            );
        });

        setPendapatan(filteredData);
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

    const fetchData = async () => {
        try {

            setIsLoading(true)
            const response = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()

            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

            let filteredData = extractedData;
            let datas = filteredData.filter((item) => item.status === 999)

            if (selectedFilter === 1) {
                datas = datas.filter(item =>
                    item.mitracode !== "1808202200003" &&
                    item.mitracode !== "2701202400001" &&
                    item.mitracode !== "1808202200001" &&
                    item.mitracode !== "1209202400001" &&
                    item.mitracode !== "1808202200004" &&
                    item.mitracode !== "3011202200002" &&
                    item.mitracode !== "3011202200003" &&
                    item.mitracode !== "1310202200001" &&
                    item.mitracode !== "1808202200002"
                );
            } else if (selectedFilter === 2) {
                datas = datas.filter(item =>
                    item.mitracode === "1808202200003" ||
                    item.mitracode === "2701202400001" ||
                    item.mitracode === "1808202200001" ||
                    item.mitracode === "1209202400001" ||
                    item.mitracode === "1808202200004" ||
                    item.mitracode === "3011202200002" ||
                    item.mitracode === "3011202200003" ||
                    item.mitracode === "1310202200001" ||
                    item.mitracode === "1808202200002"
                );
            }

            if (selectedStatus === "0") {
                datas = datas
            } else if (selectedStatus === "1") {
                datas = datas.filter(item =>
                    item.servicename === "Pengamanan"
                )
            } else if (selectedStatus === "2") {
                datas = datas.filter(item =>
                    item.servicename === "Pengamanan" &&
                    item.gradename === "C"
                );
            } else if (selectedStatus === "3") {
                datas = datas.filter(item =>
                    item.servicename === "Pengamanan" &&
                    item.gradename === "A"
                );
            } else if (selectedStatus === "4") {
                datas = datas.filter(item =>
                    item.servicename === "Pendampingan" &&
                    item.gradename === "Lawyer"
                )
            } else if (selectedStatus === "5") {
                datas = datas.filter(item =>
                    item.servicename === "Pendampingan" &&
                    item.gradename === "Lawyer" &&
                    item.type === "TL"
                )
            } else if (selectedStatus === "6") {
                datas = datas.filter(item =>
                    item.servicename === "Pendampingan" &&
                    item.gradename === "Lawyer" &&
                    item.type === "TLC"
                )
            }

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

            const filteredMembers = datas
                .map((transaction) => {
                    const memberName = userMap[transaction.membercode]
                    if (memberName) {
                        return { ...transaction, mmbr_name: memberName }
                    }
                    return null
                })
                .filter(Boolean);

            let filteredDataOrderSuccess = filteredMembers;

            if (startDate && endDate) {
                filteredDataOrderSuccess = filteredDataOrderSuccess.filter(item => {
                    const itemDate = moment(item.date_insert).format("YYYY-MM-DD");
                    const start = moment(startDate).startOf('day');
                    const end = moment(endDate).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            filteredDataOrderSuccess.sort((a, b) => b.timestamp - a.timestamp);
            const totalAmountToday = filteredDataOrderSuccess.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

            const formattedTotalAmount = totalAmountToday.toLocaleString("id-ID", {
                minimumFractionDigits: 0
            });

            setTotalAmountToday(formattedTotalAmount);
            setPendapatan(filteredDataOrderSuccess)
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
            num, id, mdisid, additional, invoice, membercode, price, sid, type, tnosfee, enddate, other, endtime, mmbr_name
        } = props

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">{type + invoice}</td>
                <td>
                    <Link
                        to={`/order/on-progress/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span
                            onClick={() => {
                                localStorage.setItem("orderIdMaster", id);
                            }}
                        >
                            {sid}
                        </span>
                    </Link>
                    &nbsp;
                    {mdisid && (
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
                    &nbsp;
                    {additional && (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{additional}</Tooltip>}
                        >
                            <FontAwesomeIcon
                                icon={faTicketAlt}
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                            />
                        </OverlayTrigger>
                    )}
                </td>
                <td className="text-center">
                    <Badge bg="success" className="badge-lg">
                        Selesai
                    </Badge>
                </td>
                <td className="text-center">
                    {type === "TLC" ? other : enddate + " " + endtime}
                </td>
                <td className="text-center">{"IDR " + parseInt(price).toLocaleString("id-ID", {})}</td>
                <td className="text-center">{"IDR " + parseInt(tnosfee).toLocaleString("id-ID", {})}</td>
                <td>
                    <a
                        href={"/member/profile/" + membercode}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {mmbr_name} - {membercode}
                    </a>
                </td>
                <td className="text-center">
                    <Link
                        to={`/order/on-progress/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            className="text-white"
                            onClick={() => {
                                localStorage.setItem("orderIdMaster", id);
                            }}
                        >
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
            </tr>
        )
    }

    return (
        <>
            <Preloader show={!getTotalAmountToday ? true : false} />

            {isLoading && <Loading />}
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>

                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Group id="transaction_status">
                                    <Form.Label>Tipe Layanan</Form.Label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        {getServiceTypeArr.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
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
                                        <Form.Label>Tanggal Pemesanan</Form.Label>
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
                                        <Form.Label>Cari Pemesanan</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Pemesanan"
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
                            title={`Total pemesanan hari ini : IDR ${getTotalAmountToday}`}
                            getExportData={getPendapatan}
                            getMenu={`payment-pendapatan`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0">No Invoice</th>
                                            <th className="border-0">ID Pemesanan</th>
                                            <th className="border-0 text-center">Status Pemesanan</th>
                                            <th className="border-0 text-center">Waktu Selesai</th>
                                            <th className="border-0">Jumlah Invoice</th>
                                            <th className="border-0">Pendapatan</th>
                                            <th className="border-0">Member</th>
                                            <th className="border-0 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getPendapatan?.length > 0 ? (
                                            getPendapatan?.map((td, index) => (
                                                <TableRow
                                                    key={`table-pendapatan-${td.id}`}
                                                    {...td}
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
            </Col>
        </>
    )

}