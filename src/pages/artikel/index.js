import { Button, Card, Col, Form, InputGroup, Row, Spinner } from "@themesberg/react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { faInfoCircle, faPencilAlt, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { deleteArticle } from "../../redux/apis/articleApi"
import { getArticlesAction } from "../../redux/slices/articleSlice"
import { useDispatch } from "react-redux"
import ReadableDateTime from "../../components/ReadableDateTime"
import moment from "moment"
import Preloader from "../../components/Preloader"
import Loading from "../../components/Loading"

export default () => {

    const dispatch = useDispatch();
    const [originalData, setOriginalData] = useState([]);
    const [getArtikelData, setArtikelData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(0)
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada artikel terbaru pada hari ini"
    )

    const [getTotal, setTotal] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {

        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_API_TNOSWORLD_URL}/article/konten/all/1/265/Y`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let extractedData = Array.isArray(data.data.konten) ? data.data.konten : Array.isArray(data) ? data : [];

        let filteredData = extractedData;

        if (selectedFilter === 1) {
            filteredData = filteredData.filter(item => item.title != null && !item.title.includes("Tester") && !item.title.includes("Test"));
        } else if (selectedFilter === 2) {
            filteredData = filteredData.filter(item => !item.title || item.title.includes("Tester") || item.title.includes("Test"));
        }

        if (selectedStatus === 0) {
            filteredData = filteredData
        } else if (selectedStatus === 1) {
            filteredData = filteredData.filter(item => item.status === "Y");
        } else if (selectedStatus === 2) {
            filteredData = filteredData.filter(item => item.status === "N");
        } else {
            filteredData = filteredData
        }

        if (startDate && endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = moment(item.created_at).format("YYYY-MM-DD");
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return moment(itemDate).isBetween(start, end, null, '[]');
            });
        }

        filteredData.sort((a, b) => b.timestamp - a.timestamp);

        setTotal(filteredData.length)
        setOriginalData(filteredData)
        setArtikelData(filteredData)
        setIsLoading(false)
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteArticle({ article_id: id });
            if (response.status === 200) {
                dispatch(getArticlesAction({ page: 1, view: 265, status: "publish" }));
            } else {
            }
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    const [selectedFilter, setSelectedFilter] = useState(1);
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

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setArtikelData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.title && item.title.toLowerCase().includes(searchTerm))
            );
        });

        setArtikelData(filteredData);
    };

    const [getStatusArtikel] = useState([
        {
            key: "status_artikel_0",
            value: 0,
            defaultValue: "Semua Status",
            us: "All Status",
            desc: "Menampilkan Semua Status Artikel",
        },
        {
            key: "status_artikel_1",
            value: 1,
            defaultValue: "Publish",
            us: "PUBLISH",
            desc: "Artikel Publish",
        },
        {
            key: "status_artikel_2",
            value: 2,
            defaultValue: "Unpublish",
            us: "UNPUBLISH",
            desc: "Artikel Unpublish"
        },
        {
            key: "status_artikel_3",
            value: 3,
            defaultValue: "Draft",
            us: "DRAFT",
            desc: "Artikel Draft"
        },
    ]);

    const today = moment().format("YYYY-MM-DD")
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)

    useEffect(() => {
        fetchData()
    }, [])

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

    const TableRow = ({ num, id, title, description, writer_name, category, status, created_at }) => {
        return (
            <tr>
                <td className="text-center">{num}</td>
                <td className="text-center">
                    <Link to={`/artikel/detail/${id}`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>
                    </Link>
                    &nbsp;
                    <Link to={`/artikel/update/${id}`}>
                        <Button variant="warning" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>
                    </Link>
                    &nbsp;
                    <Button
                        variant="danger"
                        size="sm"
                        className="text-white"
                        onClick={() => handleDelete(id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </td>
                <td className="text-center">{ReadableDateTime(created_at)}</td>
                <td>{title}</td>
                <td className="text-center">
                    {description.length > 50
                        ? `${description.substring(0, 20)}...`
                        : description}
                </td>
                <td className="text-center">{category}</td>
                <td>{writer_name}</td>
                <td className="text-center">
                    {status === "Y" ? "Publish" : status === "N" ? "Unpublish" : "Draft"}
                </td>
            </tr>
        )
    }

    return (
        <>
            <Preloader show={getTotal === null ? true : false} />

            {isLoading && <Loading />}

            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Artikel</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Artikel"
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
                                <Form.Group id="status_artikel">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status_artikel"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                    >
                                        {getStatusArtikel?.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
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
                                        <Form.Label>Tanggal</Form.Label>
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
                            getExportData={getArtikelData}
                            getMenu={`artikel-data`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0 text-center">Tanggal Dibuat</th>
                                            <th className="border-0">Judul Artikel</th>
                                            <th className="border-0">DESKRIPSI</th>
                                            <th className="border-0 text-center">KATEGORI </th>
                                            <th className="border-0">PENULIS </th>
                                            <th className="border-0 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getArtikelData?.length > 0 ? (
                                            getArtikelData?.map((td, index) => (
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
                            } />
                    </Card.Body>
                </Card>
            </Col>
        </>
    )

}