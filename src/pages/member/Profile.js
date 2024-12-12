import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";
import {
  faCheckCircle,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Form,
  Tooltip,
  OverlayTrigger,
  Breadcrumb,
  Tab,
  Nav,
  InputGroup,
  Accordion,
  Button,
  Badge,
} from "@themesberg/react-bootstrap";
import { useParams } from "react-router-dom";
import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import { Link } from "react-router-dom";
import Preloader from "../../components/Preloader";
import ReadableDateTime from "../../components/ReadableDateTime";

export default () => {
  moment.locale("id");

  const { id } = useParams();

  const [getMemberData, setMemberData] = useState();

  // Riwayat Pemesanan
  const [getOrderStartDate, setOrderStartDate] = useState();
  const [getOrderEndDate, setOrderEndDate] = useState();
  const [getAllOrderData, setAllOrderData] = useState();
  const [getOrderData, setOrderData] = useState();

  // Riwayat Pengembalian
  const [getRefundStartDate, setRefundStartDate] = useState();
  const [getRefundEndDate, setRefundEndDate] = useState();
  const [getAllRefundData, setAllRefundData] = useState();
  const [getRefundData, setRefundData] = useState();
  const [getRefundTransactionData, setRefundTransactionData] = useState([]);
  const [getOrderTransactionData, setOrderTransactionData] = useState([]);

  const getFormatedInputDate = (date) => {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let yyyy = date.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const getDataBetweenDate = (datas, dataType, startDate, endDate) => {
    let returnData =
      dataType === "order"
        ? JSON.parse(datas).filter(
            (item) =>
              new Date(
                item.date_insert.split("+")[0].split("T")[0] +
                  " " +
                  item.date_insert.split("+")[0].split("T")[1]
              ).getTime() >= new Date(startDate).getTime() &&
              new Date(
                item.date_insert.split("+")[0].split("T")[0] +
                  " " +
                  item.date_insert.split("+")[0].split("T")[1]
              ).getTime() <= new Date(endDate).getTime()
          )
        : JSON.parse(datas).filter(
            (item) =>
              new Date(
                item.create_at.split("+")[0].split("T")[0] +
                  " " +
                  item.create_at.split("+")[0].split("T")[1]
              ).getTime() >= new Date(startDate).getTime() &&
              new Date(
                item.create_at.split("+")[0].split("T")[0] +
                  " " +
                  item.create_at.split("+")[0].split("T")[1]
              ).getTime() <= new Date(endDate).getTime()
          );

    return returnData;
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("id-ID", { month: "short" });
  };

  useEffect(() => {
    const now = new Date();
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
      method: "POST",
      body: JSON.stringify({ category: "2" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {

        console.log("Filter");
        console.log("Ada");
        
        console.log(data);
        
        let datas = data.data.filter((item) => item.mmbr_code === id)[0];
        setMemberData(datas);

        // Filter Date
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Riwayat Pemesanan
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setOrderStartDate(getFormatedInputDate(firstDay));
            setOrderEndDate(getFormatedInputDate(lastDay));

            let datas = data.data
              .filter((orderItem) => orderItem.membercode === id)
              .filter(
                (itemStatus) =>
                  itemStatus.status === 1 ||
                  itemStatus.status === 2 ||
                  itemStatus.status === 3 ||
                  itemStatus.status === 999 ||
                  itemStatus.status === 1001
              );
            setAllOrderData(datas);

            const monthOrder = getDataBetweenDate(
              JSON.stringify(datas),
              "order",
              getFormatedInputDate(firstDay) + "T00:00:00",
              getFormatedInputDate(lastDay) + "T23:59:59"
            );
            setOrderData(monthOrder);
          })
          .catch((err) => {
            console.log(err);
          });

        // Riwayat Pengembalian
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/refund/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setRefundStartDate(getFormatedInputDate(firstDay));
            setRefundEndDate(getFormatedInputDate(lastDay));

            let datas = data.data
              .filter((orderItem) => orderItem.create_by === id)
              .filter(
                (itemStatus) =>
                  itemStatus.status === "W" ||
                  itemStatus.status === "P" ||
                  itemStatus.status === "Y"
              );
            setAllRefundData(datas);

            const monthOrder = getDataBetweenDate(
              JSON.stringify(datas),
              "refund",
              getFormatedInputDate(firstDay) + "T00:00:00",
              getFormatedInputDate(lastDay) + "T23:59:59"
            );
            setRefundData(monthOrder);

            // Informasi Transaksi
            fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/list`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setRefundTransactionData(data.data);
              })
              .catch((err) => {
                console.log(err);
              });

            // Informasi Pemesanan
            fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setOrderTransactionData(data.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }, [id]);

  const updateHistoryByDate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let historyType = formData.get("history_type");
    let startDateTime =
      historyType === "order"
        ? formData.get("start_date_time_order")
        : formData.get("start_date_time_refund");
    let endDateTime =
      historyType === "order"
        ? formData.get("end_date_time_order")
        : formData.get("end_date_time_refund");

    let allData = historyType === "order" ? getAllOrderData : getAllRefundData;
    let dataType = historyType === "order" ? "order" : "refund";
    let historyData = getDataBetweenDate(
      JSON.stringify(allData),
      dataType,
      startDateTime + "T00:00:00",
      endDateTime + "T23:59:59"
    );

    historyType === "order"
      ? setOrderData(historyData)
      : setRefundData(historyData);
  };

  const humanizeText = (str) => {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  return (
    <>
      <Preloader show={!getMemberData ? true : false} />
      <Row className="mt-4">
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{
            className: "breadcrumb-dark breadcrumb-transparent",
          }}
        >
          <Breadcrumb.Item href="/partner/lawyer">Pengguna</Breadcrumb.Item>
          <Breadcrumb.Item active>Profil</Breadcrumb.Item>
        </Breadcrumb>
        <Tab.Container defaultActiveKey="transaction_history">
          <Row>
            <Col lg={12}>
              <Nav className="nav-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
                    Profil
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="transaction_history"
                    className="mb-sm-3 mb-md-0"
                  >
                    Riwayat Transaksi
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col lg={12}>
              <Tab.Content>
                <Tab.Pane eventKey="profile" className="py-4">
                  <Row>
                    <Col xs={12} xl={3}>
                      <Row>
                        <Col xs={12}>
                          <Card border="light" className="text-center p-0 mb-4">
                            <Card.Body className="pb-5">
                              <Card.Img
                                src={Profile1}
                                alt="Neil Portrait"
                                className="user-avatar large-avatar rounded-circle mx-auto mb-4"
                              />
                              <Card.Title>
                                {getMemberData?.mmbr_name}{" "}
                                <OverlayTrigger
                                  trigger={["hover", "focus"]}
                                  overlay={<Tooltip>Pengguna Aktif</Tooltip>}
                                >
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-success"
                                    style={{ cursor: "pointer" }}
                                  />
                                </OverlayTrigger>
                              </Card.Title>
                              <Card.Subtitle className="fw-normal">
                                {getMemberData?.mmbr_email}
                              </Card.Subtitle>
                              <Card.Text className="text-gray mb-4">
                                {getMemberData?.mmbr_phone}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} xl={9}>
                      <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                          <Form>
                            <Row>
                              <Col md={12} className="mb-3">
                                <Form.Group id="dataDiri">
                                  <Form.Label>Data Diri</Form.Label>
                                  <ul>
                                    <li>
                                      <b>Tanggal Mendaftar : </b>
                                      {getMemberData?.mmbr_date_insert ===
                                        null ||
                                      getMemberData?.mmbr_date_insert === "" ||
                                      !getMemberData?.mmbr_date_insert
                                        ? "-"
                                        : ReadableDateTime(
                                            getMemberData?.mmbr_date_insert
                                          )}
                                    </li>
                                    {[
                                      ["Kode Member", "mmbr_code"],
                                      ["Nama", "mmbr_name"],
                                      ["No. HP", "mmbr_phone"],
                                      ["Email", "mmbr_email"],
                                      ["No. KTP", "mmbr_noktp"],
                                      ["Profesi", "mmbr_profession"],
                                      ["Nomor Darurat", "mmbr_phone_emergency"],
                                    ].map(([label, key]) => (
                                      <li key={key}>
                                        <b>{label} : </b>
                                        {getMemberData?.[key] === null ||
                                        getMemberData?.[key] === "" ||
                                        !getMemberData?.[key]
                                          ? "-"
                                          : getMemberData?.[key]}
                                      </li>
                                    ))}
                                  </ul>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="transaction_history" className="py-4">
                  <Row>
                    <Col xs={12} xl={6}>
                      <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                          <Form.Label>Riwayat Pemesanan</Form.Label>
                          <Form method="POST" onSubmit={updateHistoryByDate}>
                            <input
                              type="hidden"
                              name="history_type"
                              value="order"
                            />
                            <InputGroup>
                              <Form.Control
                                type="date"
                                name="start_date_time_order"
                                defaultValue={getOrderStartDate}
                              />
                              <InputGroup.Text>&#x2192;</InputGroup.Text>
                              <Form.Control
                                type="date"
                                name="end_date_time_order"
                                defaultValue={getOrderEndDate}
                              />
                              <InputGroup.Text>&nbsp;</InputGroup.Text>
                              <Button
                                variant="primary"
                                id="order_button"
                                name="order_button"
                                type="submit"
                              >
                                Cari
                              </Button>
                            </InputGroup>
                          </Form>
                          {getOrderData?.length > 0 ? (
                            <Accordion
                              className="mt-2 history-scroll"
                              defaultActiveKey="0"
                            >
                              {getOrderData?.map((item) => (
                                <Accordion.Item eventKey={item.id}>
                                  <Accordion.Header>
                                    <small>{`${
                                      item.date_insert
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[0]
                                    } ${getMonthName(
                                      item.date_insert
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[1]
                                    )} ${
                                      item.date_insert
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[2]
                                    }`}</small>
                                    &nbsp;
                                    <Badge
                                      bg={
                                        item.status === 1 ||
                                        item.status === 2 ||
                                        item.status === 3
                                          ? "primary"
                                          : item.status === 999
                                          ? "success"
                                          : item.status === 1001
                                          ? "danger"
                                          : ""
                                      }
                                      className="badge-md"
                                    >
                                      {item.status === 1 ||
                                      item.status === 2 ||
                                      item.status === 3
                                        ? "Pemesanan"
                                        : item.status === 999
                                        ? "Selesai"
                                        : item.status === 1001
                                        ? "Dibatalkan"
                                        : ""}
                                    </Badge>
                                    &nbsp; &nbsp;
                                    <small style={{ color: "#7376A1" }}>
                                      {item.type + item.invoice}
                                    </small>
                                    &nbsp;
                                    <Badge
                                      bg={
                                        item.gradename !== "Lawyer"
                                          ? item.gradename === "A"
                                            ? "primary"
                                            : "gray"
                                          : item.type === "TLC"
                                          ? "blue"
                                          : item.type === "TL"
                                          ? "purple"
                                          : ""
                                      }
                                      className="badge-md"
                                    >
                                      {item.gradename !== "Lawyer"
                                        ? item.gradename === "A"
                                          ? "Platinum"
                                          : "Silver"
                                        : item.type === "TLC"
                                        ? "Konsultasi"
                                        : item.type === "TL"
                                        ? "Pendampingan"
                                        : item.servicename}
                                    </Badge>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Invoice
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.type + item.invoice}
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
                                                    item.id
                                                  );
                                                }}
                                                icon={faExternalLinkAlt}
                                              />
                                            </Link>
                                          </OverlayTrigger>
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Status
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.status === 1 ||
                                          item.status === 2 ||
                                          item.status === 3
                                            ? "Pemesanan"
                                            : item.status === 999
                                            ? "Selesai"
                                            : item.status === 1001
                                            ? "Dibatalkan"
                                            : ""}
                                        </p>
                                      </Col>
                                    </Row>
                                    <small style={{ color: "#7376A1" }}>
                                      Id Pemesanan
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                      {item.sid}
                                    </p>
                                    <small style={{ color: "#7376A1" }}>
                                      Waktu Transaksi
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                      {`${
                                        item.date_insert
                                          .split("T")[0]
                                          .split("-")
                                          .reverse()[0]
                                      } ${getMonthName(
                                        item.date_insert
                                          .split("T")[0]
                                          .split("-")
                                          .reverse()[1]
                                      )} ${
                                        item.date_insert
                                          .split("T")[0]
                                          .split("-")
                                          .reverse()[2]
                                      }
                            ${item.date_insert.split("T")[1].split("+")[0]}`}
                                    </p>
                                    <hr />
                                    <h6>Detail Pemesanan</h6>
                                    <small style={{ color: "#7376A1" }}>
                                      Tipe Layanan
                                    </small>
                                    <p style={{ fontWeight: "bold" }}>
                                      {item.type === "TLC"
                                        ? "Pengacara (Konsultasi)"
                                        : item.type === "TL"
                                        ? "Pengacara (Pendampingan)"
                                        : item.servicename}
                                      {item.gradename !== "Lawyer"
                                        ? item.gradename === "A"
                                          ? " (Platinum)"
                                          : " (Silver)"
                                        : ""}
                                    </p>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Kode Mitra
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.mitracode}
                                          &nbsp;
                                          <OverlayTrigger
                                            trigger={["hover", "focus"]}
                                            overlay={<Tooltip>Lihat</Tooltip>}
                                          >
                                            <Link
                                              to={`/partner/${
                                                item.gradename !== "Lawyer"
                                                  ? "guard"
                                                  : "lawyer"
                                              }/profile/${item.mitracode}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary"
                                            >
                                              <FontAwesomeIcon
                                                icon={faExternalLinkAlt}
                                              />
                                            </Link>
                                          </OverlayTrigger>
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Durasi
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {`${item.duration} ${item.typeduration}`}
                                        </p>
                                      </Col>
                                    </Row>
                                    {item.status !== 1001 ? (
                                      <Row>
                                        <Col md={6}>
                                          <small style={{ color: "#7376A1" }}>
                                            Waktu Mulai
                                          </small>
                                          <p style={{ fontWeight: "bold" }}>
                                            {`${
                                              item.formdate
                                                .split("-")
                                                .reverse()[0]
                                            } ${getMonthName(
                                              item.formdate
                                                .split("-")
                                                .reverse()[1]
                                            )} ${
                                              item.formdate
                                                .split("-")
                                                .reverse()[2]
                                            }
                                                    ${item.formtime}`}
                                          </p>
                                        </Col>
                                        <Col md={6}>
                                          <small style={{ color: "#7376A1" }}>
                                            Waktu Selesai
                                          </small>
                                          <p style={{ fontWeight: "bold" }}>
                                            {`${
                                              item.enddate
                                                .split("-")
                                                .reverse()[0]
                                            } ${getMonthName(
                                              item.enddate
                                                .split("-")
                                                .reverse()[1]
                                            )} ${
                                              item.enddate
                                                .split("-")
                                                .reverse()[2]
                                            }
                                                    ${item.endtime}`}
                                          </p>
                                        </Col>
                                      </Row>
                                    ) : (
                                      <Row>
                                        <Col md={6}>
                                          <small style={{ color: "#7376A1" }}>
                                            Dibatalkan Oleh
                                          </small>
                                          <p style={{ fontWeight: "bold" }}>
                                            {item.dibatalkan_oleh}
                                          </p>
                                        </Col>
                                        <Col md={6}>
                                          <small style={{ color: "#7376A1" }}>
                                            Alasan Pembatalan
                                          </small>
                                          <p style={{ fontWeight: "bold" }}>
                                            {item.alasan_batal}
                                          </p>
                                        </Col>
                                      </Row>
                                    )}
                                    {item.status !== 1001 ? (
                                      <>
                                        <hr />
                                        <h6>Informasi Pendapatan</h6>
                                        <Row>
                                          <Col>
                                            <small style={{ color: "#7376A1" }}>
                                              Harga Layanan
                                            </small>
                                          </Col>
                                          <Col className="text-end">
                                            <small style={{ color: "#7376A1" }}>
                                              {"IDR" +
                                                " " +
                                                parseInt(
                                                  item.price
                                                ).toLocaleString("id-ID", {})}
                                            </small>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <small style={{ color: "#7376A1" }}>
                                              Potongan TNOS
                                            </small>
                                          </Col>
                                          <Col className="text-end">
                                            <small style={{ color: "#7376A1" }}>
                                              {"IDR" +
                                                " " +
                                                parseInt(
                                                  item.tnosfee
                                                ).toLocaleString("id-ID", {})}
                                            </small>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Pendapatan Mitra
                                            </p>
                                          </Col>
                                          <Col className="text-end">
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {"IDR" +
                                                " " +
                                                parseInt(
                                                  item.mitraprice
                                                ).toLocaleString("id-ID", {})}
                                            </p>
                                          </Col>
                                        </Row>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          ) : (
                            <p className="text-center mt-3 mb-n1">
                              Tidak ada data diantara tanggal ini
                            </p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xs={12} xl={6}>
                      <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                          <Form.Label>Riwayat Pengembalian</Form.Label>
                          <Form method="POST" onSubmit={updateHistoryByDate}>
                            <input
                              type="hidden"
                              name="history_type"
                              value="refund"
                            />
                            <InputGroup>
                              <Form.Control
                                type="date"
                                name="start_date_time_refund"
                                defaultValue={getRefundStartDate}
                              />
                              <InputGroup.Text>&#x2192;</InputGroup.Text>
                              <Form.Control
                                type="date"
                                name="end_date_time_refund"
                                defaultValue={getRefundEndDate}
                              />
                              <InputGroup.Text>&nbsp;</InputGroup.Text>
                              <Button
                                variant="primary"
                                id="refund_button"
                                name="refund_button"
                                type="submit"
                              >
                                Cari
                              </Button>
                            </InputGroup>
                          </Form>
                          {getRefundData?.length > 0 ? (
                            <Accordion
                              className="mt-2 history-scroll"
                              defaultActiveKey="0"
                            >
                              {getRefundData?.map((item) => (
                                <Accordion.Item eventKey={item.id}>
                                  <Accordion.Header>
                                    <small>{`${
                                      item.create_at
                                        .split("+")[0]
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[0]
                                    } ${getMonthName(
                                      item.create_at
                                        .split("+")[0]
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[1]
                                    )} ${
                                      item.create_at
                                        .split("+")[0]
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()[2]
                                    }`}</small>
                                    &nbsp;
                                    <Badge
                                      bg={
                                        item.status === "W"
                                          ? "danger"
                                          : item.status === "P"
                                          ? "warning"
                                          : item.status === "Y"
                                          ? "success"
                                          : ""
                                      }
                                      className="badge-md"
                                    >
                                      {item.status === "W"
                                        ? "Menunggu"
                                        : item.status === "P"
                                        ? "Sedang Diproses"
                                        : item.status === "Y"
                                        ? "Selesai"
                                        : ""}
                                    </Badge>
                                    &nbsp;
                                    <small style={{ color: "#7376A1" }}>
                                      {item.sid.split(".")[0].split("-")[0] +
                                        "-" +
                                        item.sid.split(".")[1]}
                                    </small>
                                    &nbsp;
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          SID
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.sid
                                            .split(".")[0]
                                            .split("-")[0] +
                                            "-" +
                                            item.sid.split(".")[1]}
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Status
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.status === "W"
                                            ? "Menunggu"
                                            : item.status === "P"
                                            ? "Sedang Diproses"
                                            : item.status === "Y"
                                            ? "Selesai"
                                            : ""}
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          UID
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.sid.split(".")[0].split("-")[1]}
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Waktu Pengajuan
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {`${
                                            item.create_at
                                              .split("+")[0]
                                              .split("T")[0]
                                              .split("-")
                                              .reverse()[0]
                                          } ${getMonthName(
                                            item.create_at
                                              .split("+")[0]
                                              .split("T")[0]
                                              .split("-")
                                              .reverse()[1]
                                          )} ${
                                            item.create_at
                                              .split("+")[0]
                                              .split("T")[0]
                                              .split("-")
                                              .reverse()[2]
                                          }
                            ${item.create_at.split("+")[0].split("T")[1]}`}
                                        </p>
                                      </Col>
                                    </Row>
                                    <hr />
                                    <h6>Informasi Transaksi</h6>
                                    {getRefundTransactionData
                                      .filter(
                                        (rtItem) => rtItem.order_id === item.sid
                                      )
                                      .map((rtItem) => (
                                        <>
                                          {" "}
                                          <Row>
                                            <Col md={6}>
                                              <small
                                                style={{ color: "#7376A1" }}
                                              >
                                                Tipe Pembayaran
                                              </small>
                                              <p style={{ fontWeight: "bold" }}>
                                                {humanizeText(
                                                  rtItem.payment_type
                                                )}
                                              </p>
                                            </Col>
                                            <Col md={6}>
                                              <small
                                                style={{ color: "#7376A1" }}
                                              >
                                                Status
                                              </small>
                                              <p style={{ fontWeight: "bold" }}>
                                                {humanizeText(
                                                  rtItem.transaction_status
                                                )}
                                              </p>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={6}>
                                              <small
                                                style={{ color: "#7376A1" }}
                                              >
                                                Waktu Transaksi
                                              </small>
                                              <p style={{ fontWeight: "bold" }}>
                                                {`${
                                                  rtItem.transaction_time
                                                    .split(" ")[0]
                                                    .split("-")
                                                    .reverse()[0]
                                                } ${getMonthName(
                                                  rtItem.transaction_time
                                                    .split(" ")[0]
                                                    .split("-")
                                                    .reverse()[1]
                                                )} ${
                                                  rtItem.transaction_time
                                                    .split(" ")[0]
                                                    .split("-")
                                                    .reverse()[2]
                                                }
                                                ${
                                                  rtItem.transaction_time.split(
                                                    " "
                                                  )[1]
                                                }`}
                                              </p>
                                            </Col>
                                            <Col md={6}>
                                              <small
                                                style={{ color: "#7376A1" }}
                                              >
                                                Total
                                              </small>
                                              <p style={{ fontWeight: "bold" }}>
                                                {rtItem.currency +
                                                  " " +
                                                  parseInt(
                                                    rtItem.gross_amount
                                                  ).toLocaleString("id-ID", {})}
                                              </p>
                                            </Col>
                                          </Row>
                                        </>
                                      ))}
                                    <hr />
                                    <h6>Informasi Pemesanan</h6>
                                    {getOrderTransactionData.filter(
                                      (otItem) => otItem.sid === item.sid
                                    )[0] !== undefined && (
                                      <>
                                        <Row>
                                          <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>
                                              Id
                                            </small>
                                            <p style={{ fontWeight: "bold" }}>
                                              {getOrderTransactionData.filter(
                                                (otItem) =>
                                                  otItem.sid === item.sid
                                              )[0].type +
                                                getOrderTransactionData.filter(
                                                  (otItem) =>
                                                    otItem.sid === item.sid
                                                )[0].invoice}
                                            </p>
                                          </Col>
                                          <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>
                                              Status
                                            </small>
                                            <p style={{ fontWeight: "bold" }}>
                                              {getOrderTransactionData.filter(
                                                (otItem) =>
                                                  otItem.sid === item.sid
                                              )[0].status === 1
                                                ? "Menerima Pesanan"
                                                : getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].status === 2
                                                ? "Dalam Perjalanan"
                                                : getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].status === 3
                                                ? "Hadir dan Sedang Bertugas"
                                                : getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].status === 990
                                                ? "Sedang Berlangsung"
                                                : getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].status === 999
                                                ? "Selesai"
                                                : getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].status === 1001
                                                ? "Dibatalkan"
                                                : ""}
                                            </p>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>
                                              Alasan Batal
                                            </small>
                                            <p style={{ fontWeight: "bold" }}>
                                              {
                                                getOrderTransactionData.filter(
                                                  (otItem) =>
                                                    otItem.sid === item.sid
                                                )[0].alasan_batal
                                              }
                                            </p>
                                          </Col>
                                          <Col md={6}>
                                            <small style={{ color: "#7376A1" }}>
                                              Biaya Pemesanan
                                            </small>
                                            <p style={{ fontWeight: "bold" }}>
                                              {"IDR " +
                                                parseInt(
                                                  getOrderTransactionData.filter(
                                                    (otItem) =>
                                                      otItem.sid === item.sid
                                                  )[0].price
                                                ).toLocaleString("id-ID", {})}
                                            </p>
                                          </Col>
                                        </Row>
                                      </>
                                    )}
                                    <hr />
                                    <h6>Informasi Rekening</h6>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Bank
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.bank_name}
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Cabang
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.bank_cabang !== "null" ||
                                          item.bank_cabang !== ""
                                            ? item.bank_cabang
                                            : "-"}
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          Atas Nama
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.bank_account}
                                        </p>
                                      </Col>
                                      <Col md={6}>
                                        <small style={{ color: "#7376A1" }}>
                                          No. Rekening
                                        </small>
                                        <p style={{ fontWeight: "bold" }}>
                                          {item.bank_norek}
                                        </p>
                                      </Col>
                                    </Row>
                                    <hr />
                                    <h6>Informasi Pengembalian</h6>
                                    {[
                                      ["Total Dibayarkan", item.total],
                                      ["Potongan (10%)", item.potongan],
                                      ["Total Pengembalian", item.kembali],
                                    ].map(([label, key]) => (
                                      <Row>
                                        <Col>
                                          {label !== "Total Pengembalian" ? (
                                            <small style={{ color: "#7376A1" }}>
                                              {label}
                                            </small>
                                          ) : (
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {label}
                                            </p>
                                          )}
                                        </Col>
                                        <Col className="text-end">
                                          {label !== "Total Pengembalian" ? (
                                            <small style={{ color: "#7376A1" }}>
                                              {"IDR " +
                                                parseInt(key).toLocaleString(
                                                  "id-ID",
                                                  {}
                                                )}
                                            </small>
                                          ) : (
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {"IDR" +
                                                " " +
                                                parseInt(key).toLocaleString(
                                                  "id-ID",
                                                  {}
                                                )}
                                            </p>
                                          )}
                                        </Col>
                                      </Row>
                                    ))}
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          ) : (
                            <p className="text-center mt-3 mb-n1">
                              Tidak ada data diantara tanggal ini
                            </p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
    </>
  );
};
