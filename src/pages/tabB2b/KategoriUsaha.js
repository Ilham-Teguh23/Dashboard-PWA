import { Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [getKategoriUsahaData, setKategoriUsahaData] = useState([])
    const [getAllTransactionData, setAllTransactionData] = useState();
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

    const handleDelete = async (id_bisnis_category) => {
        const result = await Swal.fire({
            title: 'Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_TAB_ORGANISASI}/kategori/${id_bisnis_category}/delete`);
                fetchData();
                Swal.fire(
                    'Berhasil!',
                    'Data telah berhasil dihapus.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting data:', error);
                Swal.fire(
                    'Gagal!',
                    'Terjadi kesalahan saat menghapus data.',
                    'error'
                );
            }
        }
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

    const TableRow = (props) => {
        const {
            nama,
            code,
            nilai_x,
            id_bisnis_category,
            num
        } = props;

        return (
            <tr>
                <td className="text-center">{num}</td>
                <td className="text-center">{code}</td>
                <td className="text-center">{nama}</td>
                <td className="text-center">{nilai_x}</td>
                <td className="text-center">
                    <Link to={`/tab/kategori-usaha/${id_bisnis_category}/detail`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>

                    <Button style={{ marginLeft: '5px' }} variant="danger" size="sm" onClick={() => handleDelete(id_bisnis_category)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </td>
            </tr>
        )
    }

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setKategoriUsahaData([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.nama && item.nama.toLowerCase().includes(searchTerm))
            );
        });

        setKategoriUsahaData(filteredData);
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/paket/kategori`);
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

            if (selectedFilter === 1) {
                filteredData = filteredData.filter((item) => !item.nama.includes("Test") && !item.nama.includes("test"));
            } else if (selectedFilter === 2) {
                filteredData = filteredData.filter((item) => item.nama.includes("Test") || item.nama.includes("test"));
            }

            setOriginalData(filteredData)
            setKategoriUsahaData(filteredData);
        } catch (error) {
            console.error("Fetching data failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFilter]);

    return (
        <>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={5}>
                                <Form>
                                    <Form.Group id="topbarSearch">
                                        <Form.Label>Cari Kategori</Form.Label>
                                        <InputGroup className="input-group-merge search-bar">
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cari Kategori"
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
                        </Row>
                        <TnosDataTable
                            getExportData={getKategoriUsahaData}
                            getMenu={`tab-kategori-usaha`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Kode</th>
                                            <th className="border-0 text-center">Nama</th>
                                            <th className="border-0 text-center">Faktor Resiko</th>
                                            <th className="border-0 text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getKategoriUsahaData?.length > 0 ? (
                                            getKategoriUsahaData?.map((td, index) => (
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