import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faExternalLinkAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Card,
  Row,
  Button,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Tab,
  Nav,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import DateBetweenFilter from "../../components/DateBetweenFilter";
import ReadableDateTime from "../../components/ReadableDateTime";
import TodayDate from "../../components/TodayDate";
import Preloader from "../../components/Preloader";
import moment from "moment";

export default () => {
  const [getMessageEmptyData] = useState("Tidak ada data");
  // (States) - Member Voucher
  const [getMemberData, setMemberData] = useState();
  const [getAllMemberData, setAllMemberData] = useState();
  const [getGeneralFilterValue, setGeneralFilterValue] = useState("all_search");
  const [getStartDateTimeFilterValue, setStartDateTimeFilterValue] = useState(
    "2022-01-01T00:00:00"
  );
  const [getEndDateTimeFilterValue, setEndDateTimeFilterValue] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ss")
  );
  // (States) - Order Voucher
  const [getOrderData, setOrderData] = useState();
  const [getAllOrderData, setAllOrderData] = useState();
  // (States) - Payment Voucher
  const [getPaymentData, setPaymentData] = useState();
  const [getAllPaymentData, setAllPaymentData] = useState();

  // Calc Amount Func
  const calcAmount = (amount, times = true) => {
    const am = times ? amount * 10000 : amount;
    return "IDR " + am.toLocaleString("id-ID", {});
  };
  // Order Status Text Func
  const orderText = (code) => {
    if (code === "001") {
      return "Menunggu";
    } else if (code === "010") {
      return "Selesai";
    } else if (code === "011") {
      return "Gagal";
    }
  };
  // Icon Link Func
  const iconLink = (value, url) => {
    return (
      <>
        {value} &nbsp;
        <OverlayTrigger
          trigger={["hover", "focus"]}
          overlay={<Tooltip>Lihat</Tooltip>}
        >
          <Link
            to={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Link>
        </OverlayTrigger>
      </>
    );
  };
  // Filter Data Member Func
  const filterData = (e) => {
    let datas = getAllMemberData;
    let generalSearch = getGeneralFilterValue;
    let startDateTimeSearch = getStartDateTimeFilterValue;
    let endDateTimeSearch = getEndDateTimeFilterValue;

    if (e.target.id === "all_search") {
      generalSearch = e.target.value;
      setGeneralFilterValue(e.target.value);
    } else if (e.target.id === "start_datetime_search") {
      startDateTimeSearch = e.target.value;
      setStartDateTimeFilterValue(e.target.value);
    } else if (e.target.id === "end_datetime_search") {
      endDateTimeSearch = e.target.value;
      setEndDateTimeFilterValue(e.target.value);
    } else if (e.target.id === "reset_datetime") {
      startDateTimeSearch = "2022-01-01T00:00:00";
      setStartDateTimeFilterValue("2022-01-01T00:00:00");
      endDateTimeSearch = moment().format("YYYY-MM-DDTHH:mm:ss");
      setEndDateTimeFilterValue(moment().format("YYYY-MM-DDTHH:mm:ss"));
    }

    if (generalSearch !== "all_search") {
      datas = datas.filter(
        (item) =>
          // item.mmbr_name.toLowerCase().includes(generalSearch.toLowerCase()) ||
          item.user_id.includes(generalSearch)
        // item.mmbr_phone.includes(generalSearch) ||
        // item.mmbr_email.toLowerCase().includes(generalSearch.toLowerCase())
      );
    }

    datas = DateBetweenFilter(
      datas,
      "created_at",
      startDateTimeSearch,
      endDateTimeSearch
    );

    setMemberData(datas);
  };

  // const getMemberVoucherData = (item) => {
  //   fetch(
  //     `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/point/last-point-by-user/${item.mmbr_code}`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success === true) {
  //         const memberData = data.point_histories;
  //         return {
  //           mmbr_name: item.mmbr_name,
  //           mmbr_code: item.mmbr_code,
  //           in_point: memberData.in_point,
  //           out_point: memberData.out_point,
  //           before_point: memberData.before_point,
  //           point: memberData.point,
  //           description: memberData.description,
  //           created_at: memberData.created_at,
  //         };
  //       } else {
  //         return {
  //           mmbr_name: item.mmbr_name,
  //           mmbr_code: item.mmbr_code,
  //           in_point: null,
  //           out_point: null,
  //           before_point: 0,
  //           point: 0,
  //           description: "-",
  //           created_at: "-",
  //         };
  //       }
  //     });
  // };

  useEffect(() => {
    // (Datas) - Order Voucher
    fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          // (Datas) - Member Voucher
          // Membuat objek untuk menyimpan data transaksi terbaru untuk setiap user_id
          const latestTransactions = {};

          // Melakukan loop pada data transaksi
          data.transaction.forEach((transaction) => {
            // Jika transaksi belum terdaftar sebagai transaksi terbaru pada user_id yang sama,
            // atau jika tanggal created_at pada transaksi lebih baru dari transaksi terbaru yang sudah terdaftar,
            // maka daftarkan transaksi tersebut sebagai transaksi terbaru
            if (
              !latestTransactions[transaction.user_id] ||
              new Date(transaction.created_at) >
              new Date(latestTransactions[transaction.user_id].created_at)
            ) {
              latestTransactions[transaction.user_id] = transaction;
            }
          });

          // Mengubah objek transaksi terbaru menjadi array
          const latestTransactionArray = Object.values(latestTransactions);
          setMemberData(latestTransactionArray);
          setAllMemberData(latestTransactionArray);

          setOrderData(
            DateBetweenFilter(
              data.transaction,
              "created_at",
              TodayDate() + "T00:00:00",
              TodayDate() + "T23:59:59"
            )
          );
          setAllOrderData(data.transaction);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // (Datas) - Payment Voucher
    fetch(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/payment-voucher`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          setPaymentData(
            DateBetweenFilter(
              data.payment,
              "created_at",
              TodayDate() + "T00:00:00",
              TodayDate() + "T23:59:59"
            )
          );
          setAllPaymentData(data.payment);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // (Table Datas) - Member Voucher
  const TableRowMember = (props) => {
    const {
      id,
      user_id,
      in_point,
      out_point,
      before_point,
      point,
      description,
      created_at,
    } = props;

    return (
      <tr className="text-center">
        <td>{props.num}</td>
        <td>{id}</td>
        <td>{iconLink(user_id, `/member/profile/${user_id}`)}</td>
        <td>{ReadableDateTime(created_at)}</td>
        <td>
          {in_point === null ? (
            <span className="text-danger">{calcAmount(out_point)} -</span>
          ) : (
            <span className="text-success">{calcAmount(in_point)} +</span>
          )}
        </td>
        <td>{description}</td>
        <td>
          <Link
            to={`/pwa-b2b/voucher/order-voucher-detail/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="text-white">
              <FontAwesomeIcon icon={faThList} />
              &nbsp; Detail
            </Button>
          </Link>
        </td>
      </tr>
    );
  };
  // (Table Datas) - Order Voucher
  const TableRowOrder = (props) => {
    const {
      id,
      user_id,
      in_point,
      out_point,
      before_point,
      point,
      description,
      created_at,
    } = props;

    return (
      <tr className="text-center">
        <td>{props.num}</td>
        <td>{id}</td>
        <td>{iconLink(user_id, `/member/profile/${user_id}`)}</td>
        <td>
          {in_point === null ? (
            <span className="text-danger">{calcAmount(out_point)} -</span>
          ) : (
            <span className="text-success">{calcAmount(in_point)} +</span>
          )}
        </td>
        <td>{calcAmount(before_point)}</td>
        <td>{calcAmount(point)}</td>
        <td>{description}</td>
        <td>{created_at}</td>
        <td>
          <Link
            to={`/pwa-b2b/voucher/order-voucher-detail/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="text-white">
              <FontAwesomeIcon icon={faThList} />
              &nbsp; Detail
            </Button>
          </Link>
        </td>
      </tr>
    );
  };
  // (Table Datas) - Payment Voucher
  const TableRowPayment = (props) => {
    const {
      id,
      invoice_id,
      user_id,
      amount,
      description,
      status_order,
      payment_status,
      created_at,
    } = props;

    return (
      <tr className="text-center">
        <td>{props.num}</td>
        <td>{id}</td>
        <td>{invoice_id}</td>
        <td>{user_id}</td>
        <td>{calcAmount(amount, false)}</td>
        <td>{description}</td>
        <td>{orderText(status_order)}</td>
        <td>{payment_status}</td>
        <td>{ReadableDateTime(created_at)}</td>
        <td>
          <Link
            to={`/pwa-b2b/voucher/payment-voucher-detail/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="text-white">
              <FontAwesomeIcon icon={faThList} />
              &nbsp; Detail
            </Button>
          </Link>
        </td>
      </tr>
    );
  };

  // (Filter Date) - Order Voucher
  const updateOrderDate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setOrderData(
      DateBetweenFilter(
        getAllOrderData,
        "created_at",
        formData.get("start_date_time_order"),
        formData.get("end_date_time_order")
      )
    );
  };
  // (Filter Date) - Payment Voucher
  const updatePaymentDate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setPaymentData(
      DateBetweenFilter(
        getAllPaymentData,
        "created_at",
        formData.get("start_date_time_payment"),
        formData.get("end_date_time_payment")
      )
    );
  };

  return (
    <>
      <Preloader
        show={!getOrderData && !getPaymentData && !getMemberData ? true : false}
      />
      <Col xl={12} className="mt-2">
        <Tab.Container defaultActiveKey="member_voucher_tab">
          <Row>
            <Col lg={12}>
              <Nav className="nav-tabs">
                {/* (Tab) - Member Voucher */}
                <Nav.Item>
                  <Nav.Link eventKey="member_voucher_tab">Transaksi</Nav.Link>
                </Nav.Item>
                {/* (Tab) - Order Voucher */}
                {/* <Nav.Item>
                  <Nav.Link eventKey="order_voucher_tab">Pemesanan</Nav.Link>
                </Nav.Item> */}
                {/* (Tab) - Payment Voucher */}
                <Nav.Item>
                  <Nav.Link eventKey="payment_voucher_tab">Pembayaran</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payment_voucher_penyesuaian">Penyesuaian</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col lg={12}>
              <Tab.Content>
                {/* (Tab Item) - Member Voucher */}
                <Tab.Pane eventKey="member_voucher_tab">
                  <Card border="light">
                    <Card.Body>
                      <Form className="navbar-search mb-3">
                        <Row>
                          <Col>
                            <Form.Group id="topbarSearch">
                              <InputGroup className="input-group-merge search-bar">
                                <InputGroup.Text>
                                  <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Cari Pengguna..."
                                  id="all_search"
                                  onKeyUp={filterData}
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={7}>
                            <InputGroup>
                              <InputGroup.Text>Tanggal</InputGroup.Text>
                              <Form.Control
                                id="start_datetime_search"
                                type="datetime-local"
                                name="start_date_time"
                                step="1"
                                defaultValue={getStartDateTimeFilterValue}
                                onChange={filterData}
                                required
                              />
                              <InputGroup.Text>&#x2192;</InputGroup.Text>
                              <Form.Control
                                id="end_datetime_search"
                                type="datetime-local"
                                name="end_date_time"
                                step="1"
                                defaultValue={getEndDateTimeFilterValue}
                                onChange={filterData}
                                required
                              />
                              <InputGroup.Text
                                className="bg-dark text-white"
                                style={{ cursor: "pointer" }}
                                id="reset_datetime"
                                onClick={filterData}
                              >
                                Reset
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                        </Row>
                      </Form>
                      <TnosDataTable
                        title={"Daftar Pengguna"}
                        subtitle={"Daftar Pengguna Voucher"}
                        getExportData={getMemberData}
                        getMenu={`pwa-b2b-transaksi`}
                        data={
                          <>
                            <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                              <tr className="text-center">
                                <th className="border-0">No.</th>
                                <th className="border-0">Id</th>
                                <th className="border-0">Id Pengguna</th>
                                <th className="border-0">Tanggal</th>
                                <th className="border-0">
                                  Voucher (
                                  <span className="text-success">
                                    {" "}
                                    Masuk +{" "}
                                  </span>
                                  /
                                  <span className="text-danger">
                                    {" "}
                                    Keluar -{" "}
                                  </span>
                                  )
                                </th>
                                <th className="border-0">Deskripsi</th>
                                <th className="border-0"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {getMemberData?.length > 0 ? (
                                getMemberData?.map((m, index) => (
                                  <TableRowMember
                                    key={`member-${m.mmbr_code}`}
                                    {...m}
                                    num={index + 1}
                                  />
                                ))
                              ) : (
                                <tr className="text-center">
                                  <td colspan={9}>{getMessageEmptyData}</td>
                                </tr>
                              )}
                            </tbody>
                          </>
                        }
                      />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                {/* (Tab Item) - Order Voucher */}
                <Tab.Pane eventKey="payment_voucher_penyesuaian">
                  <Card border="light">
                    <Card.Body>
                      <Form method="POST" onSubmit={updateOrderDate}>
                        <Row className="mb-3">
                          <Col md={8}>
                            <Form.Label>Tanggal Dibuat</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="datetime-local"
                                name="start_date_time_order"
                                step="1"
                                defaultValue={TodayDate() + "T00:00:00"}
                                required
                              />
                              <InputGroup.Text>&#x2192;</InputGroup.Text>
                              <Form.Control
                                type="datetime-local"
                                name="end_date_time_order"
                                step="1"
                                defaultValue={TodayDate() + "T23:59:59"}
                                required
                              />
                            </InputGroup>
                          </Col>
                          <Col>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control
                              className="btn btn-primary"
                              type="submit"
                              name="btn_search_order"
                              value="Cari"
                            />
                          </Col>
                        </Row>
                      </Form>
                      <TnosDataTable
                        getExportData={getOrderData}
                        getMenu={`pwa-b2b-penyesuaian`}
                        data={
                          <>
                            <thead className="thead-light">
                              <tr className="text-center">
                                <th className="border-0">No.</th>
                                <th className="border-0">Id</th>
                                <th className="border-0">Id Pengguna</th>
                                <th className="border-0">
                                  Voucher (
                                  <span className="text-success">
                                    {" "}
                                    Masuk +{" "}
                                  </span>
                                  /
                                  <span className="text-danger">
                                    {" "}
                                    Keluar -{" "}
                                  </span>
                                  )
                                </th>
                                <th className="border-0">Voucher Sebelumnya</th>
                                <th className="border-0">Sisa Voucher</th>
                                <th className="border-0">Deskripsi</th>
                                <th className="border-0">Tanggal Dibuat</th>
                                <th className="border-0"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {getOrderData?.length > 0 ? (
                                getOrderData?.map((td, index) => (
                                  <TableRowOrder
                                    key={`order-voucher-${td.id}`}
                                    {...td}
                                    num={index + 1}
                                  />
                                ))
                              ) : (
                                <tr className="text-center">
                                  <td colspan={10}>{getMessageEmptyData}</td>
                                </tr>
                              )}
                            </tbody>
                          </>
                        }
                      />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                {/* (Tab Item) - Payment Voucher */}
                <Tab.Pane eventKey="payment_voucher_tab">
                  <Card border="light">
                    <Card.Body>
                      <Form method="POST" onSubmit={updatePaymentDate}>
                        <Row className="mb-3">
                          <Col md={8}>
                            <Form.Label>Tanggal Dibuat</Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="datetime-local"
                                name="start_date_time_payment"
                                step="1"
                                defaultValue={TodayDate() + "T00:00:00"}
                                required
                              />
                              <InputGroup.Text>&#x2192;</InputGroup.Text>
                              <Form.Control
                                type="datetime-local"
                                name="end_date_time_payment"
                                step="1"
                                defaultValue={TodayDate() + "T23:59:59"}
                                required
                              />
                            </InputGroup>
                          </Col>
                          <Col>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control
                              className="btn btn-primary"
                              type="submit"
                              name="btn_search_payment"
                              value="Cari"
                            />
                          </Col>
                        </Row>
                      </Form>
                      <TnosDataTable
                        getExportData={getPaymentData}
                        getMenu={`pwa-b2b-pembayaran`}
                        data={
                          <>
                            <thead className="thead-light">
                              <tr className="text-center">
                                <th className="border-0">No.</th>
                                <th className="border-0">Id</th>
                                <th className="border-0">Id Invoice</th>
                                <th className="border-0">Id User</th>
                                <th className="border-0">Jumlah</th>
                                <th className="border-0">Deskripsi</th>
                                <th className="border-0">Status Pemesanan</th>
                                <th className="border-0">Status Pembayaran</th>
                                <th className="border-0">Tanggal Dibuat</th>
                                <th className="border-0"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {getPaymentData?.length > 0 ? (
                                getPaymentData?.map((td, index) => (
                                  <TableRowPayment
                                    key={`payment-voucher-${td.id}`}
                                    {...td}
                                    num={index + 1}
                                  />
                                ))
                              ) : (
                                <tr className="text-center">
                                  <td colspan={10}>{getMessageEmptyData}</td>
                                </tr>
                              )}
                            </tbody>
                          </>
                        }
                      />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Col>
    </>
  );
};
