import { Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import ConvertTimestamps from "../../components/ConvertTimestamps";
import CurrencyFormatter from "../../components/CurrencyFormatter";
import moment from "moment";
import Loading from "../../components/Loading";
import Preloader from "../../components/Preloader";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [selectedKategori, setSelectedKategori] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [getHistoryData, setHistoryData] = useState([]);
    const [getMessageEmptyData, setMessageEmptyData] = useState("Belum ada transaksi pada hari ini");
    
    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [getTotalAmountToday, setTotalAmountToday] = useState();

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

    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setHistoryData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                (item.external_id && item.external_id.toLowerCase().includes(searchTerm))
            );
        });

        setHistoryData(filteredData);
    };

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

    const [getFilterKategori] = useState([
        {
            key: "key_status_0",
            value: 0,
            defaultValue: "Semua"
        },
        {
            key: "key_status_1",
            value: 1,
            defaultValue: "Siplah",
        },
        {
            key: "key_status_2",
            value: 2,
            defaultValue: "Website TNOS"
        }
    ]);

    const [getPaymentStatusArr] = useState([
        {
            key: "payment_status_0",
            value: 0,
            defaultValue: "Semua",
            us: "All Status",
            desc: "Menampilkan Semua Status Pembayaran",
            color: "",
        },
        {
            key: "payment_status_1",
            value: 1,
            defaultValue: "Selesai",
            us: "Selesai",
            desc: "Transaksi Selesai",
            color: "primary",
        },
    ]);

    const TableRow = (props) => {
        const {
            amount,
            external_id,
            tanggal_transaksi,
            name,
            nama_paket,
            status_transaksi,
            kategori_pembelian,
            jenis_pembelian,
            nama_responder,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">{external_id ? external_id : "-"}</td>
                <td className="text-center">
                    <Badge bg={status_transaksi === "PENDING" ? 'warning' : status_transaksi == "PAID" || status_transaksi === "SETTLED" ? 'success' : 'danger'} className="badge-lg">
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
                <td className="">{name == null ? '-' : name}</td>
                <td className="">{nama_responder == null ? '-' : nama_responder}</td>
                <td className="text-center" style={{textTransform: 'uppercase' }}>
                    <Badge bg={nama_paket === "Basic" ? "success" : nama_paket === "Video Call" ? "primary" : nama_paket === "Voice Call" ? "warning" : "" } className="badge-lg">
                        {nama_paket}
                    </Badge>
                </td>
                <td className="text-center" style={{ textTransform: 'uppercase' }}>
                    <Badge bg={kategori_pembelian === "Website TNOS" ? "success" : kategori_pembelian === "Siplah" ? "primary" : "" } className="badge-lg">
                        {kategori_pembelian}
                    </Badge>
                </td>
                <td className="text-center">
                    {jenis_pembelian == "" ? (
                        <Badge bg="danger" className="badge-lg">
                            Tidak Ada Keterangan
                            &nbsp;
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={<Tooltip>Tidak Ada Keterangan Jenis Pembelian</Tooltip>}
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    style={{ cursor: "pointer" }}
                                />
                            </OverlayTrigger>
                        </Badge>
                    ) : jenis_pembelian}
                </td>
                <td className="text-center">
                    <CurrencyFormatter amount={amount} />
                </td>
                <td className="text-center">
                    <ConvertTimestamps timestamp={tanggal_transaksi} />
                </td>
            </tr>
        );
    };

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/payment/history`);
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

            let filteredData = extractedData

            if (selectedKategori === 0) {
                filteredData = filteredData;
            } else if (selectedKategori === 1) {
                filteredData = filteredData.filter(item => item.kategori_pembelian === "Siplah");
            } else if (selectedKategori === 2) {
                filteredData = filteredData.filter(item => item.kategori_pembelian === "Website TNOS");
            }

            if (selectedFilter === 1) {
                filteredData = filteredData.filter(item =>
                    !item.name.includes("Test")
                )
            } else if (selectedFilter == 2) {
                filteredData = filteredData.filter(item =>
                    item.name.includes("Test")
                )
            }

            if (startDate && endDate) {
                filteredData = filteredData.filter(item => {
                    const itemDate = moment(parseInt(item.tanggal_transaksi)).format("YYYY-MM-DD");
                    const start = moment(startDate).startOf('day');
                    const end = moment(endDate).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            filteredData.sort((a, b) => b.timestamp - a.timestamp);
            const totalAmountToday = filteredData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

            const formattedTotalAmount = totalAmountToday.toLocaleString("id-ID", {
                minimumFractionDigits: 0
            });

            setTotalAmountToday(formattedTotalAmount);

            setOriginalData(filteredData)
            setHistoryData(filteredData)
            setIsLoading(false)
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Preloader show={!getTotalAmountToday ? true : false} />

            {isLoading && <Loading />}

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
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
                            <Col md={2}>
                                <Form.Group id="filter_test">
                                    <Form.Label>Kategori</Form.Label>
                                    <Form.Select
                                        name="kategori_pembelian"
                                        value={selectedKategori}
                                        onChange={(e) => setSelectedKategori(parseInt(e.target.value))}
                                        required
                                    >
                                        {getFilterKategori?.map((item) => (
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
                        </Row>

                        <TnosDataTable
                            title={
                                `Total Transaksi : IDR ${getTotalAmountToday} `
                            }
                            getExportData={getHistoryData}
                            getMenu={`tab-b2b-transaction`}
                            getTanggalMulai={startDate}
                            getTanggalAkhir={endDate}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">ID Transaksi</th>
                                            <th className="border-0 text-center">Status Transaksi</th>
                                            <th className="border-0 text-center">Nama Organisasi</th>
                                            <th className="border-0 text-center">Nama Responder</th>
                                            <th className="border-0 text-center">Nama Paket</th>
                                            <th className="border-0 text-center">Kategori Pembelian</th>
                                            <th className="border-0 text-center">Jenis Pembelian</th>
                                            <th className="border-0 text-center">Jumlah</th>
                                            <th className="border-0 text-center">Tanggal Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getHistoryData?.length > 0 ? (
                                            getHistoryData?.map((td, index) => (
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
                        />
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};
