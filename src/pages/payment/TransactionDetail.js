import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";

export default () => {
  const [getTransactionData, setTransactionData] = useState();
  const [getOrderData, setOrderData] = useState(true);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("id-ID", { month: "short" });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactionData(
          data.data.filter(
            (item) => item.order_id === localStorage.getItem("orderId")
          )[0]
        );

        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((orderDataApi) => {
            let orderData =
              JSON.stringify(
                orderDataApi.data.filter(
                  (itemOrder) =>
                    itemOrder.sid === localStorage.getItem("orderId")
                )
              ) !== "[]"
                ? orderDataApi.data.filter(
                  (itemOrder) =>
                    itemOrder.sid === localStorage.getItem("orderId")
                )[0]
                : false;
            setOrderData(orderData);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const humanizeText = (str) => {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatTransactionTime = (transactionTime) => {
    const date = new Date(transactionTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} - ${day} / ${month} / ${year}`;
  };

  return (
    <>
      <Row>
        <Preloader show={!getTransactionData ? true : false} />
        <Row className="mt-4"></Row>
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{
            className: "breadcrumb-dark breadcrumb-transparent",
          }}
        >
          <Breadcrumb.Item href="/payment/transaction">
            Daftar Transaksi
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Detail Transaksi</Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Detail Transaksi</h6>
                  <small style={{ color: "#7376A1" }}>Id Transaksi</small>
                  <p style={{ fontWeight: "bold" }}>
                    {getTransactionData?.transaction_id}
                  </p>
                  <small style={{ color: "#7376A1" }}>Id Pemesanan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {getTransactionData?.order_id}
                    &nbsp;
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      overlay={<Tooltip>Lihat</Tooltip>}
                    >
                      <Link
                        to={`/order/on-progress/detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        <FontAwesomeIcon
                          onClick={() => {
                            localStorage.setItem(
                              "orderIdMaster",
                              getOrderData.id
                            );
                          }}
                          icon={faExternalLinkAlt}
                        />
                      </Link>
                    </OverlayTrigger>
                  </p>
                  <Row>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Waktu Transaksi
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {formatTransactionTime(getTransactionData?.transaction_time)}
                        {/* {`${getTransactionData?.transaction_time
                          .split(" ")[0]
                          .split("-")
                          .reverse()[0]
                          } ${getMonthName(
                            getTransactionData?.transaction_time
                              .split(" ")[0]
                              .split("-")
                              .reverse()[1]
                          )} ${getTransactionData?.transaction_time
                            .split(" ")[0]
                            .split("-")
                            .reverse()[2]
                          }
                        ${getTransactionData?.transaction_time.split(" ")[1]}`} */}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Status Transaksi
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {getTransactionData?.transaction_status &&
                          humanizeText(getTransactionData?.transaction_status)}
                      </p>
                    </Col>
                  </Row>
                  {getOrderData !== false && (
                    <Row>
                      <Col md={6}>
                        <small style={{ color: "#7376A1" }}>
                          Status Pemesanan
                        </small>
                        <p style={{ fontWeight: "bold" }}>
                          {getOrderData.status === 1
                            ? "Menerima Pesanan"
                            : getOrderData.status === 2
                              ? "Dalam Perjalanan"
                              : getOrderData.status === 3
                                ? "Hadir dan Sedang Bertugas"
                                : getOrderData.status === 990
                                  ? "Sedang Berlangsung"
                                  : getOrderData.status === 999
                                    ? "Selesai"
                                    : getOrderData.status === 1001
                                      ? "Dibatalkan"
                                      : ""}
                        </p>
                      </Col>
                      {getOrderData.mdisid ? (
                        <Col md={6}>
                          <small style={{ color: "#7376A1" }}>Kode Promo</small>
                          <p style={{ fontWeight: "bold" }}>
                            {getOrderData.mdisid}
                          </p>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Informasi Pembayaran</h6>
                  <small style={{ color: "#7376A1" }}>Tipe Pembayaran</small>
                  <p style={{ fontWeight: "bold" }}>
                    {getTransactionData?.payment_type &&
                      humanizeText(getTransactionData?.payment_type)}
                  </p>
                  <Row>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Bank</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getTransactionData?.bank
                          ? getTransactionData?.bank
                          : "-"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Jumlah Pembayaran
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {"IDR " +
                          parseInt(
                            getTransactionData?.gross_amount
                          ).toLocaleString("id-ID", {})}
                      </p>
                    </Col>
                  </Row>
                  {getOrderData !== false && (
                    <Row>
                      <Col md={6}>
                        <small style={{ color: "#7376A1" }}>
                          Harga Invoice
                        </small>
                        <p style={{ fontWeight: "bold" }}>
                          {"IDR " +
                            parseInt(getOrderData.price).toLocaleString(
                              "id-ID",
                              {}
                            )}
                        </p>
                      </Col>
                      {getOrderData.status === 1001 && (
                        <Col md={6}>
                          <small style={{ color: "#7376A1" }}>
                            Biaya Pembatalan
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {"IDR " +
                              parseInt(
                                getOrderData.alasan_batal === "assLbl55"
                                  ? (10 / 100) * getOrderData.price
                                  : 0
                              ).toLocaleString("id-ID", {})}
                          </p>
                        </Col>
                      )}
                    </Row>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
