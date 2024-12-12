import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faInfoCircle,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import ReadableDateTime from "../../components/ReadableDateTime";

export default () => {
  const [getTransactionDetailData, setTransactionDetailData] = useState();

  // ExcelFile
  // const ExcelFile = ReactExport.ExcelFile;
  // const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  // const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {
    setTransactionDetailData(
      JSON.parse(localStorage.getItem("pwaB2bTransactionDataById"))
    );
  }, []);

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
              <Row>
                <Col md={12}>
                  <h6>
                    Detail Transaksi &nbsp;
                    <Link
                      to={`/pwa-b2b/order/export-pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge
                        bg="primary"
                        className="badge-md"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          localStorage.setItem(
                            "pwaB2bExportOrderDataById",
                            JSON.stringify(getTransactionDetailData)
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faPrint} /> Export PDF
                      </Badge>
                    </Link>
                  </h6>
                  <Row className="mt-3">
                    <Col md={3}>
                      <small style={{ color: "#7376A1" }}>External ID</small>
                      <p style={{ fontWeight: "bold" }}>
                        {!getTransactionDetailData?.external_id ? (
                          <>
                            Menunggu Pembayaran &nbsp;
                            <OverlayTrigger
                              trigger={["hover", "focus"]}
                              overlay={
                                <Tooltip>
                                  Id transaksi akan muncul setelah pembayaran
                                  selesai
                                </Tooltip>
                              }
                            >
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ cursor: "pointer" }}
                              />
                            </OverlayTrigger>
                          </>
                        ) : (
                          getTransactionDetailData?.external_id
                        )}
                      </p>
                    </Col>
                    <Col md={3}>
                      {" "}
                      <small style={{ color: "#7376A1" }}>No. Invoice</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getTransactionDetailData?.id}
                        &nbsp;
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          overlay={<Tooltip>Lihat</Tooltip>}
                        >
                          <Link
                            to={`/pwa-b2b/order/detail`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            <FontAwesomeIcon
                              onClick={() => {
                                localStorage.setItem(
                                  "pwaB2bOrderDataById",
                                  JSON.stringify(getTransactionDetailData)
                                );
                              }}
                              icon={faExternalLinkAlt}
                            />
                          </Link>
                        </OverlayTrigger>
                      </p>
                    </Col>
                    <Col md={3}>
                      <small style={{ color: "#7376A1" }}>
                        Waktu Transaksi
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {!getTransactionDetailData?.paid_at ? (
                          <>
                            Menunggu Pembayaran &nbsp;
                            <OverlayTrigger
                              trigger={["hover", "focus"]}
                              overlay={
                                <Tooltip>
                                  Waktu transaksi akan muncul setelah pembayaran
                                  selesai
                                </Tooltip>
                              }
                            >
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ cursor: "pointer" }}
                              />
                            </OverlayTrigger>
                          </>
                        ) : (
                          ReadableDateTime(
                            getTransactionDetailData?.paid_at,
                            "shortMonth"
                          )
                        )}
                      </p>
                    </Col>
                    <Col md={3}>
                      <small style={{ color: "#7376A1" }}>
                        Status Transaksi
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {getTransactionDetailData?.payment_status_datas.name}
                        &nbsp;
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          overlay={
                            <Tooltip>
                              {
                                getTransactionDetailData?.payment_status_datas
                                  .desc
                              }
                            </Tooltip>
                          }
                        >
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
