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
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default () => {
  const { id } = useParams();
  const [getOrderData, setOrderData] = useState();

  // Calc Amount Func
  const calcAmount = (amount, times = true) => {
    const am = times ? amount * 10000 : amount;
    return "IDR " + am.toLocaleString("id-ID", {});
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

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/order-voucher/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          const datas = data.point_histories;

          setOrderData({
            "Detail Voucher": {
              Id: datas.id,
              "Id Saldo Voucher Pembayaran": datas.tsaldo_point_payment_id,
              "Id Pengguna": iconLink(
                datas.user_id,
                `/member/profile/${datas.user_id}`
              ),
              "Voucher Masuk": calcAmount(datas.in_point),
              "Voucher Keluar": calcAmount(datas.out_point),
              "Voucher Sebelumnya": calcAmount(datas.before_point),
              "Sisa Voucher": calcAmount(datas.point),
              "Tanggal Dibuat": datas.created_at,
              "Tanggal Diupdate": datas.updated_at,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <>
      <Row>
        <Preloader show={!getOrderData ? true : false} />
        <Row className="mt-4"></Row>
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{
            className: "breadcrumb-dark breadcrumb-transparent",
          }}
        >
          <Breadcrumb.Item href="/pwa-b2b/transaction">Voucher</Breadcrumb.Item>
          <Breadcrumb.Item active>Detail Voucher</Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <Row className="detail-list">
                <Col md={6}>
                  {getOrderData &&
                    Object.entries(getOrderData).map(
                      ([groupName, groupObject]) => (
                        <div>
                          <h6 key={groupName}>{groupName}</h6>
                          {Object.entries(groupObject).map(([key, value]) => (
                            <span key={key}>
                              <small>{key}</small>
                              <p>{!value ? "-" : value}</p>
                            </span>
                          ))}
                        </div>
                      )
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
