import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faThList,
    faMoneyBill,
    faTicketAlt,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
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
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import moment from "moment";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState("0");
    const [getSuccessData, setSuccessData] = useState()
    const [getTotalAmountToday, setTotalAmountToday] = useState(0)
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada pemesanan pada hari ini"
    )

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
            setSuccessData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.sid && item.sid.toLowerCase().includes(searchTerm)) ||
                (item.id && item.id.toLowerCase().includes(searchTerm)) ||
                (item.invoice && item.invoice.toLowerCase().includes(searchTerm)) ||
                (item.mmbr_name && item.mmbr_name.toLowerCase().includes(searchTerm))
            );
        });

        setSuccessData(filteredData);
    };

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
    ]);

    const TableRow = (props) => {
        const {
            id,
            sid,
            mdisid,
            additional,
            type,
            invoice,
            date_insert,
            membercode,
            mitracode,
            price,
            servicename,
            gradename,
            enddate,
            endtime,
            other,
            mmbr_name
        } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td>{id}</td>
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
                <td>{type + invoice}</td>
                <td>
                    {date_insert.split("+")[0].split("T")[0].split("-")[2] +
                        "-" +
                        date_insert.split("+")[0].split("T")[0].split("-")[1] +
                        "-" +
                        date_insert.split("+")[0].split("T")[0].split("-")[0] +
                        " " +
                        date_insert.split("+")[0].split("T")[1]}
                </td>
                <td>{"IDR " + parseInt(price).toLocaleString("id-ID", {})}</td>
                <td>
                    <a
                        href={"/member/profile/" + membercode}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {mmbr_name} - {membercode}
                    </a>
                </td>
                <td>
                    <a
                        href={
                            servicename === "Pengamanan"
                                ? "/partner/guard/profile/" + mitracode
                                : "/partner/lawyer/profile/" + mitracode
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {mitracode}
                    </a>
                </td>
                <td>
                    {type === "TLC"
                        ? "Pengacara (Konsultasi)"
                        : type === "TL"
                            ? "Pengacara (Pendampingan)"
                            : servicename}
                    {gradename !== "Lawyer"
                        ? gradename === "A"
                            ? " (Platinum)"
                            : " (Silver)"
                        : ""}
                </td>
                <td>
                    <Badge bg="success" className="badge-lg">
                        Selesai
                    </Badge>
                </td>
                <td>{type === "TLC" ? other : enddate + " " + endtime}</td>
                <td>
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
        );
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
                    item.mitracode !== "1310202200001"
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
                    item.mitracode === "1310202200001"
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

            setOriginalData(filteredDataOrderSuccess);
            setSuccessData(filteredDataOrderSuccess)
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
                            // subtitle={
                            //     localStorage.getItem("getStartDateOrder") ===
                            //         getTodayDate() + " 00:00:00" &&
                            //         localStorage.getItem("getEndDateOrder") ===
                            //         getTodayDate() + " 23:59:59"
                            //         ? ""
                            //         : `Total pemesanan ( ${localStorage.getItem(
                            //             "getStartDateOrder"
                            //         )} - ${localStorage.getItem(
                            //             "getEndDateOrder"
                            //         )} ) : IDR ${getTotalAmountBetween}`
                            // }
                            getExportData={getSuccessData}
                            getMenu={`order-success`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0">No.</th>
                                            <th className="border-0">Id</th>
                                            <th className="border-0">Id Pemesanan</th>
                                            <th className="border-0">No. Invoice</th>
                                            <th className="border-0">Waktu Pemesanan</th>
                                            <th className="border-0">Jumlah</th>
                                            <th className="border-0">Member</th>
                                            <th className="border-0">Kode Mitra</th>
                                            <th className="border-0">Tipe Mitra</th>
                                            <th className="border-0">Status</th>
                                            <th className="border-0">Waktu Selesai</th>
                                            <th className="border-0">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getSuccessData?.length > 0 ? (
                                            getSuccessData?.map((td, index) => (
                                                <TableRow
                                                    key={`order-success-${td.id}`}
                                                    {...td}
                                                    num={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colspan={12}>{getMessageEmptyData}</td>
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