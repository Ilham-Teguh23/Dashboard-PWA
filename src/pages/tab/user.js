import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Card,
    Button,
    Form,
    InputGroup,
    Row,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { TnosDataTable } from "../../components/TnosDataTable";
import ReadableDateTime from "../../components/ReadableDateTime";
import Preloader from "../../components/Preloader";
import moment from "moment";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedTABUser, setSelectedTABUser] = useState(0);
    const [selectedTABFilter, setSelectedTABFilter] = useState(0);

    const [memberData, setMemberData] = useState([]);
    const [messageEmptyData] = useState("Belum ada data");

    const [refapp, setRefapp] = useState("tabusersemua")
    const [getTotal, setTotal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null)

    const [getTABUser] = useState([
        {
            key: "tab_user_status_0",
            value: 0,
            defaultValue: "TAB User All",
            us: "TAB User All",
        },
        {
            key: "tab_user_status_1",
            value: 1,
            defaultValue: "TAB User Android",
            us: "TAB User Android",
        },
        {
            key: "tab_user_status_2",
            value: 2,
            defaultValue: "TAB User iOS",
            us: "TAB User iOS"
        },
    ]);

    const [getTABFilter] = useState([
        {
            key: "tab_filter_status_0",
            value: 0,
            defaultValue: "Real",
        },
        {
            key: "tab_filter_status_1",
            value: 1,
            defaultValue: "Testing"
        },
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

    const TableRow = ({ num, mmbr_date_insert, mmbr_code, mmbr_name, mmbr_phone, mmbr_email }) => (
        <tr>
            <td className="text-center">{num}</td>
            <td className="text-center">
                <Link to={`/member/profile/${mmbr_code}`}>
                    <Button variant="primary" size="sm" className="text-white">
                        <FontAwesomeIcon icon={faThList} />
                    </Button>
                </Link>
            </td>
            <td>{mmbr_name}</td>
            <td className="text-center">
                <Link to={`/member/profile/${mmbr_code}`}>{mmbr_code}</Link>
            </td>
            <td className="text-center">{ReadableDateTime(mmbr_date_insert)}</td>
            <td className="text-center">{mmbr_phone}</td>
            <td>{mmbr_email}</td>
        </tr>
    );

    useEffect(() => {
        if (selectedTABUser === 1) {
            setRefapp("tabuserandroid");
        } else if (selectedTABUser === 2) {
            setRefapp("tabuserios");
        } else {
            setRefapp("tabusersemua");
        }
    }, [selectedTABUser]);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setMemberData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.mmbr_name && item.mmbr_name.toLowerCase().includes(searchTerm)) ||
                (item.mmbr_code && item.mmbr_code.toLowerCase().includes(searchTerm)) ||
                (item.mmbr_phone && item.mmbr_phone.toLowerCase().includes(searchTerm)) ||
                (item.mmbr_email && item.mmbr_email.toLowerCase().includes(searchTerm))
            )
        });

        setMemberData(filteredData);
    };

    const fetchData = async () => {
        try {

            setIsLoading(true)

            let allData = [];

            if (refapp === "tabusersemua") {
                const responseAndroid = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: "tabuserandroid" })
                });

                if (!responseAndroid.ok) {
                    throw new Error(`HTTP error! status: ${responseAndroid.status}`);
                }

                const dataAndroid = await responseAndroid.json();
                allData = allData.concat(dataAndroid.data || dataAndroid);

                const responseIOS = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: "tabuserios" })
                });

                if (!responseIOS.ok) {
                    throw new Error(`HTTP error! status: ${responseIOS.status}`);
                }

                const dataIOS = await responseIOS.json();
                allData = allData.concat(dataIOS.data || dataIOS);

                let filteredData = allData;

                if (selectedTABFilter === 0) {
                    filteredData = filteredData.filter(item =>
                        item.mmbr_name != null &&
                        !item.mmbr_name.includes("User") &&
                        !item.mmbr_name.includes("test") &&
                        !item.mmbr_name.includes("Test") &&
                        !item.mmbr_name.includes("Xxx Alfi Xxx") &&
                        !item.mmbr_name.includes("XXXalifXXX") &&
                        !item.mmbr_name.includes("TEST") &&
                        ![
                            "0611202400002", "1406202400006", "1810202400007", "1810202400006", "0506202400004",
                            "0606202400002", "0406202400004", "0606202400005", "0606202400004", "0806202400004",
                            "1111202300008", "0406202400003", "0906202400001", "0906202400002", "1403202400008",
                            "2108202200001", "0610202300003", "1806202400007", "1406202400009", "2106202400007",
                            "1719923965963", "0207202400001", "2608202400003", "0209202400001", "1810202400002",
                            "1906202400004", "0908202400012", "0908202400013", "1306202400005", "1306202400005",
                            "1306202400002", "1306202400001", "3006202400002", "3006202400003", "3006202400004",
                            "3006202400005", "3006202400006", "3006202400007", "0208202400002", "0208202400003",
                            "3006202400008", "3006202400009", "3006202400010", "0107202400014", "0207202400004",
                            "0707202400008", "3107202400005", "0908202400005", "1308202400001", "1908202400005", 
                            "2608202400003"
                        ].includes(item.mmbr_code)
                    );
                } else if (selectedTABFilter === 1) {
                    filteredData = filteredData.filter(item =>
                        !item.mmbr_name ||
                        item.mmbr_name.includes("User") ||
                        item.mmbr_name.includes("test") ||
                        item.mmbr_name.includes("Test") ||
                        item.mmbr_name.includes("Xxx Alfi Xxx") ||
                        item.mmbr_name.includes("XXXalifXXX") ||
                        item.mmbr_name.includes("TEST") ||
                        [
                            "0611202400002", "1406202400006", "1810202400007", "1810202400006", "0506202400004",
                            "0606202400002", "0406202400004", "0606202400005", "0606202400004", "0806202400004",
                            "1111202300008", "0406202400003", "0906202400001", "0906202400002", "1403202400008",
                            "2108202200001", "0610202300003", "1806202400007", "1406202400009", "2106202400007",
                            "1719923965963", "0207202400001", "2608202400003", "0209202400001", "1810202400002",
                            "1906202400004", "0908202400012", "0908202400013", "1306202400005", "1306202400005",
                            "1306202400002", "1306202400001", "3006202400002", "3006202400003", "3006202400004",
                            "3006202400005", "3006202400006", "3006202400007", "0208202400002", "0208202400003",
                            "3006202400008", "3006202400009", "3006202400010", "0107202400014", "0207202400004",
                            "0707202400008", "3107202400005", "0908202400005", "1308202400001", "1908202400005", 
                            "2608202400003"
                        ].includes(item.mmbr_code)
                    );
                }

                if (startDate && endDate) {
                    filteredData = filteredData.filter(item => {
                        const itemDate = moment(item.mmbr_date_insert).format("YYYY-MM-DD");
                        const start = moment(startDate).startOf('day');
                        const end = moment(endDate).endOf('day');
                        return moment(itemDate).isBetween(start, end, null, '[]');
                    });
                }

                filteredData.sort((a, b) => moment(b.mmbr_date_insert).diff(moment(a.mmbr_date_insert)));

                setTotal(filteredData.length)
                setOriginalData(filteredData)
                setMemberData(filteredData)

            } else {

                const refappValue = selectedTABUser === 1 ? "tabuserandroid" : "tabuserios";

                const response = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: refappValue })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                allData = data.data || data;

                let filteredData = allData;

                if (selectedTABFilter === 0) {
                    filteredData = filteredData.filter(item =>
                        item.mmbr_name != null &&
                        !item.mmbr_name.includes("User") &&
                        !item.mmbr_name.includes("test") &&
                        !item.mmbr_name.includes("Test") &&
                        !item.mmbr_name.includes("Xxx Alfi Xxx") &&
                        !item.mmbr_name.includes("XXXalifXXX") &&
                        !item.mmbr_name.includes("TEST") &&
                        ![
                            "0611202400002", "1406202400006", "1810202400007", "1810202400006", "0506202400004",
                            "0606202400002", "0406202400004", "0606202400005", "0606202400004", "0806202400004",
                            "1111202300008", "0406202400003", "0906202400001", "0906202400002", "1403202400008",
                            "2108202200001", "0610202300003", "1806202400007", "1406202400009", "2106202400007",
                            "1719923965963", "0207202400001", "2608202400003", "0209202400001", "1810202400002",
                            "1906202400004", "0908202400012", "0908202400013", "1306202400005", "1306202400005",
                            "1306202400002", "1306202400001", "3006202400002", "3006202400003", "3006202400004",
                            "3006202400005", "3006202400006", "3006202400007", "0208202400002", "0208202400003",
                            "3006202400008", "3006202400009", "3006202400010", "0107202400014", "0207202400004",
                            "0707202400008", "3107202400005", "0908202400005", "1308202400001", "1908202400005", 
                            "2608202400003"
                        ].includes(item.mmbr_code)
                    );
                } else if (selectedTABFilter === 1) {
                    filteredData = filteredData.filter(item =>
                        !item.mmbr_name ||
                        item.mmbr_name.includes("User") ||
                        item.mmbr_name.includes("test") ||
                        item.mmbr_name.includes("Test") ||
                        item.mmbr_name.includes("Xxx Alfi Xxx") ||
                        item.mmbr_name.includes("XXXalifXXX") ||
                        item.mmbr_name.includes("TEST") ||
                        [
                            "0611202400002", "1406202400006", "1810202400007", "1810202400006", "0506202400004",
                            "0606202400002", "0406202400004", "0606202400005", "0606202400004", "0806202400004",
                            "1111202300008", "0406202400003", "0906202400001", "0906202400002", "1403202400008",
                            "2108202200001", "0610202300003", "1806202400007", "1406202400009", "2106202400007",
                            "1719923965963", "0207202400001", "2608202400003", "0209202400001", "1810202400002",
                            "1906202400004", "0908202400012", "0908202400013", "1306202400005", "1306202400005",
                            "1306202400002", "1306202400001", "3006202400002", "3006202400003", "3006202400004",
                            "3006202400005", "3006202400006", "3006202400007", "0208202400002", "0208202400003",
                            "3006202400008", "3006202400009", "3006202400010", "0107202400014", "0207202400004",
                            "0707202400008", "3107202400005", "0908202400005", "1308202400001", "1908202400005", 
                            "2608202400003"
                        ].includes(item.mmbr_code)
                    );
                }

                if (startDate && endDate) {
                    filteredData = filteredData.filter(item => {
                        const itemDate = moment(item.mmbr_date_insert).format("YYYY-MM-DD");
                        const start = moment(startDate).startOf('day');
                        const end = moment(endDate).endOf('day');
                        return moment(itemDate).isBetween(start, end, null, '[]');
                    });
                }

                filteredData.sort((a, b) => moment(b.mmbr_date_insert).diff(moment(a.mmbr_date_insert)));

                setTotal(filteredData.length)
                setOriginalData(filteredData)
                setMemberData(filteredData)
            }

            setIsLoading(false)

        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Preloader show={getTotal === null ? true : false} />

            {isLoading && <Loading />}

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form className="navbar-search mb-3">
                            <Row>
                                <Col md={5}>
                                    <Form>
                                        <Form.Group id="topbarSearch">
                                            <Form.Label>Cari Pengguna</Form.Label>
                                            <InputGroup className="input-group-merge search-bar">
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Cari Pengguna"
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
                                <Col md={1}>
                                    <Form.Group id="filter_test_tab">
                                        <Form.Label>TAB User</Form.Label>
                                        <Form.Select
                                            name="tab_user"
                                            value={selectedTABUser}
                                            onChange={(e) => setSelectedTABUser(parseInt(e.target.value))}
                                        >
                                            {getTABUser.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={1}>
                                    <Form.Group id="filter_test_testing">
                                        <Form.Label>Filter</Form.Label>
                                        <Form.Select
                                            name="transaction_status"
                                            value={selectedTABFilter}
                                            onChange={(e) => setSelectedTABFilter(parseInt(e.target.value))}
                                        >
                                            {getTABFilter.map((item) => (
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
                                            <Form.Label>Tanggal Mendaftar</Form.Label>
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
                        </Form>
                        <TnosDataTable
                            title={
                                `Total User : ${getTotal}`
                            }
                            getExportData={memberData}
                            getMenu={`tab-user`}
                            getTanggalMulai={startDate}
                            getTanggalAkhir={endDate}
                            data={
                                <table className="table table-hover align-items-center">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0 text-center">Kode Member</th>
                                            <th className="border-0 text-center">Tanggal Mendaftar</th>
                                            <th className="border-0 text-center">No. Hp</th>
                                            <th className="border-0">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memberData.length > 0 ? (
                                            memberData.map((m, index) => (
                                                <TableRow
                                                    key={`member-${m.mmbr_code}`}
                                                    num={index + 1}
                                                    mmbr_date_insert={m.mmbr_date_insert}
                                                    mmbr_code={m.mmbr_code}
                                                    mmbr_name={m.mmbr_name}
                                                    mmbr_phone={m.mmbr_phone}
                                                    mmbr_email={m.mmbr_email}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={7}>{messageEmptyData}</td>
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
    );
};
