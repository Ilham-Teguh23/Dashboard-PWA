import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "@themesberg/react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

import Preloader from "../../components/Preloader";

export default () => {
  const [getLawyerData, setLawyerData] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
      method: "POST",
      body: JSON.stringify({ category: "2" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLawyerData(data.data);
      });
  }, []);

  return (
    <main>
      <Preloader show={!getLawyerData ? true : false} />
      <section className="d-flex align-items-center">
        <Container>
          <Row className="text-center">
            {getLawyerData?.map((ld, index) => (
              <Col className={index % 21 === 0 && index > 6 ? "mb-5" : ""}>
                <QRCodeCanvas
                  value={`${process.env.REACT_APP_BARCODES_URL}/${ld.code}`}
                />
                <h6>
                  <p style={{ fontSize: "5px" }}>{ld.fullname}</p>
                  <p style={{ fontSize: "10px", marginTop: "-20px" }}>
                    {ld.code}
                  </p>
                </h6>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  );
};
