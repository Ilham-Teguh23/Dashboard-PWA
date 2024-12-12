import React, { useState, useEffect, useRef } from "react";
import ReactExport from "react-export-excel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Col,
    Card,
    Row,
    Button,
    Form,
    InputGroup,
    Badge,
    Modal,
    Alert,
} from "@themesberg/react-bootstrap";
import { faFileExcel, faSearch } from "@fortawesome/free-solid-svg-icons";
import { TnosDataTable } from "../../components/TnosDataTable";
import FlashMessage from "react-flash-message";
import moment from "moment"
import Preloader from "../../components/Preloader";
import Loading from "../../components/Loading";

export default () => {

    const [originalData, setOriginalData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState(0)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false)
    const [getActiveStatus, setActiveStatus] = useState("W")
    const [getRefundData, setRefundData] = useState()
    const [getRefundSid, setRefundSid] = useState()
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada data pada status ini"
    )
    const [getFlashMesage, setFlashMessage] = useState({
        status: false,
        message: "",
        color: "",
    });

    const [getFilter] = useState([
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
    ])

    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null)

    const [getPaymentStatusArr] = useState([
        {
            key: "payment_status_0",
            value: 0,
            defaultValue: "Semua Pengajuan"
        },
        {
            key: "payment_status_1",
            value: 1,
            defaultValue: "Menunggu"
        },
        {
            key: "payment_status_2",
            value: 2,
            defaultValue: "Sedang Diproses"
        },
        {
            key: "payment_status_3",
            value: 3,
            defaultValue: "Selesai"
        }
    ])

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setRefundData([...originalData]);
            return
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.sid && item.sid.toLowerCase().includes(searchTerm)) ||
                (item.bank_norek && item.bank_norek.toLowerCase().includes(searchTerm)) ||
                (item.bank_account && item.bank_account.toLowerCase().includes(searchTerm))
            )
        });

        setRefundData(filteredData);
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

    const onDoneSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/refund/complete`, {
            method: "POST",
            body: JSON.stringify({
                sid: getRefundSid,
                noref: formData.get("reference_num"),
                bank: formData.get("reference_bank"),
                note: formData.get("reference_note"),
                adminid: localStorage.getItem("user_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setFlashMessage({
                        status: true,
                        message: `Berhasil mengubah status pengembalian dengan sid ${getRefundSid} dari Proses ke Selesai`,
                        color: "success",
                    });
                    localStorage.setItem("activeRefundStatus", "Y");
                    window.location.reload();
                } else {
                    setFlashMessage({
                        status: true,
                        message: `Gagal mengubah status`,
                        color: "danger",
                    });
                }
            });
    };

    const updateStatus = (sid) => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/refund/proses`, {
            method: "POST",
            body: JSON.stringify({
                sid: sid,
                adminid: localStorage.getItem("user_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setFlashMessage({
                        status: true,
                        message: `Berhasil mengubah status pengembalian dengan sid ${sid} dari Menunggu ke Proses`,
                        color: "success",
                    });
                    localStorage.setItem("activeRefundStatus", "P");
                    window.location.reload();
                } else {
                    setFlashMessage({
                        status: true,
                        message: `Gagal mengubah status`,
                        color: "danger",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const TableRow = (props) => {
        const {
            sid,
            total,
            potongan,
            kembali,
            mitrafee,
            compfee,
            bank_name,
            bank_norek,
            bank_account,
            create_at,
            status,
        } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td>{sid}</td>
                <td>{"IDR " + parseInt(total).toLocaleString("id-ID", {})}</td>
                <td>{"IDR " + parseInt(potongan).toLocaleString("id-ID", {})}</td>
                <td>{"IDR " + parseInt(kembali).toLocaleString("id-ID", {})}</td>
                <td>{"IDR " + parseInt(mitrafee).toLocaleString("id-ID", {})}</td>
                <td>{"IDR " + parseInt(compfee).toLocaleString("id-ID", {})}</td>
                <td>{bank_name}</td>
                <td>{bank_norek}</td>
                <td>{bank_account}</td>
                <td>
                    {getRefundDateTime(
                        create_at.split("+")[0].split("T")[0],
                        create_at.split("+")[0].split("T")[1],
                        true
                    )}
                </td>
                <td>
                    <Badge
                        bg={
                            status === "W"
                                ? "danger"
                                : status === "P"
                                    ? "warning"
                                    : status === "Y"
                                        ? "success"
                                        : ""
                        }
                        className="badge-lg"
                    >
                        {status === "W"
                            ? "Menunggu"
                            : status === "P"
                                ? "Sedang Diproses"
                                : status === "Y"
                                    ? "Selesai"
                                    : ""}
                    </Badge>
                </td>
                {getActiveStatus !== "Y" && (
                    <td>
                        <Badge
                            bg={status === "W" ? "warning" : status === "P" ? "primary" : ""}
                            className="badge-lg"
                            style={{ cursor: "pointer" }}
                        >
                            {status === "W" ? (
                                <span onClick={() => updateStatus(sid)}>Proses</span>
                            ) : status === "P" ? (
                                <>
                                    <span
                                        onClick={() => {
                                            setShow(true);
                                            setRefundSid(sid);
                                        }}
                                    >
                                        Masukkan No. Referensi
                                    </span>
                                    <Modal show={show} onHide={handleClose} centered size="sm">
                                        <Modal.Body>
                                            <Form onSubmit={onDoneSubmit} method="POST">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        Bank <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="reference_bank"
                                                        placeholder="cth : BCA"
                                                        autoFocus
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        No. Referensi <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="reference_num"
                                                        placeholder="cth : 2346278"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Catatan</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows="6"
                                                        name="reference_note"
                                                    />
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        {" "}
                                                        <Button
                                                            variant="secondary"
                                                            onClick={handleClose}
                                                            className="btn btn-sm w-100"
                                                        >
                                                            Tutup
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        {" "}
                                                        <Button
                                                            type="submit"
                                                            variant="primary"
                                                            className="btn btn-sm w-100"
                                                        >
                                                            Kirim
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            ) : (
                                ""
                            )}
                        </Badge>
                    </td>
                )}
            </tr>
        );
    };

    const getRefundDateTime = (tglPengajuanBefore, jamPengajuan, split) => {
        let tglPengajuan = split
            ? tglPengajuanBefore.split("-").reverse().toString().replaceAll(",", "-")
            : tglPengajuanBefore;
        return tglPengajuan + " " + jamPengajuan;
    };

    const fetchData = async () => {

        try {
            setIsLoading(true)

            const response = await fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/refund/list`, {
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

            if (selectedFilter === 0) {
                filteredData = filteredData.filter(item =>
                    !item.bank_account.includes("Testing") &&
                    !item.bank_account.includes("Test") &&
                    !item.bank_name.includes("Test")
                );
            } else if (selectedFilter === 1) {
                filteredData = filteredData.filter(item =>
                    item.bank_account.includes("Testing") ||
                    item.bank_account.includes("Test") ||
                    item.bank_name.includes("Test")
                );
            }

            if (selectedStatus === 0) {
                filteredData = filteredData
            } else if (selectedStatus === 1) {
                filteredData = filteredData.filter((item) => item.status === "W")
            } else if (selectedStatus === 2) {
                filteredData = filteredData.filter((item) => item.status === "P")
            } else if (selectedStatus === 3) {
                filteredData = filteredData.filter((item) => item.status === "Y")
            }

            if (startDate && endDate) {
                filteredData = filteredData.filter(item => {
                    const itemDate = moment(item.create_at).format("YYYY-MM-DD")
                    const start = moment(startDate).startOf('day')
                    const end = moment(endDate).endOf('day')
                    return moment(itemDate).isBetween(start, end, null, '[]')
                });
            }

            filteredData.sort((a, b) => {
                const dateA = moment(a.create_at)
                const dateB = moment(b.create_at)
                return dateB.diff(dateA)
            });

            setOriginalData(filteredData)
            setRefundData(filteredData)
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
            <Preloader show={!getRefundData ? true : false} />

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
                            <Col md={1}>
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
                            <Col md={1}>
                                <Form.Group id="filter_test_testing">
                                    <Form.Label>Filter</Form.Label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(parseInt(e.target.value))}
                                    >
                                        {getFilter.map((item) => (
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
                            alert={
                                getFlashMesage?.status === true && (
                                    <FlashMessage duration={3000} persistOnHover={true}>
                                        <Alert variant={getFlashMesage.color}>
                                            <div className="d-flex justify-content-between">
                                                <div>{getFlashMesage.message}</div>
                                            </div>
                                        </Alert>
                                    </FlashMessage>
                                )
                            }
                            data={
                                <>
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-0">No.</th>
                                            <th className="border-0">sid</th>
                                            <th className="border-0">Total</th>
                                            <th className="border-0">Potongan</th>
                                            <th className="border-0">Kembali</th>
                                            <th className="border-0">Pendapatan Mitra</th>
                                            <th className="border-0">Pendapatan Perusahaan</th>
                                            <th className="border-0">Bank</th>
                                            <th className="border-0">No. Rekening</th>
                                            <th className="border-0">Atas Nama</th>
                                            <th className="border-0">Waktu Pengajuan</th>
                                            <th className="border-0">Status</th>
                                            <th className="border-0 text-center">
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
                                                    filename={`Pembayaran Refund`}
                                                >
                                                    <ExcelSheet
                                                        data={getRefundData}
                                                        name="Data Pengembalian"
                                                    >
                                                        <ExcelColumn label="SID" value="sid" />
                                                        <ExcelColumn
                                                            label="Total"
                                                            value={(col) =>
                                                                "IDR " +
                                                                parseInt(col.total).toLocaleString("id-ID", {})
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Potongan"
                                                            value={(col) =>
                                                                "IDR " +
                                                                parseInt(col.potongan).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Kembali"
                                                            value={(col) =>
                                                                "IDR " +
                                                                parseInt(col.kembali).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Pendapatan Mitra"
                                                            value={(col) =>
                                                                "IDR " +
                                                                parseInt(col.mitrafee).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Pendapatan Perusahaan"
                                                            value={(col) =>
                                                                "IDR " +
                                                                parseInt(col.compfee).toLocaleString(
                                                                    "id-ID",
                                                                    {}
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn label="Bank" value="bank_name" />
                                                        <ExcelColumn
                                                            label="No. Rekening"
                                                            value="bank_norek"
                                                        />
                                                        <ExcelColumn
                                                            label="Atas Nama"
                                                            value="bank_account"
                                                        />
                                                        <ExcelColumn
                                                            label="Waktu Pengajuan"
                                                            value={(col) =>
                                                                getRefundDateTime(
                                                                    col.create_at.split("+")[0].split("T")[0],
                                                                    col.create_at.split("+")[0].split("T")[1],
                                                                    true
                                                                )
                                                            }
                                                        />
                                                        <ExcelColumn
                                                            label="Status"
                                                            value={(col) =>
                                                                col.status === "W"
                                                                    ? "Menunggu"
                                                                    : col.status === "P"
                                                                        ? "Sedang Diproses"
                                                                        : col.status === "Y"
                                                                            ? "Selesai"
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
                                        {getRefundData?.length > 0 ? (
                                            getRefundData?.map((pr, index) => (
                                                <TableRow
                                                    key={`payment-refund-${pr.sid}`}
                                                    {...pr}
                                                    num={index + 1}
                                                />
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colspan={13}>{getMessageEmptyData}</td>
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