import { Button, Card, Col, Form, InputGroup, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { TnosDataTable } from "../../components/TnosDataTable";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const [originalData, setOriginalData] = useState([]);
    const [getAdminUser, setAdminUser] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [getGroupData, setGroupData] = useState([])
    const [getMessageEmptyData, setMessageEmptyData] = useState("Belum ada transaksi pada hari ini");

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

    const fetchData = async () => {
        try {

            fetch(`${process.env.REACT_APP_API_URL}/admin-user`)
                .then((res) => res.json())
                .then((resultdata) => {

                    console.log("Ada");
                    console.log(resultdata);
                    

                    let userdata = resultdata

                    fetch(`${process.env.REACT_APP_API_URL}/admin-group`)
                        .then((resgroup) => resgroup.json())
                        .then((resultgroup) => {

                            // console.log("Admin Group");
                            // console.log(resultgroup);
                            

                            let groupdata = resultgroup
                            setGroupData(resultgroup)
                            
                            let usergroup = [];

                            userdata.forEach((item) => {
                                usergroup.push({
                                    ...item,
                                    group_name: groupdata.filter(
                                        (groupItem) => groupItem.id === item.tnos_admin_group_id
                                    )[0].name,
                                });
                            });

                            let filteredData = usergroup

                            if (selectedFilter === 1) {
                                filteredData = filteredData.filter(item => !item.fullname.includes("Coba Lagi") && !item.fullname.includes("Test"));
                            } else if (selectedFilter === 2) {
                                filteredData = filteredData.filter(item => item.fullname.includes("Coba Lagi") || item.fullname.includes("Test"));
                            }
                            
                            setOriginalData(filteredData)
                            setAdminUser(filteredData)
                        })
                })

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        fetchData()

    }, [selectedFilter])

    const TableRow = (props) => {
        const { id, fullname, username, tnos_admin_group_id, num, group_name } = props

        return (
            <tr>
                <td className="text-center">{num}.</td>
                <td className="text-center">
                    <Link to={`/tnos-admin/user/update/${id}`}>
                        <Button variant="warning" size="sm" className="text-white">
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </Link>
                </td>
                <td>{fullname}</td>
                <td>{username}</td>
                <td className="text-center">{group_name}</td>
            </tr>
        )
    }

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value.trim().toLowerCase();

        if (!searchTerm) {
            setAdminUser([...originalData]);
            return;
        }

        const filteredData = originalData.filter(item => {
            return (
                (item.fullname && item.fullname.toLowerCase().includes(searchTerm))
            );
        });

        setAdminUser(filteredData);
    };

    return (
        <>
            <Card border="light" className="shadow-sm mt-2">
                <Card.Body>
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
                        <Col>
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
                        getExportData={getAdminUser}
                        getMenu={`tnos-admin/user`}
                        data={
                            <>
                                <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="border-0 text-center">No.</th>
                                        <th className="border-0 text-center">Detail</th>
                                        <th className="border-0">Nama Lengkap</th>
                                        <th className="border-0">Username</th>
                                        <th className="border-0 text-center">Grup</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getAdminUser?.length > 0 ? (
                                        getAdminUser?.map((td, index) => (
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
        </>
    )

}