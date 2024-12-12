import React, { useState, useEffect, useRef } from "react";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
    Form,
    InputGroup,
    Button,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { useLocation } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [getDetailPartner, setDetailPartner] = useState();
    const location = useLocation()
    const institution_id = location.pathname.split("/")[3];
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )

    const searchInputRef = useRef(null);

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

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setDetailPartner([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                (item.unique_responder_id && item.unique_responder_id.toLowerCase().includes(searchTerm))
            );
        });

        setDetailPartner(filteredData);
    };

    useEffect(() => {
        const fetchDetailPartner = async () => {

            try {
                const response = await fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/partner/${institution_id}/responder`, {
                    method: "POST"
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

                let filteredData = extractedData;

                if (selectedFilter === 1) {
                    filteredData = filteredData.filter(item => !item.name.includes("Test") && !item.name.includes("test") && !item.name.includes("Testing"));
                } else if (selectedFilter === 2) {
                    filteredData = filteredData.filter(item => item.name.includes("Test") || item.name.includes("test") || item.name.includes("Testing"));
                }

                setOriginalData(filteredData);
                setDetailPartner(filteredData);
            } catch (error) {
                console.error("Fetching data failed:", error);
            }
        }

        fetchDetailPartner();
    }, [selectedFilter]);

    const TableRow = (props) => {
        const {
            num,
            email,
            name,
            phone_number,
            unique_responder_id,
            register_at
        } = props;

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td>{name}</td>
                <td className="text-center">{phone_number}</td>
                <td>{email}</td>
                <td className="text-center">{unique_responder_id}</td>
                <td className="text-center">{register_at}</td>
            </tr>
        );
    }

    return (
        <>
            <Row>
                <Preloader show={!getDetailPartner ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/data-akun/partner">
                        Data Akun
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Detail Akun Partner</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light">
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={5}>
                                    <Form>
                                        <Form.Group id="topbarSearch">
                                            <Form.Label>Cari Akun Partner</Form.Label>
                                            <InputGroup className="input-group-merge search-bar">
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Cari Akun Partner"
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

                                <Col md={3}>
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
                                getExportData={getDetailPartner}
                                getMenu={`detail-akun-partner`}
                                data={
                                    <>
                                        <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th className="border-0 text-center">No.</th>
                                                <th className="border-0">Nama</th>
                                                <th className="border-0 text-center">Nomor HP</th>
                                                <th className="border-0">Email</th>
                                                <th className="border-0 text-center">Kode Referensi</th>
                                                <th className="border-0 text-center">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getDetailPartner?.length > 0 ? (
                                                getDetailPartner?.map((td, index) => (
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
            </Row>
        </>
    );
};
