import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faFileAlt,
    faListAlt,
    faIdCard,
    faUserTimes,
    faPencilAlt,
    faPrint,
    faSearch,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import {
    Col,
    Row,
    Nav,
    Card,
    Button,
    Form,
    Badge,
    Tab,
    Modal,
    InputGroup,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import FlashMessage from "react-flash-message";
import ReadableDateTime from "../../components/ReadableDateTime"

import Preloader from "../../components/Preloader";
import moment from "moment";
import { TnosDataTable } from "../../components/TnosDataTable";
import Loading from "../../components/Loading";

export default () => {

    const [getGuardCode, setGuardCode] = useState("");
    const [getGuardData, setGuardData] = useState();
    const [getAllGuardData, setAllGuardData] = useState();
    const [showDefault, setShowDefault] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(1)
    const [selectedKlasifikasi, setSelectedKlasifikasi] = useState(1)
    const [selectedFilterTest, setSelectedFilterTest] = useState(1)

    const [getFlashMesage, setFlashMessage] = useState({
        status: false,
        message: "",
        color: "",
    });

    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => setShowDefault(false);

    const [getStatusArr] = useState([
        {
            key: "key_status_0",
            value: 1,
            defaultValue: "Semua",
        },
        {
            key: "key_status_1",
            value: 2,
            defaultValue: "Online"
        },
        {
            key: "key_status_2",
            value: 3,
            defaultValue: "Offline"
        }
    ])

    const [getStatusVerifArr] = useState([
        {
            key: "key_status_0",
            value: 1,
            defaultValue: "Semua",
        },
        {
            key: "key_status_1",
            value: 2,
            defaultValue: "Lolos Verifikasi Dokumen",
        },
        {
            key: "key_status_2",
            value: 3,
            defaultValue: "Pembekalan",
        }
    ])

    const [getKlasifikasiArr] = useState([
        {
            key: "key_klasifikasi_0",
            value: 1,
            defaultValue: "Semua",
        },
        {
            key: "key_klasifikasi_1",
            value: 2,
            defaultValue: "Platinum"
        },
        {
            key: "key_klasifikasi_2",
            value: 3,
            defaultValue: "Silver"
        }
    ])

    const [getFilterTest] = useState([
        {
            key: "key_filter_0",
            value: 1,
            defaultValue: "Real",
        },
        {
            key: "key_filter_1",
            value: 2,
            defaultValue: "Test"
        }
    ])

    const today = moment().format("YYYY-MM-DD")
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)

    const [startDateActive, setStartDateActive] = useState("2022-07-01");
    const [endDateActive, setEndDateActive] = useState(today)

    const handleSearch = (e) => {
        let datas = getAllGuardData

        datas = datas.filter(
            (item) =>
                item.fullname.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item.code.includes(e.target.value) ||
                item.mobile.includes(e.target.value) ||
                item.email.toLowerCase().includes(e.target.value.toLowerCase())
        )

        setGuardData(datas)
    };

    const makeScedhule = (code) => {
        setShowDefault(true);
        setGuardCode(code);
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

    const getTabs = [
        {
            eventKey: "verifikasi_data",
            label: "Verifikasi Data",
            mmit_status: [0],
            mmit_status_value: ["Menunggu Verifikasi"],
            icon: faFileAlt,
        },
        {
            eventKey: "verifikasi_aktual",
            label: "Verifikasi Aktual",
            mmit_status: [1, 4, 5, 7],
            mmit_status_value: [
                "Lolos Verifikasi Dokumen",
                "Menunggu Verifikasi Aktual",
                "Jadwal Pembekalan",
                "Pembekalan",
            ],
            icon: faListAlt,
        },
        {
            eventKey: "aktif",
            label: "Aktif",
            mmit_status: [9, 10],
            mmit_status_value: ["Online", "Offline"],
            icon: faIdCard,
        },
        {
            eventKey: "tidak_lolos",
            label: "Tidak Lolos",
            mmit_status: [2, 6],
            mmit_status_value: [
                "Tidak Lolos Verifikasi Dokumen",
                "Tidak Lolos Verifikasi Aktual",
            ],
            icon: faUserTimes,
        },
    ]

    const [activeTab, setActiveTab] = useState(getTabs[0].eventKey)

    const changeStatusPartnerLolos = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let HariInterview = " ";
        if (formData.get("name") !== "Interview") {
            let oneDate = moment(formData.get("TglJamInterview").split("T")[0]);
            let dayName = oneDate.format("dddd");
            switch (dayName) {
                case "Monday":
                    HariInterview = "Senin";
                    break;
                case "Tuesday":
                    HariInterview = "Selasa";
                    break;
                case "Wednesday":
                    HariInterview = "Rabu";
                    break;
                case "Thursday":
                    HariInterview = "Kamis";
                    break;
                case "Friday":
                    HariInterview = "Jumat";
                    break;
                case "Saturday":
                    HariInterview = "Sabtu";
                    break;
                case "Sunday":
                    HariInterview = "Minggu";
                    break;
                default:
                    HariInterview = dayName;
                    break;
            }
        }

        let apiTo = "";
        if (formData.get("pembekalan-mitra") === "yes") {
            apiTo = "pembekalan-mitra";
        } else {
            apiTo = "interview-mitra";
        }

        let successMessage = "";
        if (formData.get("statusId") === "1") {
            successMessage = `Berhasil mengatur jadwal verifikasi aktual untuk ${formData.get(
                "Fullname"
            )}`;
        } else if (formData.get("statusId") === "4") {
            successMessage = `Berhasil menetapkan hasil verifikasi aktual untuk ${formData.get(
                "Fullname"
            )}`;
        } else if (formData.get("statusId") === "5") {
            successMessage = `Berhasil mengatur jadwal pembekalan untuk ${formData.get(
                "Fullname"
            )}`;
        }
        fetch(
            `${process.env.REACT_APP_MITRA_TNOS_API_URL}/${apiTo}/${getGuardCode}`,
            {
                method: "POST",
                body: JSON.stringify({
                    name: formData.get("name") ? formData.get("name") : "",
                    code: getGuardCode,
                    LokasiInterview: formData.get("LokasiInterview")
                        ? formData.get("LokasiInterview")
                        : "",
                    HariInterview: HariInterview ? HariInterview : "",
                    TglInterview: formData.get("TglJamInterview")
                        ? formData.get("TglJamInterview").split("T")[0]
                        : "",
                    JamInterview: formData.get("TglJamInterview")
                        ? formData.get("TglJamInterview").split("T")[1]
                        : "",
                    note: "Note",
                    status: formData.get("status") ? formData.get("status") : "",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setShowDefault(false);
                setFlashMessage({
                    status: true,
                    message: successMessage,
                    color: "success",
                });
                setTimeout(() => {
                    setFlashMessage({
                        status: false,
                        message: "",
                        color: "",
                    });
                    window.location.reload();
                }, 3000);
            });
    };

    const activateMember = (usercode) => {
        fetch(
            `${process.env.REACT_APP_API_TNOSWORLD_URL}/guard/auth/account/activated`,
            {
                method: "POST",
                body: JSON.stringify({
                    active: "9",
                    usercode,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                window.location.reload();
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const TableRow = (props) => {
        const {
            code,
            mmit_date_insert,
            fullname,
            email,
            mobile,
            levelname,
            mmit_status,
        } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td className="fw-bold">{fullname}</td>
                <td>{code}</td>
                <td>{ReadableDateTime(mmit_date_insert)}</td>
                <td>{email}</td>
                <td>{mobile}</td>
                <td>
                    {levelname === "A" ? (
                        <Badge bg="primary" className="ms-1 badge-lg">
                            Platinum
                        </Badge>
                    ) : levelname === "B" ? (
                        <Badge bg="light" className="ms-1 text-dark badge-lg">
                            Silver
                        </Badge>
                    ) : levelname === "C" ? (
                        <Badge bg="light" className="ms-1 text-dark badge-lg">
                            Silver
                        </Badge>
                    ) : (
                        ""
                    )}
                </td>
                <td>
                    <Badge
                        bg={
                            mmit_status === 0
                                ? "cyan"
                                : mmit_status === 1
                                    ? "soft-green"
                                    : mmit_status === 2
                                        ? "warning"
                                        : mmit_status === 3
                                            ? "secondary"
                                            : mmit_status === 4
                                                ? "primary"
                                                : mmit_status === 5
                                                    ? "gray"
                                                    : mmit_status === 6
                                                        ? "blue"
                                                        : mmit_status === 7
                                                            ? "pink"
                                                            : mmit_status === 9
                                                                ? "success"
                                                                : mmit_status === 10
                                                                    ? "gray"
                                                                    : ""
                        }
                        className="badge-lg"
                    >
                        {mmit_status === 0
                            ? "Menunggu Verifikasi"
                            : mmit_status === 1
                                ? "Lolos Verifikasi Dokumen"
                                : mmit_status === 2
                                    ? "Tidak Lolos Verifikasi Dokumen"
                                    : mmit_status === 3
                                        ? "Atur Jadwal Verifikasi Aktual"
                                        : mmit_status === 4
                                            ? "Menunggu Verifikasi Aktual"
                                            : mmit_status === 5
                                                ? "Jadwal Pembekalan"
                                                : mmit_status === 6
                                                    ? "Tidak Lolos Verifikasi Aktual"
                                                    : mmit_status === 7
                                                        ? "Pembekalan"
                                                        : mmit_status === 9
                                                            ? "Online"
                                                            : mmit_status === 10
                                                                ? "Offline"
                                                                : ""}
                    </Badge>
                </td>
                <td>
                    {mmit_status === 0 ? (
                        <>
                            <Link to={`/partner/guard/detail/${code}`}>
                                <Button variant="dark" size="sm">
                                    <FontAwesomeIcon icon={faList} />
                                    &nbsp; Detail
                                </Button>
                            </Link>
                        </>
                    ) : mmit_status === 1 ? (
                        <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            &nbsp; Atur Jadwal
                        </Button>
                    ) : mmit_status === 4 ? (
                        <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                            &nbsp; Masukkan Hasil
                        </Button>
                    ) : mmit_status === 5 ? (
                        <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            &nbsp; Atur Jadwal
                        </Button>
                    ) : mmit_status === 7 ? (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => activateMember(code)}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} />
                            &nbsp; Aktivasi
                        </Button>
                    ) : mmit_status === 9 || mmit_status === 10 ? (
                        <Link to={`/partner/guard/profile/${code}`}>
                            <Button variant="dark" size="sm">
                                <FontAwesomeIcon icon={faList} />
                                &nbsp; Detail
                            </Button>
                        </Link>
                    ) : (
                        ""
                    )}
                    <Link to={`/partner/guard/update/${code}`} className="ms-2">
                        <Button variant="warning" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>
                    </Link>
                </td>
            </tr>
        );
    };

    const fetchData = () => {

        setIsLoading(true)

        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
            method: "POST",
            body: JSON.stringify({ category: "1" }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((data) => {

                let extractedDataResponse = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

                let filteredData = extractedDataResponse;

                if (activeTab === "aktif") {
                    filteredData = filteredData.filter(item => {
                        if (selectedFilterTest === 1) {
                            return item.code !== "1808202200003" && item.code !== "1808202200002" && item.code !== "1808202200001" && item.code !== "2701202400001" &&
                                !item.fullname.toLowerCase().includes("test");
                        } else if (selectedFilterTest === 2) {
                            return item.code === "1808202200003" || item.code === "1808202200002" || item.code === "1808202200001" || item.code === "2701202400001" ||
                                item.fullname.toLowerCase().includes("test");
                        }
                        return true;
                    });
                } else {
                    if (selectedFilterTest === 1) {
                        filteredData = filteredData.filter(
                            item => !item.fullname.toLowerCase().includes("test")
                        );
                    } else if (selectedFilterTest === 2) {
                        filteredData = filteredData.filter(
                            item => item.fullname.toLowerCase().includes("test")
                        );
                    }
                }

                if (selectedKlasifikasi === 1) {
                    filteredData = filteredData
                } else if (selectedKlasifikasi === 2) {
                    filteredData = filteredData.filter((item) => item.levelname === "A")
                } else if (selectedKlasifikasi === 3) {
                    filteredData = filteredData.filter(item => ["B", "C"].includes(item.levelname))
                }
                
                if (activeTab === "aktif") {
                    if (selectedFilter === 1) {
                        filteredData = filteredData
                    } else if (selectedFilter === 2) {
                        filteredData = filteredData.filter((item) => item.mmit_status === 9)
                    } else if (selectedFilter === 3) {
                        filteredData = filteredData.filter((item) => item.mmit_status === 10)
                    }
                } else if (activeTab === "verifikasi_aktual") {
                    if (selectedFilter === 1) {
                        filteredData = filteredData
                    } else if (selectedFilter === 2) {
                        filteredData = filteredData.filter((item) => item.mmit_status === 1)
                    } else if (selectedFilter === 3) {
                        filteredData = filteredData.filter((item) => item.mmit_status === 7)
                    }
                }

                if (activeTab === "aktif") {
                    if (startDateActive && endDateActive) {
                        filteredData = filteredData
                            .filter(item => {
                                const itemDate = new Date(item.mmit_date_insert);
                                const start = new Date(startDateActive);
                                const end = new Date(endDateActive);
                                return itemDate >= start && itemDate <= end
                            });
                    }
                } else {
                    if (startDate && endDate) {
                        filteredData = filteredData
                            .filter(item => {
                                const itemDate = new Date(item.mmit_date_insert);
                                const start = new Date(startDate);
                                const end = new Date(endDate);
                                return itemDate >= start && itemDate <= end
                            });
                    }
                }

                filteredData.sort((a, b) => new Date(b.mmit_date_insert) - new Date(a.mmit_date_insert));

                setGuardData(filteredData)
                setAllGuardData(filteredData)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        setSelectedFilter(1)
    }, [activeTab])

    useEffect(() => {
        fetchData()
    }, [activeTab])

    return (
        <>
            <Preloader show={!getGuardData ? true : false} />

            {isLoading && <Loading />}

            <Col xl={12} className="mt-2">
                <Tab.Container
                    defaultActiveKey={getTabs[0].eventKey}
                    onSelect={(selectedKey) => setActiveTab(selectedKey)}
                >
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                {getTabs.map((category) => (
                                    <Nav.Item className="col-md-3" key={category.eventKey}>
                                        <Nav.Link
                                            eventKey={category.eventKey}
                                            className="text-center"
                                        >
                                            <FontAwesomeIcon icon={category.icon} className="me-2" />{" "}
                                            {category.label}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>
                        <Col lg={12}>

                            <Tab.Content>
                                {getTabs.map((category) => (
                                    <Tab.Pane key={category.eventKey} eventKey={category.eventKey}>
                                        <Card border="light">
                                            <Card.Body>

                                                <Row className="mb-3">
                                                    {activeTab === "verifikasi_data" ? "" : (
                                                        <Col md={3}>
                                                            <Form.Group id="filter_test">
                                                                <Form.Label>Status</Form.Label>
                                                                <Form.Select
                                                                    name="transaction_status"
                                                                    value={selectedFilter}
                                                                    onChange={(e) => setSelectedFilter(parseInt(e.target.value))}
                                                                    required
                                                                >
                                                                    {category.eventKey === "verifikasi_aktual" ? (
                                                                        <>
                                                                            {getStatusVerifArr?.map((item) => (
                                                                                <option key={item.key} value={item.value}>
                                                                                    {item.defaultValue}
                                                                                </option>
                                                                            ))}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {getStatusArr?.map((item) => (
                                                                                <option key={item.key} value={item.value}>
                                                                                    {item.defaultValue}
                                                                                </option>
                                                                            ))}
                                                                        </>
                                                                    )}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                    )}

                                                    <Col md={activeTab === "verifikasi_data" ? 4 : 2}>
                                                        <Form.Group id="filter_test">
                                                            <Form.Label>Klasifikasi</Form.Label>
                                                            <Form.Select
                                                                name="klasifikasi"
                                                                value={selectedKlasifikasi}
                                                                onChange={(e) => setSelectedKlasifikasi(parseInt(e.target.value))}
                                                                required
                                                            >
                                                                {getKlasifikasiArr?.map((item) => (
                                                                    <option key={item.key} value={item.value}>
                                                                        {item.defaultValue}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col md={activeTab === "verifikasi_data" ? 3 : 2}>
                                                        <Form.Group id="filter_test">
                                                            <Form.Label>Filter</Form.Label>
                                                            <Form.Select
                                                                name="klasifikasi"
                                                                value={selectedFilterTest}
                                                                onChange={(e) => setSelectedFilterTest(parseInt(e.target.value))}
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
                                                                        value={activeTab === "aktif" ? startDateActive : startDate}
                                                                        onChange={(e) => activeTab === "aktif" ? setStartDateActive(e.target.active) : setStartDate(e.target.value)}
                                                                    />
                                                                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                                    <Form.Control
                                                                        type="date"
                                                                        name="end_date_time"
                                                                        step="1"
                                                                        required
                                                                        value={activeTab === "aktif" ? endDateActive : endDate}
                                                                        onChange={(e) => activeTab === "aktif" ? setEndDateActive(e.target.value) : setEndDate(e.target.value)}
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
                                                                <Form.Label>Cari Mitra Pengamanan</Form.Label>
                                                                <InputGroup className="input-group-merge search-bar">
                                                                    <InputGroup.Text>
                                                                        <FontAwesomeIcon icon={faSearch} />
                                                                    </InputGroup.Text>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Cari Mitra Pengamanan"
                                                                        id="all_search"
                                                                        onKeyUp={handleSearch}
                                                                    />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                </Row>

                                                <TnosDataTable
                                                    // getExportData={getGuardData}
                                                    // getMenu={`mitra-pengamanan`}
                                                    data={
                                                        <>
                                                            <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                                <tr>
                                                                    <th className="border-0">No.</th>
                                                                    <th className="border-0">Nama</th>
                                                                    <th className="border-0">Kode Mitra</th>
                                                                    <th className="border-0">Tanggal Mendaftar</th>
                                                                    <th className="border-0">Email</th>
                                                                    <th className="border-0">Nomor Telepon</th>
                                                                    <th className="border-0">Klasifikasi</th>
                                                                    <th className="border-0">Status</th>
                                                                    <th className="border-0">
                                                                        {" "}
                                                                        <Link to={`/partner/guard/barcodes`}>
                                                                            <Badge bg="primary" className="badge-lg">
                                                                                <FontAwesomeIcon icon={faPrint} />
                                                                                &nbsp; Cetak Barcode
                                                                            </Badge>
                                                                        </Link>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {getGuardData
                                                                    ?.filter(
                                                                        (gdItem) =>
                                                                            category.mmit_status.includes(gdItem.mmit_status) &&
                                                                            gdItem.mmid_data !== null
                                                                    )
                                                                    .map((gd, index) => (
                                                                        <TableRow
                                                                            key={`guard-data-${gd.code}`}
                                                                            {...gd}
                                                                            num={index + 1}
                                                                        />
                                                                    )).length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan={9} className="text-center">
                                                                            Tidak Ada Data
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    getGuardData
                                                                        ?.filter(
                                                                            (gdItem) =>
                                                                                category.mmit_status.includes(gdItem.mmit_status) &&
                                                                                gdItem.mmid_data !== null
                                                                        )
                                                                        .map((gd, index) => (
                                                                            <TableRow
                                                                                key={`guard-data-${gd.code}`}
                                                                                {...gd}
                                                                                num={index + 1}
                                                                            />
                                                                        ))
                                                                )}

                                                            </tbody>
                                                        </>
                                                    }
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>

            <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="h6">
                        {getGuardData?.map((gd) => (
                            <>
                                {gd.code === getGuardCode && (
                                    <>
                                        {gd.mmit_status === 1
                                            ? "Atur Jadwal Verifikasi Aktual"
                                            : gd.mmit_status === 4
                                                ? "Hasil Verifikasi Aktual"
                                                : gd.mmit_status === 5
                                                    ? "Atur Jadwal Pembekalan"
                                                    : gd.mmit_status === 7
                                                        ? "Atur Jadwal Pembekalan"
                                                        : gd.mmit_status === 9
                                                            ? "Atur Jadwal Aktif"
                                                            : ""}
                                    </>
                                )}
                            </>
                        ))}
                    </Modal.Title>
                    <Button variant="close" aria-label="Close" onClick={handleClose} />
                </Modal.Header>
                <Modal.Body>
                    {" "}
                    {getGuardData?.map((gd) => (
                        <>
                            {gd.code === getGuardCode && (
                                <>
                                    {gd.mmit_status === 1 ? (
                                        <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                                            <input type="hidden" name="statusId" value="1" />
                                            <input
                                                type="hidden"
                                                name="name"
                                                value="JadwalInterview"
                                            />
                                            <input
                                                type="hidden"
                                                name="Fullname"
                                                value={gd.fullname}
                                            />
                                            <Row>
                                                <Col className="mb-3">
                                                    <Form.Group id="LokasiInterview">
                                                        <Form.Label>Lokasi Verifikasi Aktual </Form.Label>
                                                        <Form.Select name="LokasiInterview" required>
                                                            <option
                                                                key="LokasiInterview_1"
                                                                value="CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2, Banten"
                                                            >
                                                                CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2,
                                                                Banten
                                                            </option>
                                                            <option
                                                                key="LokasiInterview_2"
                                                                value="Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama, Jakarta Selatan"
                                                            >
                                                                Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama,
                                                                Jakarta Selatan
                                                            </option>
                                                            <option
                                                                key="LokasiInterview_3"
                                                                value="Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati"
                                                            >
                                                                Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati
                                                            </option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Col md={12} className="mb-3">
                                                            <Form.Group id="TglJamInterview">
                                                                <Form.Label>
                                                                    Tanggal / Jam Verifikasi Aktual
                                                                </Form.Label>
                                                                <Form.Control
                                                                    required
                                                                    type="datetime-local"
                                                                    name="TglJamInterview"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Col md={12} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Dokumen Verifikasi Aktual
                                                                </Form.Label>
                                                                <ol>
                                                                    <li>KTP</li>
                                                                    <li>Kartu Keluarga</li>
                                                                    <li>SKCK</li>
                                                                    <li>Surat Keterangan Bebas Narkoba</li>

                                                                    {JSON.parse(gd.mmid_data)[0].data[0]
                                                                        .current_job === "1" ||
                                                                        JSON.parse(gd.mmid_data)[0].data[0]
                                                                            .current_job === "2" ? (
                                                                        <>
                                                                            <li>Skep Purna / KTA</li>
                                                                            <li>Sertifikat Brevet TNI / POLRI</li>
                                                                        </>
                                                                    ) : (
                                                                        <li>Sertifikat Pendidikan Satpam</li>
                                                                    )}

                                                                    <li>Sertifikat Bela Diri</li>
                                                                    <li>Pegalaman Kerja Bid Pengamanan</li>
                                                                </ol>
                                                                {JSON.parse(gd.mmid_data)[0].data[0]
                                                                    .current_job === "1" ||
                                                                    JSON.parse(gd.mmid_data)[0].data[0]
                                                                        .current_job === "2" ? (
                                                                    <small>
                                                                        ( Nomor 1-5 asli dokumen wajib dibawa )
                                                                    </small>
                                                                ) : (
                                                                    <small>
                                                                        ( Nomor 1-4 asli dokumen wajib dibawa )
                                                                    </small>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Button
                                                variant="link"
                                                className="text-gray ms-auto"
                                                onClick={handleClose}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="float-end"
                                            >
                                                Atur Jadwal
                                            </Button>
                                        </Form>
                                    ) : gd.mmit_status === 4 ? (
                                        <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                                            <input type="hidden" name="statusId" value="4" />
                                            <input type="hidden" name="name" value="Interview" />
                                            <input
                                                type="hidden"
                                                name="Fullname"
                                                value={gd.fullname}
                                            />
                                            <Row>
                                                <Col className="mb-3">
                                                    <Form.Group id="lulus_gagal_interview">
                                                        <Form.Label>
                                                            Apakah hasil verifikasi aktual yang bersangkutan
                                                            sesuai ?
                                                        </Form.Label>
                                                    </Form.Group>
                                                    <Form.Check
                                                        inline
                                                        defaultChecked
                                                        type="radio"
                                                        defaultValue="Y"
                                                        label="Sesuai"
                                                        name="status"
                                                        id="lulus_interview"
                                                        htmlFor="lulus_interview"
                                                    />

                                                    <Form.Check
                                                        inline
                                                        type="radio"
                                                        defaultValue="N"
                                                        label="Tidak Sesuai"
                                                        name="status"
                                                        id="gagal_interview"
                                                        htmlFor="gagal_interview"
                                                    />

                                                    <Form.Group id="catatan" className="mt-4 d-none">
                                                        <Form.Label>
                                                            Catatan
                                                            <span className="text-danger"> *</span>
                                                        </Form.Label>
                                                        <Form.Control as="textarea" name="note" rows={5} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="float-end"
                                            >
                                                Kirim
                                            </Button>
                                        </Form>
                                    ) : gd.mmit_status === 5 ? (
                                        <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                                            <input type="hidden" name="statusId" value="5" />
                                            <input
                                                type="hidden"
                                                name="pembekalan-mitra"
                                                value="yes"
                                            />
                                            <input
                                                type="hidden"
                                                name="name"
                                                value="JadwalInterview"
                                            />
                                            <input
                                                type="hidden"
                                                name="Fullname"
                                                value={gd.fullname}
                                            />
                                            <Row>
                                                <Col className="mb-3">
                                                    <Form.Group id="LokasiInterview">
                                                        <Form.Label>Lokasi Pembekalan </Form.Label>
                                                        <Form.Select name="LokasiInterview" required>
                                                            <option
                                                                key="LokasiInterview_1"
                                                                value="CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2, Banten"
                                                            >
                                                                CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2,
                                                                Banten
                                                            </option>
                                                            <option
                                                                key="LokasiInterview_2"
                                                                value="Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama, Jakarta Selatan"
                                                            >
                                                                Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama,
                                                                Jakarta Selatan
                                                            </option>
                                                            <option
                                                                key="LokasiInterview_3"
                                                                value="Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati"
                                                            >
                                                                Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati
                                                            </option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Col md={12} className="mb-3">
                                                            <Form.Group id="TglJamInterview">
                                                                <Form.Label>
                                                                    Tanggal / Jam Pembekalan
                                                                </Form.Label>
                                                                <Form.Control
                                                                    required
                                                                    type="datetime-local"
                                                                    name="TglJamInterview"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Button
                                                variant="link"
                                                className="text-gray ms-auto"
                                                onClick={handleClose}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="float-end"
                                            >
                                                Atur Jadwal
                                            </Button>
                                        </Form>
                                    ) : gd.mmit_status === 7 ? (
                                        "Atur Jadwal Pembekalan"
                                    ) : gd.mmit_status === 9 ? (
                                        "Atur Jadwal Aktif"
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}
                        </>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    );
};