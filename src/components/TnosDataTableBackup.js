import React, { useState } from "react";
import ReactExport from "react-export-excel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faPlus,
  faSignOutAlt,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Table,
  Button,
} from "@themesberg/react-bootstrap";
import ReadableDateTime from "./ReadableDateTime";
import { Link, useLocation } from "react-router-dom";
import MyModal from "./MyModal";
import MyModalTAB from "./MyModalTAB";
import { logDOM } from "@testing-library/react";

export const TnosDataTableBackup = (props) => {

  const location = useLocation()
  const isSecurityProviderRoute = location.pathname === "/pwa-b2b/security-provider" || location.pathname.startsWith("/pwa-b2b/security-provider/") || location.pathname.startsWith("/pwa-b2b/layanan/") || location.pathname.startsWith("/pwa-b2b/section");
  const isTAB = location.pathname === "/tab/kategori-usaha" || location.pathname === "/tab/banner";

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const { getTransactionData } = props;
  const { getOrderData } = props;

  const startDate = localStorage.getItem("getStartDatePwaB2bTransaction")
  const endDate = localStorage.getItem("getEndDatePwaB2bTransaction")

  const humanizeText = (str) => {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Row className="mb-3">
          <Col>
            <h6 className="mb-n1">{props.title}</h6>
            <small>{props.subtitle}</small>
          </Col>
          <Col
            xs={12}
            style={{ textAlign: "right" }}
            className={props.reload === false ? "d-none" : ""}
          >
            <ExcelFile
              element={
                <Button variant="success" size="sm" className="text-white mb-2">
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    style={{ marginRight: "10px" }}
                  />{" "}
                  Export Excel
                </Button>
              }
              filename={
                  location.pathname.includes("/tab/transaksi") ? 'TAB_Transaksi' : `transaction_(${startDate} - ${endDate})`}>
              
                {location.pathname.includes("/tab/transaksi") ? (
                  <>
                    <ExcelSheet data={props.getExportTransaksiTAB} name="Data Transaksi TAB">
                      <ExcelColumn
                        label="Member Code"
                        value={(col) => col.member_code}
                      />
                    </ExcelSheet>
                  </>
                ) : (
                  <>
                  
                  </>
                ) }  
              {/* {getTransactionData != undefined ? (
                <ExcelSheet data={getTransactionData} name="Data Transaksi">
                  <ExcelColumn
                    label="NO. INVOICE"
                    value={(col) =>
                      col.tnos_invoice_id ? col.tnos_invoice_id : "Tidak Ada"
                    }
                  />
                  <ExcelColumn
                    label="ID REFERENSI"
                    value={(col) => col.external_id}
                  />
                  <ExcelColumn
                    label="STATUS TRANSAKSI"
                    value={(col) => col.payment_status_datas.name}
                  />
                  <ExcelColumn
                    label="STATUS PEMESANAN"
                    value={(col) =>
                      col.payment_status_datas.name == "Kadaluarsa"
                        ? "Tidak Ada"
                        : col.order_status_datas.name
                    }
                  />
                  <ExcelColumn
                    label="WAKTU PESANAN DIBUAT"
                    value={(col) => ReadableDateTime(col.created_at)}
                  />
                  <ExcelColumn
                    label="WAKTU TRANSAKSI"
                    value={(col) =>
                      col.paid_at == null
                        ? "Tidak Ada"
                        : ReadableDateTime(col.paid_at)
                    }
                  />
                  <ExcelColumn
                    label="LAYANAN"
                    value={(col) => col.service_datas.name}
                  />
                  <ExcelColumn label="MEMBER" value={(col) => col.name} />
                  <ExcelColumn
                    label="NAMA PARTNER"
                    value={(col) =>
                      col.partner_name == null ? "Tidak Ada" : col.partner_name
                    }
                  />
                  <ExcelColumn
                    label="METODE PEMBAYARAN"
                    value={(col) =>
                      col.payment_method
                        ? humanizeText(col.payment_method)
                        : "Tidak Ada"
                    }
                  />
                  <ExcelColumn
                    label="JUMLAH"
                    value={(col) =>
                      "IDR " +
                      parseInt(col.order_total).toLocaleString("id-ID", {})
                    }
                  />
                </ExcelSheet>
              ) : (
                <ExcelSheet data={getOrderData} name="Data Transaksi Order">
                  <ExcelColumn
                    label="NOMOR INVOICE"
                    value={(col) =>
                      col.tnos_invoice_id ? col.tnos_invoice_id : "Tidak Ada"
                    }
                  />
                  <ExcelColumn
                    label="ID REFERENSI"
                    value={(col) => col.external_id}
                  />
                  <ExcelColumn
                    label="WAKTU TRANSAKSI"
                    value={(col) =>
                      col.paid_at == null
                        ? "Tidak Ada"
                        : ReadableDateTime(col.paid_at)
                    }
                  />
                  <ExcelColumn
                    label="STATUS PEMESANAN"
                    value={(col) =>
                      col.payment_status_datas.name == "Kadaluarsa"
                        ? "Tidak Ada"
                        : col.order_status_datas.name
                    }
                  />
                  <ExcelColumn
                    label="LAYANAN"
                    value={(col) => col.service_datas.name}
                  />
                  <ExcelColumn label="MEMBER" value={(col) => col.name} />
                  <ExcelColumn
                    label="PARTNER"
                    value={(col) =>
                      col.partner_name == null ? "Tidak Ada" : col.partner_name
                    }
                  />
                  <ExcelColumn
                    label="JUMLAH"
                    value={(col) =>
                      "IDR " +
                      parseInt(col.order_total).toLocaleString("id-ID", {})
                    }
                  />
                </ExcelSheet>
              )} */}
            </ExcelFile>
            <Link
              onClick={() => {
                window.location.reload();
              }}
              className="ms-2"
            >
              <Button variant="info" size="sm" className="text-white mb-2">
                <FontAwesomeIcon icon={faSync} style={{ marginRight: '10px' }} /> Muat Ulang
              </Button>
            </Link>

            {isSecurityProviderRoute ? (
              <>
                <Button variant="success" size="sm" className="text-white mb-2" onClick={handleShow} style={{ marginLeft: '10px' }} >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '7px' }} /> Tambah
                </Button>
              </>
            ) : isTAB ? (
              <>
                <Button variant="success" size="sm" className="text-white mb-2" onClick={handleShow} style={{ marginLeft: '10px' }} >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '7px' }} /> Tambah
                </Button>
              </>
            ) : (
              ""
            )}
          </Col>
        </Row>
        {/* <Link to="Hamdan" className="ms-2">
          <Button variant="warning" size="sm" className="text-white">
            <FontAwesomeIcon icon={faPencilAlt} />
          </Button>
        </Link> */}
        {props.alert}
        <div className="tnos-data-table">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0"
          >
            {props.data}
          </Table>
        </div>
      </Card.Body>

      {isSecurityProviderRoute ? (
        <MyModal show={showModal} handleClose={handleClose} />
      ) : isTAB ? (
        <MyModalTAB show={showModal} handleClose={handleClose} />
      ) : (
        <></>
      )}

    </Card>
  );
};
