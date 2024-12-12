import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Card, Badge } from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import ConvertString from "../../components/ConvertString";

export default () => {
  const [getTransactionDetailData, setTransactionDetailData] = useState();

  useEffect(() => {
    setTransactionDetailData(
      JSON.parse(localStorage.getItem("pwaB2bExportTransactionDataById"))
    );
  }, []);

  const ifNotNull = (field, type = "normal") => {
    let updateField = field;

    if (type === "curr") {
      updateField = `IDR ${parseInt(field).toLocaleString("id-ID", {})}`;
    }

    return !field ? "-" : updateField;
  };

  const print = () => {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("media", "print");
    link.setAttribute("href", "");
    document.head.appendChild(link);
    window.print();
  };

  return (
    <>
      <Row>
        <Preloader show={!getTransactionDetailData ? true : false} />
        <Row className="mt-4"></Row>
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{
            className: "breadcrumb-dark breadcrumb-transparent",
          }}
        >
          <Breadcrumb.Item href="/pwa-b2b/transaction">
            Daftar Transaksi
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Detail Transaksi</Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h6 className="mb-4">
                {ifNotNull(getTransactionDetailData?.service_datas.name)} &nbsp;
                <Badge
                  bg="primary"
                  className="badge-md"
                  style={{ cursor: "pointer" }}
                  onClick={print}
                >
                  <FontAwesomeIcon
                    icon={faPrint}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              </h6>
              <small style={{ color: "#7376A1" }}>Nama Badan Hukum</small>
              <p style={{ fontWeight: "bold" }}>
                {ifNotNull(getTransactionDetailData?.name_badan_hukum)}
              </p>
              {getTransactionDetailData?.susunan_direksi &&
                getTransactionDetailData?.susunan_direksi
                  .split("\r\n")
                  .map((item) => {
                    return (
                      <>
                        <small style={{ color: "#7376A1" }}>
                          {ConvertString(item.split(":")[0], "capew")}
                        </small>
                        <p style={{ fontWeight: "bold" }}>
                          {ifNotNull(item.split(":")[1])}
                        </p>
                      </>
                    );
                  })}
              <small style={{ color: "#7376A1" }}>Alamat</small>
              <p style={{ fontWeight: "bold" }}>
                {ifNotNull(getTransactionDetailData?.alamat_badan_hukum)}
              </p>
              <small style={{ color: "#7376A1" }}>Bidang Usaha</small>
              <p style={{ fontWeight: "bold" }}>
                {ifNotNull(getTransactionDetailData?.bidang_usaha)}
              </p>
              <small style={{ color: "#7376A1" }}>Dokumen</small>
              <p style={{ fontWeight: "bold" }}>
                {getTransactionDetailData?.file_document
                  ? JSON.parse(getTransactionDetailData?.file_document).map(
                      (item) => {
                        return (
                          <>
                            <a
                              href={item.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.image_url}
                            </a>{" "}
                            <br />
                          </>
                        );
                      }
                    )
                  : "-"}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
