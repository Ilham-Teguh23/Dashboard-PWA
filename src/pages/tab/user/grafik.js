import { Card, Col, Row, Form, Button, ToggleButtonGroup, ToggleButton } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";

export default () => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [activeFilter, setActiveFilter] = useState("month")
    const [filterBy, setFilterBy] = useState(0);

    const months = Array.from({ length: 12 }, (_, index) => {
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return { value: String(index + 1).padStart(2, "0"), label: monthNames[index] };
    });

    const [getFilterBy] = useState([
        {
            key: "filter_0",
            value: 0,
            defaultValue: "Bulan",
        },
        {
            key: "filter_1",
            value: 1,
            defaultValue: "Tahun",
        },
    ]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_PORTAL_API_URL}/member/list`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refapp: "tabuserandroid" }),
                }
            );

            const result = await response.json();

            const groupedData = result?.data
                ?.filter((item) => {
                    const name = item.mmbr_name.toLowerCase();
                    return !(
                        name.includes("user") ||
                        name.includes("test") ||
                        name.includes("xxx alfi xxx") ||
                        name.includes("xxxalifxxx")
                    );
                })
                .reduce((acc, item) => {
                    const date = new Date(item.mmbr_date_insert);
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const key = `${String(month).padStart(2, "0")} ${year}`

                    if (acc[key]) {
                        acc[key].User += 1;
                    } else {
                        acc[key] = { bulan: key, month, year, User: 1, date }
                    }

                    return acc
                }, {});

            const transformedData = Object.values(groupedData).sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );

            setData(transformedData);
            setFilteredData(transformedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilter = () => {
        const filtered = data.filter((item) => {
            const matchMonth = filterMonth ? String(item.month).padStart(2, "0") === filterMonth : true;
            const matchYear = filterYear ? item.year.toString() === filterYear : true;
            return activeFilter === "month" ? matchMonth : matchYear;
        });
        setFilteredData(filtered);
    };

    const config = {
        data: filteredData,
        xField: "bulan",
        yField: "User",
        smooth: true,
    };

    return (
        <Row>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label style={{ marginRight: '10px' }}>Filter Berdasarkan : </Form.Label>
                                        &nbsp;&nbsp;
                                        <Form.Select
                                            name="tab_user"
                                            value={filterBy}
                                            onChange={(e) => setFilterBy(parseInt(e.target.value))}
                                        >
                                            {getFilterBy.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.defaultValue}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {activeFilter === "month" && (
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Bulan</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={filterMonth}
                                                onChange={(e) => setFilterMonth(e.target.value)}
                                            >
                                                <option value="">Semua Bulan</option>
                                                {months.map((month) => (
                                                    <option key={month.value} value={month.value}>
                                                        {month.label}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                )}

                                {activeFilter === "year" && (
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tahun</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={filterYear}
                                                onChange={(e) => setFilterYear(e.target.value)}
                                            >
                                                <option value="">Semua Tahun</option>
                                                {Array.from(new Set(data.map(item => item.year)))
                                                    .sort()
                                                    .map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                )}

                                <Col className="d-flex align-items-center mt-4" md={3}>
                                    <Button variant="primary" onClick={handleFilter}>
                                        Terapkan Filter
                                    </Button>
                                </Col>

                            </Row>
                        </Form>
                        <hr/>
                        <Line {...config} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};
