import { Card, Col, Row } from "@themesberg/react-bootstrap"
import React from "react"
import { Line } from "@ant-design/plots"

export default () => {

    const data = [
        { bulan: "Januari", penjualan: 38 },
        { bulan: "Februari", penjualan: 52 },
        { bulan: "Maret", penjualan: 61 },
        { bulan: "April", penjualan: 145 },
        { bulan: "Mei", penjualan: 48 },
        { bulan: "Juni", penjualan: 38 },
    ];

    const config = {
        data,
        xField: "bulan",
        yField: "penjualan",
        smooth: true, // Grafik garis halus
    };

    return (
        <Row>
            <Col xl={12} className="mt-2">
                <Card border="light">
                    <Card.Body>
                        <Line {...config} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )

}