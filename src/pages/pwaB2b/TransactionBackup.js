import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Card,
  Row,
  Button,
  Form,
  InputGroup,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import { TnosDataTable } from "../../components/TnosDataTable";
import TodayDate from "../../components/TodayDate";
import DateBetweenFilter from "../../components/DateBetweenFilter";
import ReadableDateTime from "../../components/ReadableDateTime";

export default () => {
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [getTransactionData, setTransactionData] = useState([]);
  const [getAllTransactionData, setAllTransactionData] = useState();
  const [getTotalAmountToday, setTotalAmountToday] = useState();
  const [getTotalAmountBetween, setTotalAmountBetween] = useState();
  const [getMessageEmptyData, setMessageEmptyData] = useState(
    "Belum ada transaksi pada hari ini"
  );

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

  const [getServiceTypeArr] = useState([
    {
      key: "service_type_0",
      value: 0,
      defaultValue: "Semua Layanan",
      tnos_service_id: 0,
      tnos_subservice_id: 0,
    },
    {
      key: "service_type_1",
      value: 1,
      defaultValue: "Pengamanan Usaha & Bisnis",
      tnos_service_id: 2,
      tnos_subservice_id: 2,
    },
    {
      key: "service_type_2",
      value: 2,
      defaultValue: "Badan Hukum PT",
      tnos_service_id: 3,
      tnos_subservice_id: 1,
    },
    {
      key: "service_type_3",
      value: 3,
      defaultValue: "Badan Usaha CV",
      tnos_service_id: 3,
      tnos_subservice_id: 2,
    },
    {
      key: "service_type_4",
      value: 4,
      defaultValue: "Yayasan",
      tnos_service_id: 3,
      tnos_subservice_id: 3,
    },
    {
      key: "service_type_5",
      value: 5,
      defaultValue: "Perkumpulan",
      tnos_service_id: 3,
      tnos_subservice_id: 4,
    },
    {
      key: "service_type_6",
      value: 6,
      defaultValue: "Legalitas Lainnya",
      tnos_service_id: 3,
      tnos_subservice_id: 6,
    },
    {
      key: "service_type_7",
      value: 7,
      defaultValue: "Komprehensif Solusi Hukum",
      tnos_service_id: 3,
      tnos_subservice_id: 7,
    },
    {
      key: "service_type_8",
      value: 8,
      defaultValue: "Pembayaran Lainnya",
      tnos_service_id: 3,
      tnos_subservice_id: 8,
    },
    {
      key: "service_type_9",
      value: 9,
      defaultValue: "PAS",
      tnos_service_id: 4,
      tnos_subservice_id: 1,
    },
    {
      key: "service_type_10",
      value: 10,
      defaultValue: "TRIGER",
      tnos_service_id: 5,
      tnos_subservice_id: 1,
    },
    {
      key: "service_type_11",
      value: 11,
      defaultValue: "PWAN",
      tnos_service_id: 6,
      tnos_subservice_id: 1
    }
  ]);
  const [getOrderStatusArr] = useState([
    {
      key: "order_status_0",
      value: 0,
      defaultValue: "Semua Status",
      us: "All Status",
      desc: "Menampilkan Semua Status Pemesanan",
      color: "",
    },
    {
      key: "order_status_1",
      value: 1,
      defaultValue: "Menunggu",
      us: "001",
      desc: "Menunggu pembayaran dari customer",
      color: "primary",
    },
    {
      key: "order_status_2",
      value: 2,
      defaultValue: "Order diproses",
      us: "002",
      desc: "Admin sedang memproses order",
      color: "primary",
    },
    {
      key: "order_status_3",
      value: 3,
      defaultValue: "Siap Bertugas",
      us: "003",
      desc: "Mitra telah tersedia",
      color: "primary",
    },
    {
      key: "order_status_4",
      value: 4,
      defaultValue: "Menuju Lokasi",
      us: "004",
      desc: "Mitra sedang menuju lokasi",
      color: "primary",
    },
    {
      key: "order_status_5",
      value: 5,
      defaultValue: "Hadir dan Sedang Bertugas",
      us: "005",
      desc: "Mitra telah hadir di lokasi",
      color: "primary",
    },
    {
      key: "order_status_6",
      value: 6,
      defaultValue: "Proses Pembuatan Akta",
      us: "006",
      desc: "Sedang Proses Pembuatan Akta",
      color: "primary",
    },
    {
      key: "order_status_7",
      value: 7,
      defaultValue: "Proses SK MENKUMHAM",
      us: "007",
      desc: "Sedang Proses Pembuatan SK MENKUMHAM",
      color: "primary",
    },
    {
      key: "order_status_8",
      value: 8,
      defaultValue: "Proses NPWP",
      us: "008",
      desc: "Sedang Proses Pembuatan NPWP",
      color: "primary",
    },
    {
      key: "order_status_9",
      value: 9,
      defaultValue: "Sedang Pembuatan NIB",
      us: "009",
      desc: "Sedang Proses Pembuatan NIB",
      color: "primary",
    },
    {
      key: "order_status_10",
      value: 10,
      defaultValue: "Selesai",
      us: "010",
      desc: "Hardcopy telah diterima oleh Klien",
      color: "primary",
    },
    {
      key: "order_status_11",
      value: 11,
      defaultValue: "Gagal",
      us: "011",
      desc: "Gagal",
      color: "danger",
    },
  ]);
  const [getPaymentStatusArr] = useState([
    {
      key: "payment_status_0",
      value: 0,
      defaultValue: "Semua Status",
      us: "All Status",
      desc: "Menampilkan Semua Status Pembayaran",
      color: "",
    },
    {
      key: "payment_status_1",
      value: 1,
      defaultValue: "Memesan",
      us: "ORDER",
      desc: "Memesan tapi belum masuk ke menu pembayaran",
      color: "primary",
    },
    {
      key: "payment_status_2",
      value: 2,
      defaultValue: "Belum Dibayar",
      us: "UNPAID",
      desc: "Tautan pembayaran sudah berhasil dibuat dan dapat dibayarkan oleh Pelanggan Anda sampai tanggal kedaluwarsa yang Anda tentukan",
      color: "danger",
    },
    {
      key: "payment_status_3",
      value: [3, 4],
      defaultValue: "Sudah Dibayar",
      us: "PAID_SETTLED",
      desc: "Tautan pembayaran sudah berhasil dibayarkan oleh pelanggan Anda",
      color: "success",
    },
    {
      key: "payment_status_5",
      value: 5,
      defaultValue: "Kadaluarsa",
      us: "EXPIRED",
      desc: "Pembayaran Kadaluarsa",
      color: "danger",
    },
  ]);

  const TableRow = (props) => {
    const {
      external_id,
      tnos_invoice_id,
      payment_status_datas,
      id,
      order_status_datas,
      created_at,
      paid_at,
      order_total,
      user_id,
      name,
      partner_name,
      payment_method,
      payment_channel,
      service_datas,
    } = props;

    return (
      <tr>
        <td className="text-center">{props.num}</td>
        <td className="text-center">
          {payment_status_datas.name == "Kadaluarsa" ? (
            "Tidak Ada"
          ) : !tnos_invoice_id ? (
            <Badge bg="primary" className="badge-lg">
              Menunggu Pembayaran &nbsp;
              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    No. Invoice akan muncul setelah pemesanan dikonfirmasi
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </Badge>
          ) : (
            <span>
              {tnos_invoice_id}
            </span>
            // <Link
            //   to={`/pwa-b2b/order/detail`}
            //   target="_blank"
            //   rel="noopener noreferrer"
            // >
            //   <span
            //     onClick={() => {
            //       localStorage.setItem(
            //         "pwaB2bOrderDataById",
            //         JSON.stringify(
            //           getAllTransactionData.filter((item) => item.id === id)[0]
            //         )
            //       );
            //     }}
            //   >
            //     {tnos_invoice_id}
            //   </span>
            // </Link>
          )}
        </td>
        <td className="text-center">
          {!external_id ? (
            <Badge bg="primary" className="badge-lg">
              Menunggu Pembayaran &nbsp;
              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    Id transaksi akan muncul setelah pembayaran selesai
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </Badge>
          ) : (
            <Link
              to={`/pwa-b2b/transaction/detail`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                onClick={() => {
                  localStorage.setItem(
                    "pwaB2bTransactionDataById",
                    JSON.stringify(
                      getAllTransactionData.filter((item) => item.id === id)[0]
                    )
                  );
                }}
              >
                {external_id}
              </span>
            </Link>
          )}
        </td>
        <td className="text-center">
          <Badge bg={payment_status_datas.color} className="badge-lg">
            {payment_status_datas.name}
            &nbsp;
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>{payment_status_datas.desc}</Tooltip>}
            >
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
          </Badge>
        </td>
        <td className="text-center">
          {payment_status_datas.name == "Kadaluarsa" ? (
            "Tidak Ada"
          ) : (
            <Badge bg={order_status_datas.color} className="badge-lg">
              {order_status_datas.name}
              &nbsp;
              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={<Tooltip>{order_status_datas.desc}</Tooltip>}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </Badge>
          )}
        </td>
        <td className="text-center">{ReadableDateTime(created_at)}</td>
        <td className="text-center">
          {payment_status_datas.name == "Kadaluarsa" ? (
            "Tidak Ada"
          ) : !paid_at ? (
            <Badge bg="primary" className="badge-lg">
              Menunggu Pembayaran &nbsp;
              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    Waktu transaksi akan muncul setelah pembayaran selesai
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </Badge>
          ) : (
            ReadableDateTime(paid_at)
          )}
        </td>
        <td className="text-center">{service_datas.name}</td>
        <td className="text-center">
          <a
            href={"/member/profile/" + user_id}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </td>
        <td className="text-center">
          {partner_name == null ? "-" : partner_name}
        </td>
        <td className="text-center">
          {payment_status_datas.name == "Kadaluarsa" ? (
            "Tidak Ada"
          ) : !payment_method && !payment_channel ? (
            <Badge bg="primary" className="badge-lg">
              Menunggu Pembayaran &nbsp;
              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    Metode Pembayaran akan muncul setelah pembayaran selesai
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </Badge>
          ) : (
            `${payment_method}(${payment_channel})`
          )}
        </td>
        <td className="text-center">
          {"IDR " + parseInt(order_total).toLocaleString("id-ID", {})}
        </td>
        <td className="text-center">
          <Link
            to={`/pwa-b2b/order/detail`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              size="sm"
              className="text-white"
              onClick={() => {
                localStorage.setItem(
                  "pwaB2bOrderDataById",
                  JSON.stringify(
                    getAllTransactionData.filter((item) => item.id === id)[0]
                  )
                );
              }}
            >
              <FontAwesomeIcon icon={faThList} />
            </Button>
          </Link>
        </td>
        {/* <td className="text-center">
          {payment_status_datas.name == "Kadaluarsa" ? (
            "Tidak Ada"
          ) : (
            <Link
              to={`/pwa-b2b/transaction/export-pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="sm"
                className="text-white"
                onClick={() => {
                  localStorage.setItem(
                    "pwaB2bExportTransactionDataById",
                    JSON.stringify(
                      getAllTransactionData.filter((item) => item.id === id)[0]
                    )
                  );
                }}
              >
                <FontAwesomeIcon icon={faPrint} />
              </Button>
            </Link>
          )}
        </td> */}
      </tr>
    );
  };

  const getDataBetweenDate = (datas, startDate, endDate) => {
    return DateBetweenFilter(datas, "created_at", startDate, endDate);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/order?type=transaksi`)
      .then((res) => res.json())
      .then((data) => {

        localStorage.setItem(
          "getStartDatePwaB2bTransaction",
          TodayDate() + " 00:00:00"
        );
        localStorage.setItem(
          "getEndDatePwaB2bTransaction",
          TodayDate() + " 23:59:59"
        );

        const getServiceType = (serviceId, subServiceId) => {
          let data = getServiceTypeArr.filter(
            (item) =>
              item.tnos_service_id === parseInt(serviceId) &&
              item.tnos_subservice_id === parseInt(subServiceId)
          );
          return {
            id: data[0].value,
            name: data[0].defaultValue,
          };
        };
        const getOrderStatus = (us) => {
          let data = getOrderStatusArr.filter((item) => {
            return item.us === us;
          });
          return {
            id: data[0].value,
            name: data[0].defaultValue,
            desc: data[0].desc,
            color: data[0].color,
          };
        };
        const getPaymentStatus = (us, type) => {
          const determinePaymentStatus = (us) => {
            if (us === "PAID" || us === "SETTLED") {
              return {
                id: 3,
                name: us === "PAID" ? "Sudah Dibayar (PAID)" : "Sudah Dibayar (SETTLED)",
                desc:
                  "Tautan pembayaran sudah berhasil dibayarkan oleh pelanggan Anda",
                color: "success",
              };
            } else {
              let data = getPaymentStatusArr.find((item) => item.us === us);

              return {
                id: data.value,
                name: data.defaultValue,
                desc: data.desc,
                color: data.color,
              };
            }
          };

          return determinePaymentStatus(us);
        };

        let datas = data.detail.map((item) => {
          return {
            ...item,
            service_datas: getServiceType(
              item.tnos_service_id,
              item.tnos_subservice_id
            ),
            order_status_datas: getOrderStatus(item.status_order),
            payment_status_datas: getPaymentStatus(item.payment_status),
          };
        });

        let totalAmountToday = 0;
        const todayOrder = getDataBetweenDate(
          datas,
          TodayDate() + "T00:00:00",
          TodayDate() + "T23:59:59"
        ).sort(
          (a, b) =>
            new Date(
              b.created_at.split("T")[0] +
              " " +
              b.created_at.split("T")[0].split(".")[0]
            ) -
            new Date(
              a.created_at.split("T")[0] +
              " " +
              a.created_at.split("T")[0].split(".")[0]
            )
        );

        todayOrder.length === 1
          ? (totalAmountToday = parseInt(todayOrder[0].order_total))
          : todayOrder.forEach((item) => {
            totalAmountToday = totalAmountToday + parseInt(item.order_total);
          });

        let extractedData = [];
        extractedData = todayOrder

        let filteredData = extractedData;

        if (selectedFilter === 1) {
          filteredData = filteredData.filter(item => !item.name.includes("Test"));
        } else if (selectedFilter === 2) {
          filteredData = filteredData.filter(item => item.name.includes("Test"));
        }

        setTransactionData(todayOrder);
        setAllTransactionData(datas);
        setTotalAmountToday(totalAmountToday.toLocaleString("id-ID", {}));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedFilter]);

  const updateTransactionData = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const splitDate = (date) => {
      let str = date.split("");
      str[10] = " ";
      str = str.join("");
      return str;
    };
    localStorage.setItem(
      "getStartDatePwaB2bTransaction",
      splitDate(formData.get("start_date_time"))
    );
    localStorage.setItem(
      "getEndDatePwaB2bTransaction",
      splitDate(formData.get("end_date_time"))
    );

    let sortTransactionData = getAllTransactionData.sort(
      (a, b) =>
        new Date(
          b.created_at.split("T")[0] +
          " " +
          b.created_at.split("T")[1].split(".")[0]
        ) -
        new Date(
          a.created_at.split("T")[0] +
          " " +
          a.created_at.split("T")[1].split(".")[0]
        )
    );

    sortTransactionData =
      formData.get("service_type") !== "0"
        ? sortTransactionData.filter(
          (item) =>
            item.service_datas.id === parseInt(formData.get("service_type"))
        )
        : sortTransactionData;

    sortTransactionData =
      formData.get("transaction_status") !== "0"
        ? sortTransactionData.filter(
          (item) =>
            item.payment_status_datas.id ===
            parseInt(formData.get("transaction_status"))
        )
        : sortTransactionData;

    let dataBetween = getDataBetweenDate(
      sortTransactionData,
      formData.get("start_date_time"),
      formData.get("end_date_time")
    );
    setTransactionData(dataBetween);
    let totalAmountBetween = 0;
    dataBetween.forEach((item) => {
      totalAmountBetween = totalAmountBetween + parseInt(item.order_total);
    });
    dataBetween.length === 0 &&
      setMessageEmptyData("Tidak ada transaksi diantara tanggal ini");
    setTotalAmountBetween(totalAmountBetween.toLocaleString("id-ID", {}));
  };

  return (
    <>
      <Preloader show={!getTotalAmountToday ? true : false} />
      <Col xl={12} className="mt-2">
        <Card border="light">
          <Card.Body >
            <Form method="POST" onSubmit={updateTransactionData}>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Tanggal Transaksi</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="datetime-local"
                      name="start_date_time"
                      step="1"
                      defaultValue={TodayDate() + "T00:00:00"}
                      required
                    />
                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      name="end_date_time"
                      step="1"
                      defaultValue={TodayDate() + "T23:59:59"}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Group id="service_type">
                    <Form.Label>Tipe Layanan</Form.Label>
                    <Form.Select name="service_type" required>
                      {getServiceTypeArr?.map((item) => (
                        <option key={item.key} value={item.value}>
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group id="transaction_status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="transaction_status" required>
                      {getPaymentStatusArr?.map((item) => (
                        <option key={item.key} value={item.value}>
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group id="filter_test">
                    <Form.Label>Filter Test?</Form.Label>
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
                <Col>
                  <Form.Label>&nbsp;</Form.Label>
                  <Form.Control
                    className="btn btn-primary"
                    type="submit"
                    name="btn_search_transaction"
                    value="Cari Transaksi"
                  />
                </Col>
              </Row>
            </Form>
            <TnosDataTable
              getServiceTypeArr={getServiceTypeArr}
              getPaymentStatusArr={getPaymentStatusArr}
              getTransactionData={getTransactionData}
              subtitle={
                localStorage.getItem("getStartDatePwaB2bTransaction") ===
                  TodayDate() + " 00:00:00" &&
                  localStorage.getItem("getEndDatePwaB2bTransaction") ===
                  TodayDate() + " 23:59:59"
                  ? ""
                  : `Total ( ${localStorage.getItem(
                    "getStartDatePwaB2bTransaction"
                  )} - ${localStorage.getItem(
                    "getEndDatePwaB2bTransaction"
                  )} ) : IDR ${getTotalAmountBetween}`
              }
              data={
                <>
                  <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th className="border-0 text-center">No.</th>
                      <th className="border-0 text-center">No. Invoice</th>
                      <th className="border-0 text-center">ID Referensi</th>
                      <th className="border-0 text-center">Status Transaksi</th>
                      <th className="border-0 text-center">Status Pemesanan</th>
                      <th className="border-0 text-center">Waktu Pesanan Dibuat</th>
                      <th className="border-0 text-center">Waktu Transaksi</th>
                      <th className="border-0 text-center">Layanan</th>
                      <th className="border-0 text-center">Member</th>
                      <th className="border-0 text-center">Nama Partner</th>
                      <th className="border-0 text-center">
                        Metode Pembayaran
                      </th>
                      <th className="border-0 text-center">Jumlah</th>
                      <th className="border-0">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTransactionData?.length > 0 ? (
                      getTransactionData?.map((td, index) => (
                        <TableRow
                          key={`order-success-${td.id}`}
                          {...td}
                          num={index + 1}
                        />
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colspan={8}>{getMessageEmptyData}</td>
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
  );
};
