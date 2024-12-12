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
  const [getOrderDetailData, setOrderDetailData] = useState();

  // ExcelFile

  useEffect(() => {
    setOrderDetailData(JSON.parse(localStorage.getItem("pwaB2bOrderDataById")));
  }, []);

  const ifNotNull = (field, type = "normal", optionArr = "normal") => {
    let updateField = field;

    if (!field) {
      return "-";
    }

    if (type === "curr") {
      updateField = `IDR ${parseInt(field).toLocaleString("id-ID", {})}`;
    }

    if (type === "option") {
      updateField = optionArr?.map(
        (item) => field === item.value && item.defaultValue
      );
    }

    if (type === "obj") {
      updateField = JSON.parse(field)[optionArr];
    }

    if (type === "saham") {
      const data = JSON.parse(field);
      const output = data
        .map((item) => `${item.name}: ${item.persentase}%`)
        .join(", ");
      return output;
    }

    if (type === "sunder") {
      const data = JSON.parse(field);
      const output = data
        .map((item) => `${item.jabatan}: ${item.name}`)
        .join(", ");
      return output;
    }

    if (type === "bidus") {
      const data = JSON.parse(field);
      const output = data.map((item) => `${item.value}`).join(", ");
      return output;
    }

    if (type === "objArr") {
      const parsedData = JSON.parse(field);
      const options = parsedData.map((item) => item[optionArr]);
      return options.join(", ");
    }

    if (type === "sahamCard") {
      const data = JSON.parse(field);
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.name}: {item.persentase}%
          <br />
        </span>
      ));
      return output;
    }

    if (type === "sunderCard") {
      const data = JSON.parse(field);
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.jabatan}: {item.name}
          <br />
        </span>
      ));
      return output;
    }

    if (type === "bidusCard") {
      const data = JSON.parse(field);
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.value}
          <br />
        </span>
      ));
      return output;
    }

    if (type === "objArrCard") {
      const parsedData = JSON.parse(field);
      const options = parsedData.map((item, index) => (
        <span>
          {index + 1}. {item[optionArr]}
          <br />
        </span>
      ));
      return options;
    }

    if (type === "address") {
      let addressObj = JSON.parse(field);

      if (optionArr === "dom") {
        return addressObj.domisili_sekarang;
      }

      let order = [
        "jalan",
        "rt",
        "rw",
        "kelurahan.label",
        "kecamatan.label",
        "kabupaten.label",
        "provinsi.label",
        "kode_pos",
      ];

      let result = order.map((item) => {
        let keys = item.split(".");
        let value = addressObj[keys[0]];

        if (keys.length > 1 && value) {
          value = value[keys[1]];
        }

        if (keys[0] === "rt") {
          value = "RT " + value;
        } else if (keys[0] === "rw") {
          value = "RW " + value;
        }

        return value ? value : "";
      });

      return result.filter((item) => item !== "").join(", ");
    }

    if (type === "dom") {
    }

    return updateField;
  };

  console.log(getOrderDetailData);

  return (
    <>
      <Row>
        <Preloader show={!getOrderDetailData ? true : false} />
        <Row className="mt-4"></Row>
        <Breadcrumb
          className="d-none d-md-inline-block"
          listProps={{
            className: "breadcrumb-dark breadcrumb-transparent",
          }}
        >
          <Breadcrumb.Item href="/pwa-b2b/order">
            Daftar Pesanan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Detail Pesanan</Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>
                    Detail Pemesanan &nbsp;
                    {/* {getOrderDetailData?.service_datas.id === 2 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="Jenis Badan Usaha"
                            value={(col) =>
                              ifNotNull(col.klasifikasi, "obj", "label")
                            }
                          />
                          <ExcelColumn
                            label="KTP & NPWP Seluruh pemegang saham"
                            value={(col) =>
                              ifNotNull(
                                col.file_document,
                                "objArr",
                                "image_url"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Nama Usaha"
                            value={(col) =>
                              ifNotNull(col.name_badan_hukum, "objArr", "opsi")
                            }
                          />
                          <ExcelColumn
                            label="Modal Dasar Perusahaan (Fiktif)"
                            value={(col) => ifNotNull(col.modal_dasar, "curr")}
                          />
                          <ExcelColumn
                            label="Jumlah modal yang disetor (Min.25%)"
                            value={(col) =>
                              ifNotNull(col.modal_disetor, "curr")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Pemegang Saham(Tuan/Nyonya ______ sebanyak ___ %)"
                            value={(col) =>
                              ifNotNull(col.pemegang_saham, "saham")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Direksi dan Komisaris"
                            value={(col) =>
                              ifNotNull(col.susunan_direksi, "sunder")
                            }
                          />
                          <ExcelColumn
                            label="Bidang Usaha KBLI 2020"
                            value={(col) =>
                              ifNotNull(col.bidang_usaha, "bidus")
                            }
                          />
                          <ExcelColumn
                            label="Email Usaha"
                            value={(col) => ifNotNull(col.email_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Nomor HP Penanggung Jawab"
                            value={(col) => ifNotNull(col.phone_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Domisili Usaha"
                            value={(col) =>
                              ifNotNull(
                                col.alamat_badan_hukum,
                                "address",
                                "dom"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Detail Alamat"
                            value={(col) =>
                              ifNotNull(col.alamat_badan_hukum, "address")
                            }
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )} */}
                    {/* {getOrderDetailData?.service_datas.id === 3 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="KTP & NPWP Seluruh pemegang saham"
                            value={(col) =>
                              ifNotNull(
                                col.file_document,
                                "objArr",
                                "image_url"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Nama Usaha"
                            value={(col) =>
                              ifNotNull(col.name_badan_hukum, "objArr", "opsi")
                            }
                          />
                          <ExcelColumn
                            label="Modal Dasar Perusahaan (Fiktif)"
                            value={(col) => ifNotNull(col.modal_dasar, "curr")}
                          />
                          <ExcelColumn
                            label="Jumlah modal yang disetor (Min.25%)"
                            value={(col) =>
                              ifNotNull(col.modal_disetor, "curr")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Pemegang Saham(Tuan/Nyonya ______ sebanyak ___ %)"
                            value={(col) =>
                              ifNotNull(col.pemegang_saham, "saham")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Direksi dan Komisaris"
                            value={(col) =>
                              ifNotNull(col.susunan_direksi, "sunder")
                            }
                          />
                          <ExcelColumn
                            label="Bidang Usaha KBLI 2020"
                            value={(col) =>
                              ifNotNull(col.bidang_usaha, "bidus")
                            }
                          />
                          <ExcelColumn
                            label="Email Usaha"
                            value={(col) => ifNotNull(col.email_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Nomor HP Penanggung Jawab"
                            value={(col) => ifNotNull(col.phone_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Domisili Usaha"
                            value={(col) =>
                              ifNotNull(
                                col.alamat_badan_hukum,
                                "address",
                                "dom"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Detail Alamat"
                            value={(col) =>
                              ifNotNull(col.alamat_badan_hukum, "address")
                            }
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )}
                    {getOrderDetailData?.service_datas.id === 4 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="KTP & NPWP Seluruh Pengurus"
                            value={(col) =>
                              ifNotNull(
                                col.file_document,
                                "objArr",
                                "image_url"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Nama Yayasan"
                            value={(col) =>
                              ifNotNull(col.name_badan_hukum, "objArr", "opsi")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Pengurus"
                            value={(col) =>
                              ifNotNull(col.susunan_direksi, "sunder")
                            }
                          />
                          <ExcelColumn
                            label="Bidang Usaha KBLI 2020"
                            value={(col) =>
                              ifNotNull(col.bidang_usaha, "bidus")
                            }
                          />
                          <ExcelColumn
                            label="Email Yayasan"
                            value={(col) => ifNotNull(col.email_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Nomor HP Penanggung Jawab"
                            value={(col) => ifNotNull(col.phone_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Domisili Yayasan"
                            value={(col) =>
                              ifNotNull(
                                col.alamat_badan_hukum,
                                "address",
                                "dom"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Detail Alamat"
                            value={(col) =>
                              ifNotNull(col.alamat_badan_hukum, "address")
                            }
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )}
                    {getOrderDetailData?.service_datas.id === 5 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="KTP & NPWP Seluruh Pengurus"
                            value={(col) =>
                              ifNotNull(
                                col.file_document,
                                "objArr",
                                "image_url"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Nama Perkumpulan"
                            value={(col) =>
                              ifNotNull(col.name_badan_hukum, "objArr", "opsi")
                            }
                          />
                          <ExcelColumn
                            label="Susunan Pengurus"
                            value={(col) =>
                              ifNotNull(col.susunan_direksi, "sunder")
                            }
                          />
                          <ExcelColumn
                            label="Bidang Usaha KBLI 2020"
                            value={(col) =>
                              ifNotNull(col.bidang_usaha, "bidus")
                            }
                          />
                          <ExcelColumn
                            label="Email Perkumpulan"
                            value={(col) => ifNotNull(col.email_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Nomor HP Penanggung Jawab"
                            value={(col) => ifNotNull(col.phone_badan_hukum)}
                          />
                          <ExcelColumn
                            label="Domisili Perkumpulan"
                            value={(col) =>
                              ifNotNull(
                                col.alamat_badan_hukum,
                                "address",
                                "dom"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Detail Alamat"
                            value={(col) =>
                              ifNotNull(col.alamat_badan_hukum, "address")
                            }
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )}
                    {getOrderDetailData?.service_datas.id === 7 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="Keperluan"
                            value={(col) => ifNotNull(col.needs)}
                          />
                          <ExcelColumn
                            label="Biaya"
                            value={(col) => ifNotNull(col.order_total, "curr")}
                          />
                          <ExcelColumn
                            label="Dokumen Tambahan"
                            value={(col) =>
                              ifNotNull(
                                col.file_document,
                                "objArr",
                                "image_url"
                              )
                            }
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )}
                    {getOrderDetailData?.service_datas.id === 1 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="Keperluan Pengamanan"
                            value={(col) => ifNotNull(col.needs)}
                          />
                          <ExcelColumn
                            label="Rincian Lokasi"
                            value={(col) => ifNotNull(col.location)}
                          />
                          <ExcelColumn
                            label="Tanggal & Waktu Mulai"
                            value={(col) =>
                              ReadableDateTime(
                                ifNotNull(col.time),
                                "shortMonth"
                              )
                            }
                          />
                          <ExcelColumn
                            label="Jumlah Pengaman"
                            value={(col) =>
                              `${ifNotNull(col.jml_personil)} Personel`
                            }
                          />
                          <ExcelColumn
                            label="Durasi Pesanan"
                            value={(col) => `${ifNotNull(col.duration)} Jam`}
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )}
                    {getOrderDetailData?.service_datas.id === 8 && (
                      <ExcelFile
                        element={
                          <Badge
                            bg="primary"
                            className="badge-md"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                          </Badge>
                        }
                        filename={`transaction_order_${getOrderDetailData?.id}`}
                      >
                        <ExcelSheet
                          data={[getOrderDetailData]}
                          name="Data Transaksi"
                        >
                          <ExcelColumn
                            label="Id Pemesanan"
                            value={(col) => ifNotNull(col.id)}
                          />
                          <ExcelColumn
                            label="Tipe Layanan"
                            value={(col) => ifNotNull(col.service_datas.name)}
                          />
                          <ExcelColumn
                            label="Nama Pengguna"
                            value={(col) =>
                              `${ifNotNull(col.name)} (${ifNotNull(
                                col.user_id
                              )})`
                            }
                          />
                          <ExcelColumn
                            label="Waktu Transaksi"
                            value={(col) =>
                              ifNotNull(
                                ReadableDateTime(col.created_at, "shortMonth")
                              )
                            }
                          />
                          <ExcelColumn
                            label="Status Pemesanan"
                            value={(col) =>
                              `${ifNotNull(
                                col.order_status_datas.name
                              )} (${ifNotNull(col.order_status_datas.desc)})`
                            }
                          />
                          <ExcelColumn
                            label="Permasalahan Hukum"
                            value={(col) => ifNotNull(col.needs)}
                          />
                        </ExcelSheet>
                      </ExcelFile>
                    )} */}
                    &nbsp;
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
                            JSON.stringify(getOrderDetailData)
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faPrint} /> Export PDF
                      </Badge>
                    </Link>
                  </h6>
                  <Row>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Tipe Layanan</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.service_datas.name}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Nama Pengguna</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.name}
                        &nbsp;
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          overlay={<Tooltip>Lihat</Tooltip>}
                        >
                          <Link
                            to={`/member/profile/${getOrderDetailData?.user_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </Link>
                        </OverlayTrigger>
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Id Pemesanan</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.id}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Nama Partner</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.partner_name == null ? '-' : getOrderDetailData?.partner_name }
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}> No. Invoice </small>
                      <br />
                      {getOrderDetailData?.tnos_invoice_id ? (
                        <p style={{ fontWeight: "bold" }}>
                          {getOrderDetailData?.tnos_invoice_id}
                        </p>
                      ) : (
                        <Badge bg="primary" className="badge-lg">
                          Memesan &nbsp;
                          <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip>
                                Memesan tapi belum masuk ke pembayaran
                              </Tooltip>
                            }
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              style={{ cursor: "pointer" }}
                            />
                          </OverlayTrigger>
                        </Badge>
                      )}
                    </Col>

                    {getOrderDetailData?.invoice_id && (
                      <Col md={6}>
                        <small style={{ color: "#7376A1" }}>ID Transaksi</small>
                        <p style={{ fontWeight: "bold" }}>
                          {getOrderDetailData?.invoice_id}
                        </p>
                      </Col>
                    )}
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>ID Referensi</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.external_id}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Waktu Pemesanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ReadableDateTime(
                          getOrderDetailData?.created_at,
                          "shortMonth"
                        )}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Waktu Transaksi
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.paid_at == null ? (
                          <Badge bg="primary" className="badge-lg">
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
                          </Badge>
                        ) : (
                          ReadableDateTime(
                            getOrderDetailData.paid_at,
                            "shortMonth"
                          )
                        )}
                      </p>
                    </Col>
                  </Row>
                  <small style={{ color: "#7376A1" }}>Status Pemesanan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {getOrderDetailData?.order_status_datas.name}
                    &nbsp;
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      overlay={
                        <Tooltip>
                          {getOrderDetailData?.order_status_datas.desc}
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
                <Col md={6} className="mb-3">
                  <h6>Detail Layanan</h6>
                  {getOrderDetailData?.service_datas.id === 9 ? (
                    <>
                      <small style={{ color: "#7376A1" }}>Keperluan</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.needs}
                      </p>
                      <small style={{ color: "#7376A1" }}>Rincian Lokasi</small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.location)}
                      </p>
                      <Row>
                        <Col>
                          <small style={{ color: "#7376A1" }}>
                            Tanggal & Waktu Mulai
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ReadableDateTime(
                              ifNotNull(
                                getOrderDetailData?.tanggal_mulai +
                                  " " +
                                  getOrderDetailData?.jam_mulai
                              ),
                              "shortMonth"
                            )}
                          </p>
                        </Col>
                        <Col>
                          <small style={{ color: "#7376A1" }}>
                            Penanggung Jawab
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(getOrderDetailData?.nama_pic)} -{" "}
                            {ifNotNull(getOrderDetailData?.nomor_pic)}
                          </p>
                        </Col>
                      </Row>
                      <small style={{ color: "#7376A1" }}>
                        Jumlah Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {`${ifNotNull(
                          getOrderDetailData?.jml_personil
                        )} Personel`}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Durasi Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {`${ifNotNull(
                          getOrderDetailData?.durasi_pengamanan
                        )} Jam`}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                  {getOrderDetailData?.service_datas.id === 10 ||
                  getOrderDetailData?.service_datas.id === 11 ? (
                    <>
                      <small style={{ color: "#7376A1" }}>
                        Keperluan Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.needs)}
                      </p>
                      <small style={{ color: "#7376A1" }}>Rincian Lokasi</small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.location)}
                      </p>
                      <Row>
                        <Col>
                          <small style={{ color: "#7376A1" }}>
                            Tanggal & Waktu Mulai
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ReadableDateTime(
                              ifNotNull(
                                getOrderDetailData?.tanggal_mulai +
                                  " " +
                                  getOrderDetailData?.jam_mulai
                              ),
                              "shortMonth"
                            )}
                          </p>
                        </Col>
                        <Col>
                          <small style={{ color: "#7376A1" }}>
                            Penanggung Jawab
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(getOrderDetailData?.nama_pic)} -{" "}
                            {ifNotNull(getOrderDetailData?.nomor_pic)}
                          </p>
                        </Col>
                      </Row>
                      <small style={{ color: "#7376A1" }}>
                        Jumlah Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {`${ifNotNull(
                          getOrderDetailData?.jml_personil
                        )} Personel`}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Durasi Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {`${ifNotNull(
                          getOrderDetailData?.durasi_pengamanan
                        )} Jam`}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                  {getOrderDetailData?.service_datas.id === 2 ||
                  getOrderDetailData?.service_datas.id === 3 ||
                  getOrderDetailData?.service_datas.id === 4 ||
                  getOrderDetailData?.service_datas.id === 5 ? (
                    <>
                      {getOrderDetailData?.service_datas.id === 2 && (
                        <>
                          <small style={{ color: "#7376A1" }}>
                            Jenis Badan Usaha
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(
                              getOrderDetailData?.klasifikasi,
                              "obj",
                              "label"
                            )}
                          </p>
                        </>
                      )}
                      <small style={{ color: "#7376A1" }}>
                        KTP & NPWP Seluruh{" "}
                        {getOrderDetailData?.service_datas.id === 2 ||
                        getOrderDetailData?.service_datas.id === 3
                          ? "Pemegang Saham"
                          : "Pengurus"}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.file_document
                          ? JSON.parse(getOrderDetailData?.file_document).map(
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
                      <small style={{ color: "#7376A1" }}>
                        Nama{" "}
                        {getOrderDetailData?.service_datas.id === 2 ||
                        getOrderDetailData?.service_datas.id === 3
                          ? "Usaha"
                          : getOrderDetailData?.service_datas.id === 4
                          ? "Yayasan"
                          : getOrderDetailData?.service_datas.id === 5
                          ? "Perkumpulan"
                          : ""}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(
                          getOrderDetailData?.name_badan_hukum,
                          "objArrCard",
                          "opsi"
                        )}
                      </p>
                      {getOrderDetailData?.service_datas.id === 2 ||
                      getOrderDetailData?.service_datas.id === 3 ? (
                        <>
                          <small style={{ color: "#7376A1" }}>
                            Modal Dasar Perusahaan (Fiktif)
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(getOrderDetailData?.modal_dasar, "curr")}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Jumlah modal yang disetor (Min.25%)
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(
                              getOrderDetailData?.modal_disetor,
                              "curr"
                            )}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Susunan Pemegang Saham(Tuan/Nyonya ______ sebanyak
                            ___ %)
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(
                              getOrderDetailData?.pemegang_saham,
                              "sahamCard"
                            )}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                      <small style={{ color: "#7376A1" }}>
                        Susunan{" "}
                        {getOrderDetailData?.service_datas.id === 2 ||
                        getOrderDetailData?.service_datas.id === 3
                          ? "Direksi dan Komisaris"
                          : "Pengurus"}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(
                          getOrderDetailData?.susunan_direksi,
                          "sunderCard"
                        )}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Bidang Usaha KBLI 2020
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(
                          getOrderDetailData?.bidang_usaha,
                          "bidusCard"
                        )}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Email{" "}
                        {getOrderDetailData?.service_datas.id === 2 ||
                        getOrderDetailData?.service_datas.id === 3
                          ? "Usaha"
                          : getOrderDetailData?.service_datas.id === 4
                          ? "Yayasan"
                          : getOrderDetailData?.service_datas.id === 5
                          ? "Perkumpulan"
                          : ""}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.email_badan_hukum)}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Nomor HP Penanggung Jawab
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.phone_badan_hukum)}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Domisili{" "}
                        {getOrderDetailData?.service_datas.id === 2 ||
                        getOrderDetailData?.service_datas.id === 3
                          ? "Usaha"
                          : getOrderDetailData?.service_datas.id === 4
                          ? "Yayasan"
                          : getOrderDetailData?.service_datas.id === 5
                          ? "Perkumpulan"
                          : ""}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(
                          getOrderDetailData?.alamat_badan_hukum,
                          "address",
                          "dom"
                        )}
                      </p>
                      <small style={{ color: "#7376A1" }}>Detail Alamat</small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(
                          getOrderDetailData?.alamat_badan_hukum,
                          "address"
                        )}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                  {getOrderDetailData?.service_datas.id === 7 ||
                  getOrderDetailData?.service_datas.id === 1 ||
                  getOrderDetailData?.service_datas.id === 8 ? (
                    <>
                      <small style={{ color: "#7376A1" }}>
                        {getOrderDetailData?.service_datas.id === 7 || getOrderDetailData.service_datas.id === 8
                          ? "Keperluan"
                          : getOrderDetailData?.service_datas.id === 1
                          ? "Keperluan Pengamanan"
                          : ""}
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.needs)}
                      </p>

                      {getOrderDetailData?.service_datas.id === 7 && (
                        <>
                          <small style={{ color: "#7376A1" }}>Biaya</small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(getOrderDetailData?.order_total, "curr")}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Dokumen Tambahan
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {getOrderDetailData?.file_document
                              ? JSON.parse(
                                  getOrderDetailData?.file_document
                                ).map((item) => {
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
                                })
                              : "-"}
                          </p>
                        </>
                      )}
                      {getOrderDetailData?.service_datas.id === 1 && (
                        <>
                          <small style={{ color: "#7376A1" }}>
                            Rincian Lokasi
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ifNotNull(getOrderDetailData?.location)}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Tanggal & Waktu Mulai
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {ReadableDateTime(
                              ifNotNull(getOrderDetailData?.time),
                              "shortMonth"
                            )}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Jumlah Pengaman
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {`${ifNotNull(
                              getOrderDetailData?.jml_personil
                            )} Personel`}
                          </p>
                          <small style={{ color: "#7376A1" }}>
                            Durasi Pesanan
                          </small>
                          <p style={{ fontWeight: "bold" }}>
                            {`${ifNotNull(getOrderDetailData?.duration)} Jam`}
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  {getOrderDetailData?.service_datas.id === 6 ? (
                    <>
                      <small style={{ color: "#7376A1" }}>Keperluan</small>
                      <p style={{ fontWeight: "bold" }}>
                        {getOrderDetailData?.needs}
                      </p>
                    </>
                  ) : "" }

                  <h6>Detail Pembayaran</h6>
                  <Row>
                    <Col>
                      <small style={{ color: "#7376A1" }}>
                        Status Transaksi
                      </small>
                    </Col>
                    <Col className="text-end">
                      <small
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {getOrderDetailData?.payment_status_datas.name}
                        &nbsp;
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          overlay={
                            <Tooltip>
                              {getOrderDetailData?.payment_status_datas.desc}
                            </Tooltip>
                          }
                        >
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </small>
                    </Col>
                  </Row>
                  {getOrderDetailData?.payment_status_datas.id >= 3 && (
                    <>
                      <Row>
                        <Col>
                          <small style={{ color: "#7376A1" }}>
                            Metode Pembayaran
                          </small>
                        </Col>
                        <Col className="text-end">
                          <small
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {`${getOrderDetailData?.payment_method}(${getOrderDetailData?.payment_channel})`}
                          </small>
                        </Col>
                      </Row>
                      {getOrderDetailData?.service_datas.id === 10 ? (
                        <>
                          <Row>
                            <Col>
                              <small style={{ color: "#7376A1" }}>
                                Biaya Makan
                              </small>
                            </Col>
                            <Col className="text-end">
                              <small>
                                {"IDR " +
                                  getOrderDetailData?.biaya_makan.toLocaleString(
                                    "id-ID",
                                    {}
                                  )}
                              </small>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <small style={{ color: "#7376A1" }}>
                                Biaya Transportasi
                              </small>
                            </Col>
                            <Col className="text-end">
                              <small>
                                {"IDR " +
                                  parseInt(getOrderDetailData?.biaya_transport).toLocaleString(
                                    "id-ID",
                                    {}
                                  )}
                              </small>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        ""
                      )}
                      {(getOrderDetailData?.tnos_service_id === 4 && getOrderDetailData?.tnos_subservice_id === 1) 
                        ||
                        (getOrderDetailData?.tnos_service_id === 5 && getOrderDetailData?.tnos_subservice_id === 1) ? (
                        <>
                          <Row>
                            <Col>
                              <small style={{ color: "#7376A1" }}>
                                Technical Meeting
                              </small>
                            </Col>
                            <Col className="text-end">
                              <small>
                                {"IDR " +
                                  parseInt(getOrderDetailData?.biaya_tekhnical_meeting).toLocaleString(
                                    "id-ID",
                                    {}
                                  )}
                              </small>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <small style={{ color: "#7376A1" }}>
                                Biaya Pengamanan
                              </small>
                            </Col>
                            <Col className="text-end">
                              <small>
                                {"IDR " +
                                parseInt(getOrderDetailData?.biaya_pengamanan).toLocaleString(
                                    "id-ID",
                                    {}
                                  )}
                              </small>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  {getOrderDetailData?.payment_status_datas.id !== 1 && (
                    <>
                      <Row>
                        <Col md={12}>
                          <hr></hr>
                        </Col>
                        <Col>
                          <small
                            style={{ color: "#7376A1", fontWeight: "bold" }}
                          >
                            {getOrderDetailData?.payment_status_datas.id === 2
                              ? "Total yang Harus Dibayar"
                              : "Total Bayar"}
                          </small>
                        </Col>
                        <Col className="text-end">
                          <small
                            style={{ color: "#7376A1", fontWeight: "bold" }}
                          >
                            {"IDR " +
                              getOrderDetailData?.order_total.toLocaleString(
                                "id-ID",
                                {}
                              )}
                          </small>
                        </Col>
                      </Row>
                      {getOrderDetailData?.payment_status_datas.id >= 3 && (
                        <>
                          <Row>
                            <Col>
                              <small
                                style={{ color: "#7376A1", fontWeight: "bold" }}
                              >
                                Pendapatan Vendor
                              </small>
                            </Col>
                            <Col className="text-end">
                              <small
                                style={{ color: "#7376A1", fontWeight: "bold" }}
                              >
                                {"IDR " +
                                  parseInt(
                                    getOrderDetailData?.pendapatan_mitra
                                  ).toLocaleString("id-ID", {})}
                              </small>
                            </Col>
                          </Row>
                          {getOrderDetailData?.service_datas.id >= 1 && getOrderDetailData?.service_datas.id <= 9 ? (
                            <Row>
                              <Col>
                              <small
                                style={{ color: "#7376A1", fontWeight: "bold" }}
                              >
                                Pendapatan Partner
                              </small>
                              </Col>
                              <Col className="text-end">
                              <small
                                style={{ color: "#7376A1", fontWeight: "bold" }}
                              >
                                {getOrderDetailData?.pendapatan_partner === null ? "IDR 0" : "IDR " +
                                  parseInt(
                                    getOrderDetailData?.pendapatan_partner
                                  ).toLocaleString("id-ID", {})}
                              </small>
                            </Col>
                            </Row>
                              ) : "" }
                          <Row>
                            <Col>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                Pendapatan Perusahaan
                              </p>
                            </Col>
                            <Col className="text-end">
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {"IDR " +
                                  parseInt(
                                    getOrderDetailData?.pendapatan_tnos
                                  ).toLocaleString("id-ID", {})}
                              </p>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
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
