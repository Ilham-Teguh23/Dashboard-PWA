import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faMoneyBill,
  faTicketAlt,
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

export default () => {
  const [getOrderData, setOrderData] = useState();
  const [getAllOrderData, setAllOrderData] = useState();
  const [getTotalAmountToday, setTotalAmountToday] = useState();
  const [getTotalAmountBetween, setTotalAmountBetween] = useState();
  const [getMessageEmptyData, setMessageEmptyData] = useState(
    "Belum ada pemesanan pada hari ini"
  );

  const [getServiceTypeArr] = useState([
    {
      key: "service_type_0",
      value: "Semua Layanan",
      defaultValue: "Semua Layanan",
    },
    {
      key: "service_type_1",
      value: "Pengamanan",
      defaultValue: "Semua Pengamanan",
    },
    {
      key: "service_type_2",
      value: "Pengamanan (Silver)",
      defaultValue: "Pengamanan (Silver)",
    },
    {
      key: "service_type_3",
      value: "Pengamanan (Platinum)",
      defaultValue: "Pengamanan (Platinum)",
    },
    {
      key: "service_type_4",
      value: "Pendampingan",
      defaultValue: "Semua Pengacara",
    },
    {
      key: "service_type_5",
      value: "Pengacara (Pendampingan)",
      defaultValue: "Pengacara (Pendampingan)",
    },
    {
      key: "service_type_6",
      value: "Pengacara (Konsultasi)",
      defaultValue: "Pengacara (Konsultasi)",
    },
  ]);

  const TableRow = (props) => {
    const {
      id,
      sid,
      mdisid,
      additional,
      type,
      invoice,
      date_insert,
      membercode,
      mitracode,
      price,
      status,
      servicename,
      gradename,
      enddate,
      endtime,
      other,
    } = props;

    return (
      <tr>
        <td>{props.num}</td>
        <td>{id}</td>
        <td>
          <Link
            to={`/order/on-progress/detail`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              onClick={() => {
                localStorage.setItem("orderIdMaster", id);
              }}
            >
              {sid}
            </span>
          </Link>
          &nbsp;
          {mdisid && (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Pesanan ini menggunakan voucher</Tooltip>}
            >
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-primary"
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
          )}
          &nbsp;
          {additional && (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>{additional}</Tooltip>}
            >
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="text-primary"
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
          )}
        </td>
        <td>{type + invoice}</td>
        <td>
          {date_insert.split("+")[0].split("T")[0].split("-")[2] +
            "-" +
            date_insert.split("+")[0].split("T")[0].split("-")[1] +
            "-" +
            date_insert.split("+")[0].split("T")[0].split("-")[0] +
            " " +
            date_insert.split("+")[0].split("T")[1]}
        </td>
        <td>{"IDR " + parseInt(price).toLocaleString("id-ID", {})}</td>
        <td>
          <a
            href={"/member/profile/" + membercode}
            target="_blank"
            rel="noopener noreferrer"
          >
            {membercode}
          </a>
        </td>
        <td>
          <a
            href={
              servicename === "Pengamanan"
                ? "/partner/guard/profile/" + mitracode
                : "/partner/lawyer/profile/" + mitracode
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {mitracode}
          </a>
        </td>
        <td>
          {type === "TLC"
            ? "Pengacara (Konsultasi)"
            : type === "TL"
              ? "Pengacara (Pendampingan)"
              : servicename}
          {gradename !== "Lawyer"
            ? gradename === "A"
              ? " (Platinum)"
              : " (Silver)"
            : ""}
        </td>
        <td>
          <Badge
            bg={
              status === 1 || status === 2 || status === 3
                ? "primary"
                : status === 990
                  ? "blue"
                  : ""
            }
            className="badge-lg"
          >
            {status === 1
              ? "Menerima Pesanan"
              : status === 2
                ? "Dalam Perjalanan"
                : status === 3
                  ? "Hadir dan Sedang Bertugas"
                  : status === 990
                    ? "Sedang Berlangsung"
                    : ""}
          </Badge>
        </td>
        <td>{type === "TLC" ? other : enddate + " " + endtime}</td>
        <td>
          <Link
            to={`/order/on-progress/detail`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              size="sm"
              className="text-white"
              onClick={() => {
                localStorage.setItem("orderIdMaster", id);
              }}
            >
              <FontAwesomeIcon icon={faThList} />
            </Button>
          </Link>
        </td>
      </tr>
    );
  };

  const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const getDataBetweenDate = (datas, startDate, endDate) => {
    return JSON.parse(datas).filter(
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
    );
  };

  useEffect(() => {
    localStorage.setItem("getStartDateOrder", getTodayDate() + " 00:00:00");
    localStorage.setItem("getEndDateOrder", getTodayDate() + " 23:59:59");

    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/order/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let datas = data.data.filter(
          (item) =>
            item.status === 1 ||
            item.status === 2 ||
            item.status === 3 ||
            item.status === 990
        );
        let totalAmountToday = 0;

        const todayOrder = getDataBetweenDate(
          JSON.stringify(datas),
          getTodayDate() + "T00:00:00",
          getTodayDate() + "T23:59:59"
        ).sort(
          (a, b) =>
            new Date(
              b.date_insert.split("+")[0].split("T")[0] +
              " " +
              b.date_insert.split("+")[0].split("T")[1]
            ) -
            new Date(
              a.date_insert.split("+")[0].split("T")[0] +
              " " +
              a.date_insert.split("+")[0].split("T")[1]
            )
        );

        todayOrder.length === 1
          ? (totalAmountToday = parseInt(todayOrder[0].price))
          : todayOrder.forEach((item) => {
            totalAmountToday = totalAmountToday + parseInt(item.price);
          });

        setOrderData(todayOrder);
        setAllOrderData(datas);
        setTotalAmountToday(totalAmountToday.toLocaleString("id-ID", {}));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateOrderDate = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const splitDate = (date) => {
      let str = date.split("");
      str[10] = " ";
      str = str.join("");
      return str;
    };
    localStorage.setItem(
      "getStartDateOrder",
      splitDate(formData.get("start_date_time"))
    );
    localStorage.setItem(
      "getEndDateOrder",
      splitDate(formData.get("end_date_time"))
    );

    let sortOrderData = getAllOrderData.sort(
      (a, b) =>
        new Date(
          b.date_insert.split("+")[0].split("T")[0] +
          " " +
          b.date_insert.split("+")[0].split("T")[1]
        ) -
        new Date(
          a.date_insert.split("+")[0].split("T")[0] +
          " " +
          a.date_insert.split("+")[0].split("T")[1]
        )
    );
    let orderDataWithStatus =
      formData.get("service_type") === "Semua Layanan"
        ? sortOrderData
        : formData.get("service_type") === "Pengamanan (Silver)"
          ? sortOrderData.filter(
            (item) =>
              item.servicename === "Pengamanan" && item.gradename === "C"
          )
          : formData.get("service_type") === "Pengamanan (Platinum)"
            ? sortOrderData.filter(
              (item) =>
                item.servicename === "Pengamanan" && item.gradename === "A"
            )
            : formData.get("service_type") === "Pengacara (Pendampingan)"
              ? sortOrderData.filter(
                (item) =>
                  item.servicename === "Pendampingan" &&
                  item.gradename === "Lawyer" &&
                  item.type === "TL"
              )
              : formData.get("service_type") === "Pengacara (Konsultasi)"
                ? sortOrderData.filter(
                  (item) =>
                    item.servicename === "Pendampingan" &&
                    item.gradename === "Lawyer" &&
                    item.type === "TLC"
                )
                : sortOrderData.filter(
                  (item) => item.servicename === formData.get("service_type")
                );

    setOrderData(
      getDataBetweenDate(
        JSON.stringify(orderDataWithStatus),
        formData.get("start_date_time"),
        formData.get("end_date_time")
      )
    );
    let totalAmountBetween = 0;
    getDataBetweenDate(
      JSON.stringify(orderDataWithStatus),
      formData.get("start_date_time"),
      formData.get("end_date_time")
    ).forEach((item) => {
      totalAmountBetween = totalAmountBetween + parseInt(item.price);
    });
    getDataBetweenDate(
      JSON.stringify(orderDataWithStatus),
      formData.get("start_date_time"),
      formData.get("end_date_time")
    ).length === 0 &&
      setMessageEmptyData("Tidak ada transaksi diantara tanggal ini");
    setTotalAmountBetween(totalAmountBetween.toLocaleString("id-ID", {}));
  };
  return (
    <>
      <Preloader show={!getTotalAmountToday ? true : false} />
      <Col xl={12} className="mt-2">
        <Card border="light">
          <Card.Body>
            <Form method="POST" onSubmit={updateOrderDate}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Tanggal Pemesanan</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="datetime-local"
                      name="start_date_time"
                      step="1"
                      defaultValue={getTodayDate() + "T00:00:00"}
                      required
                    />
                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      name="end_date_time"
                      step="1"
                      defaultValue={getTodayDate() + "T23:59:59"}
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
                <Col>
                  <Form.Label>&nbsp;</Form.Label>
                  <Form.Control
                    className="btn btn-primary"
                    type="submit"
                    name="btn_search_transaction"
                    value="Cari Pemesanan"
                  />
                </Col>
              </Row>
            </Form>
            <TnosDataTable
              title={`Total pemesanan hari ini : IDR ${getTotalAmountToday}`}
              subtitle={
                localStorage.getItem("getStartDateOrder") ===
                  getTodayDate() + " 00:00:00" &&
                  localStorage.getItem("getEndDateOrder") ===
                  getTodayDate() + " 23:59:59"
                  ? ""
                  : `Total pemesanan ( ${localStorage.getItem(
                    "getStartDateOrder"
                  )} - ${localStorage.getItem(
                    "getEndDateOrder"
                  )} ) : IDR ${getTotalAmountBetween}`
              }
              getExportData={getOrderData}
              getMenu={`order-on-progress`}
              data={
                <>
                  <thead className="thead-light">
                    <tr>
                      <th className="border-0">No.</th>
                      <th className="border-0">Id</th>
                      <th className="border-0">Id Pemesanan</th>
                      <th className="border-0">No. Invoice</th>
                      <th className="border-0">Waktu Pemesanan</th>
                      <th className="border-0">Jumlah</th>
                      <th className="border-0">Kode Member</th>
                      <th className="border-0">Kode Mitra</th>
                      <th className="border-0">Tipe Mitra</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Waktu Selesai</th>
                      <th className="border-0">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOrderData?.length > 0 ? (
                      getOrderData?.map((td, index) => (
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
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
