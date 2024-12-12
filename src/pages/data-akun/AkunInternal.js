import { Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faThList } from "@fortawesome/free-solid-svg-icons";
import Switch from "@themesberg/react-bootstrap/lib/esm/Switch";
import axios from "axios";
import Preloader from "../../components/Preloader";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [getAkunExternal, setAkunExternal] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState(
        "Belum ada transaksi pada hari ini"
    )
    const [getLoadingData, setLoadingData] = useState(false);

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

    const [getStatusAkun] = useState([
        {
            key: "status_0",
            value: 0,
            defaultValue: "Semua Status",
        },
        {
            key: "status_1",
            value: 1,
            defaultValue: "Aktif",
        },
        {
            key: "status_2",
            value: 2,
            defaultValue: "Tidak Aktif",
        }
    ]);

    const searchInputRef = useRef(null);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();
    
        let filteredData;
    
        if (!searchTerm) {
            filteredData = originalData
        } else {
            filteredData = originalData.filter(item => {
                return (
                    (item.nama && item.nama.toLowerCase().includes(searchTerm)) ||
                    (item.username && item.username.toLowerCase().includes(searchTerm)) ||
                    (item.institution_id && item.institution_id.toLowerCase().includes(searchTerm))
                );
            });
        }
    
        setAkunExternal(
            filteredData.map((account) => ({
                ...account,
                checked: account.account_status === "active",
            }))
        );
    };
    
    const TableRow = (props) => {
        const {
            institution_id,
            nama,
            email,
            username,
            phone_number,
            account_status,
            member_account_code,
            bisnis_category,
            checked,
            num
        } = props;

        const handleChange = (institution_id, currentChecked) => {
            const newStatus = !currentChecked ? "active" : "inactive"; // Toggle status
            axios
                .put(
                    `${process.env.REACT_APP_API_TAB_ORGANISASI}/account/admin/${institution_id}/put/account_status`,
                    {
                        account_status: newStatus,
                    }
                )
                .then((response) => {
                    console.log(response);
                    if (response.data.statusCode === 200) {
                        alert(response.data.message);
                        setAkunExternal((prevData) =>
                            prevData.map((item) =>
                                item.institution_id === institution_id
                                    ? { ...item, checked: !currentChecked }
                                    : item
                            )
                        );


                    } else {
                        alert(response.data.message);
                    }
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                });
        };

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">
                    <Link to={`/data-akun/internal/${member_account_code}`}>
                        <Button variant="primary" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faThList} />
                        </Button>
                    </Link>
                </td>
                <td className="text-center">
                    {bisnis_category ? bisnis_category : "-"}
                </td>
                <td>{nama ? nama : "-"}</td>
                <td>{email ? email : "-"}</td>
                <td>{username ? username : "-"}</td>
                <td className="text-center">
                    {phone_number ? phone_number : "-"}
                </td>
                <td className="text-center text-uppercase">
                    <Switch
                        checked={checked}
                        onChange={() => handleChange(institution_id, checked)}
                        height={20}
                        width={48}
                        className="react-switch"
                        id={`switch-${institution_id}`}
                    />{" "}
                    {account_status}
                </td>
            </tr>
        );
    }

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/admin/all`)
            .then((res) => res.json())
            .then((data) => {
                const accounts = data.data;

                if (Array.isArray(accounts)) {
                    let filteredData = accounts.filter(
                        (item) => item.account_category === "INTERNAL"
                    );

                    if (selectedStatus === 0) {
                        filteredData = filteredData;
                    } else if (selectedStatus === 1) {
                        filteredData = filteredData.filter(item => item.account_status === "active");
                    } else if (selectedStatus === 2) {
                        filteredData = filteredData.filter(item => item.account_status === "inactive");
                    }

                    if (selectedFilter === 1) {
                        filteredData = filteredData.filter(item => item.nama != null && !item.nama.includes("Test"))
                    } else if (selectedFilter === 2) {
                        filteredData = filteredData.filter(item => !item.nama || item.nama.includes("Test"))
                    }

                    setOriginalData(filteredData);

                    setLoadingData(true)
                    setAkunExternal(
                        filteredData.map((account) => ({
                            ...account,
                            checked: account.account_status === "active",
                        }))
                    );
                } else {
                    console.log("empty");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {

        fetchData()

    }, [selectedFilter, selectedStatus]);

    return (
        <>
            <Preloader show={!getLoadingData ? true : false} />
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form method="POST">
                            <Row className="mb-3">
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
                                <Col md={4}>
                                    <Form.Group id="transaction_status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            name="transaction_status"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                        >
                                            {getStatusAkun?.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
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
                        </Form>
                        <TnosDataTable
                            getExportData={getAkunExternal}
                            getMenu={`akun-internal`}
                            data={
                                <>
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="border-0 text-center">No.</th>
                                            <th className="border-0 text-center">Detail</th>
                                            <th className="border-0 text-center">Kategori</th>
                                            <th className="border-0">Nama</th>
                                            <th className="border-0">Email</th>
                                            <th className="border-0">Username</th>
                                            <th className="border-0 text-center">Nomor HP</th>
                                            <th className="border-0 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getAkunExternal?.length > 0 ? (
                                            getAkunExternal?.map((td, index) => (
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