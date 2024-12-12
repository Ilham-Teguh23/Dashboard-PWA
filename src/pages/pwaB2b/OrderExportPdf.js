import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Badge,
  OverlayTrigger,
  Tooltip
} from "@themesberg/react-bootstrap";
import Preloader from "../../components/Preloader";
import { Link } from "react-router-dom";
import ReadableDateTime from "../../components/ReadableDateTime";
import Toastify from "../../components/Toastify";

export default () => {
  const [getOrderDetailData, setOrderDetailData] = useState();

  useEffect(() => {
    setOrderDetailData(
      JSON.parse(localStorage.getItem("pwaB2bExportOrderDataById"))
    );
  }, []);

  const location = getOrderDetailData?.alamat_badan_hukum;

  function createGoogleMapsLink(location) {
    const mapsURL = `https://www.google.com/maps/place/${encodeURIComponent(
      location
    )}`;

    // Mengembalikan URL
    return mapsURL;
  }

  const googleMapsLink = createGoogleMapsLink(location);

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
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.name}: {item.persentase}%
          <br />
        </span>
      ));
      return output;
    }

    if (type === "sunder") {
      const data = JSON.parse(field);
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.jabatan}: {item.name}
          <br />
        </span>
      ));
      return output;
    }

    if (type === "bidus") {
      const data = JSON.parse(field);
      const output = data.map((item, index) => (
        <span>
          {index + 1}. {item.value}
          <br />
        </span>
      ));
      return output;
    }

    if (type === "objArr") {
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
        "domisili_sekarang",
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

  const customprint = () => {
    fetch(`${process.env.REACT_APP_API_PWA_TNOSWORLD_URL}/custom-print`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: getOrderDetailData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          Toastify("Failed to download PDF", "danger");
          throw new Error("Failed to download PDF");
        }
        return response.blob();
      })
      .then((blob) => {
        Toastify("Data Berhasil di export", "success");
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${getOrderDetailData.external_id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
          <Breadcrumb.Item href="/pwa-b2b/order/detail">
            Detail Pesanan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Export PDF</Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12} xl={12}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h6 className="mb-4">
                {ifNotNull(getOrderDetailData?.service_datas.name)} &nbsp;
                <Badge
                  bg="primary"
                  className="badge-md"
                  style={{ cursor: "pointer" }}
                  onClick={customprint}
                >
                  <FontAwesomeIcon
                    icon={faPrint}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              </h6>
              {getOrderDetailData?.tnos_invoice_id == null ? (
                ""
              ) : (
                <h6>No. Invoice : {getOrderDetailData?.tnos_invoice_id}</h6>
              ) }
              <h6>Detail Layanan</h6>
              {getOrderDetailData?.service_datas.id === 9 ? (
                <>
                  <small style={{ color: "#7376A1" }}>Keperluan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {getOrderDetailData?.needs}
                  </p>
                </>
              ) : (
                ""
              )}
              {getOrderDetailData?.service_datas.id === 10 ||
              getOrderDetailData?.service_datas.id === 11 ? (
                <>
                  <Row>
                    <Col md={3}>
                      <small style={{ color: "#7376A1" }}>
                        Keperluan Pengamanan
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.needs)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>Nomor Invoice</small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.tnos_invoice_id)}
                      </p>
                    </Col>
                  </Row>

                  <small style={{ color: "#7376A1" }}>
                    Rincian Lokasi |
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      style={{ color: "#1a0dab", marginLeft: "5px" }}
                    >
                      <u>Lihat Map</u>
                    </a>
                  </small>
                  <p style={{ fontWeight: "bold" }}>
                    {ifNotNull(getOrderDetailData?.location)}
                  </p>
                  <Row>
                    <Col md={3}>
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
                    <Col md={6}>
                      <small style={{ color: "#7376A1" }}>
                        Penanggung Jawab
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.nama_pic)} -{" "}
                        {ifNotNull(getOrderDetailData?.nomor_pic)}
                      </p>
                    </Col>
                  </Row>
                  <small style={{ color: "#7376A1" }}>Jumlah Pengamanan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {`${ifNotNull(getOrderDetailData?.jml_personil)} Personel`}
                  </p>
                  <small style={{ color: "#7376A1" }}>Durasi Pengamanan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {`${ifNotNull(getOrderDetailData?.durasi_pengamanan)} Jam`}
                  </p>
                </>
              ) : (
                ""
              )}

              {getOrderDetailData?.service_datas.id == 6 ? (
                <>
                  <small style={{ color: "#7376A1" }}>Keperluan</small>
                  <p style={{ fontWeight: "bold" }}>
                    {ifNotNull(getOrderDetailData?.needs)}
                  </p>
                </>
              ) : (
                ""
              )}

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
                      "objArr",
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
                        {ifNotNull(getOrderDetailData?.modal_disetor, "curr")}
                      </p>
                      <small style={{ color: "#7376A1" }}>
                        Susunan Pemegang Saham(Tuan/Nyonya ______ sebanyak ___
                        %)
                      </small>
                      <p style={{ fontWeight: "bold" }}>
                        {ifNotNull(getOrderDetailData?.pemegang_saham, "saham")}
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
                    {ifNotNull(getOrderDetailData?.susunan_direksi, "sunder")}
                  </p>
                  <small style={{ color: "#7376A1" }}>
                    Bidang Usaha KBLI 2020
                  </small>
                  <p style={{ fontWeight: "bold" }}>
                    {ifNotNull(getOrderDetailData?.bidang_usaha, "bidus")}
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
                    {getOrderDetailData?.service_datas.id === 7
                      ? "Keperluan"
                      : getOrderDetailData?.service_datas.id === 1
                      ? "Keperluan Pengamanan"
                      : getOrderDetailData?.service_datas.id === 8
                      ? "Permasalahan Hukum"
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
                    </>
                  )}
                  {getOrderDetailData?.service_datas.id === 1 && (
                    <>
                      <small style={{ color: "#7376A1" }}>Rincian Lokasi</small>
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
                      <small style={{ color: "#7376A1" }}>Durasi Pesanan</small>
                      <p style={{ fontWeight: "bold" }}>
                        {`${ifNotNull(getOrderDetailData?.duration)} Jam`}
                      </p>
                    </>
                  )}
                </>
              ) : (
                ""
              )}

              <small style={{ color: "#7376A1" }}> Pendapatan Vendor </small>
              <p style={{ fontWeight: "bold" }}>
                {"IDR " +
                  parseInt(getOrderDetailData?.pendapatan_mitra).toLocaleString(
                    "id-ID",
                    {}
                  )}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
