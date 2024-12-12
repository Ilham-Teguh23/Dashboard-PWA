import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileAlt,
  faListAlt,
  faIdCard,
  faUserTimes,
  faPencilAlt,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Nav,
  Card,
  Button,
  Table,
  Form,
  Badge,
  Tab,
  Modal,
  Alert,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import FlashMessage from "react-flash-message";

import Preloader from "../../components/Preloader";
import moment from "moment";

export default () => {
  const [getGuardCode, setGuardCode] = useState("");
  const [getGuardData, setGuardData] = useState();
  const [showDefault, setShowDefault] = useState(false);
  const [getFlashMesage, setFlashMessage] = useState({
    status: false,
    message: "",
    color: "",
  });
  const handleClose = () => setShowDefault(false);
  const [getGuardDataTabs] = useState([
    // {
    //   eventKey: "index_tab",
    //   icon: faIndent,
    //   title: "Index",
    //   mmit_status: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    // },
    {
      eventKey: "active_tab",
      icon: faIdCard,
      title: "Aktif",
      mmit_status: [9, 10],
    },
    {
      eventKey: "data_verification_tab",
      icon: faFileAlt,
      title: "Verifikasi Data",
      mmit_status: [0],
    },
    {
      eventKey: "actual_verification_tab",
      icon: faListAlt,
      title: "Verifikasi Aktual",
      mmit_status: [1, 4, 5, 7],
    },
    {
      eventKey: "not_pass_tab",
      icon: faUserTimes,
      title: "Tidak Lolos",
      mmit_status: [2, 6],
    },
  ]);

  const makeScedhule = (code) => {
    setShowDefault(true);
    setGuardCode(code);
  };

  const changeStatusPartnerLolos = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let HariInterview = " ";
    if (formData.get("name") !== "Interview") {
      let oneDate = moment(formData.get("TglJamInterview").split("T")[0]);
      let dayName = oneDate.format("dddd");
      switch (dayName) {
        case "Monday":
          HariInterview = "Senin";
          break;
        case "Tuesday":
          HariInterview = "Selasa";
          break;
        case "Wednesday":
          HariInterview = "Rabu";
          break;
        case "Thursday":
          HariInterview = "Kamis";
          break;
        case "Friday":
          HariInterview = "Jumat";
          break;
        case "Saturday":
          HariInterview = "Sabtu";
          break;
        case "Sunday":
          HariInterview = "Minggu";
          break;
        default:
          HariInterview = dayName;
          break;
      }
    }

    let apiTo = "";
    if (formData.get("pembekalan-mitra") === "yes") {
      apiTo = "pembekalan-mitra";
    } else {
      apiTo = "interview-mitra";
    }

    let successMessage = "";
    if (formData.get("statusId") === "1") {
      successMessage = `Berhasil mengatur jadwal verifikasi aktual untuk ${formData.get(
        "Fullname"
      )}`;
    } else if (formData.get("statusId") === "4") {
      successMessage = `Berhasil menetapkan hasil verifikasi aktual untuk ${formData.get(
        "Fullname"
      )}`;
    } else if (formData.get("statusId") === "5") {
      successMessage = `Berhasil mengatur jadwal pembekalan untuk ${formData.get(
        "Fullname"
      )}`;
    }
    fetch(
      `${process.env.REACT_APP_MITRA_TNOS_API_URL}/${apiTo}/${getGuardCode}`,
      {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name") ? formData.get("name") : "",
          code: getGuardCode,
          LokasiInterview: formData.get("LokasiInterview")
            ? formData.get("LokasiInterview")
            : "",
          HariInterview: HariInterview ? HariInterview : "",
          TglInterview: formData.get("TglJamInterview")
            ? formData.get("TglJamInterview").split("T")[0]
            : "",
          JamInterview: formData.get("TglJamInterview")
            ? formData.get("TglJamInterview").split("T")[1]
            : "",
          note: "Note",
          status: formData.get("status") ? formData.get("status") : "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setShowDefault(false);
        setFlashMessage({
          status: true,
          message: successMessage,
          color: "success",
        });
        setTimeout(() => {
          setFlashMessage({
            status: false,
            message: "",
            color: "",
          });
          window.location.reload();
        }, 3000);
      });
  };

  const TableRow = (props) => {
    const { code, fullname, email, mobile, levelname, mmit_status } = props;

    return (
      <tr>
        <td className="fw-bold">{fullname}</td>
        <td>{email}</td>
        <td>{mobile}</td>
        <td>
          {levelname === "A" ? (
            <Badge bg="primary" className="ms-1 badge-lg">
              Platinum
            </Badge>
          ) : levelname === "B" ? (
            <Badge bg="light" className="ms-1 text-dark badge-lg">
              Silver
            </Badge>
          ) : levelname === "C" ? (
            <Badge bg="light" className="ms-1 text-dark badge-lg">
              Silver
            </Badge>
          ) : (
            ""
          )}
        </td>
        {/* <td>
          <Badge
            bg={
              mmit_status === 0
                ? "cyan"
                : mmit_status === 1
                ? "soft-green"
                : mmit_status === 2
                ? "warning"
                : mmit_status === 3
                ? "secondary"
                : mmit_status === 4
                ? "primary"
                : mmit_status === 5
                ? "gray"
                : mmit_status === 6
                ? "blue"
                : mmit_status === 7
                ? "pink"
                : mmit_status === 9
                ? "success"
                : mmit_status === 10
                ? "gray"
                : ""
            }
            className="badge-lg"
          >
            {mmit_status === 0
              ? "Menunggu Verifikasi"
              : mmit_status === 1
              ? "Lolos Verifikasi Dokumen"
              : mmit_status === 2
              ? "Tidak Lolos Verifikasi Dokumen"
              : mmit_status === 3
              ? "Atur Jadwal Verifikasi Aktual"
              : mmit_status === 4
              ? "Menunggu Verifikasi Aktual"
              : mmit_status === 5
              ? "Jadwal Pembekalan"
              : mmit_status === 6
              ? "Tidak Lolos Verifikasi Aktual"
              : mmit_status === 7
              ? "Pembekalan"
              : mmit_status === 9
              ? "Online"
              : mmit_status === 10
              ? "Offline"
              : ""}
          </Badge>
        </td> */}
        <td>
          {mmit_status === 0 ? (
            <Link to={`/partner/guard/detail/${code}`}>
              <Button variant="dark" size="sm">
                <FontAwesomeIcon icon={faList} />
                &nbsp; Detail
              </Button>
            </Link>
          ) : mmit_status === 1 ? (
            <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              &nbsp; Atur Jadwal
            </Button>
          ) : mmit_status === 4 ? (
            <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
              <FontAwesomeIcon icon={faPencilAlt} />
              &nbsp; Masukkan Hasil
            </Button>
          ) : mmit_status === 5 ? (
            <Button variant="dark" size="sm" onClick={() => makeScedhule(code)}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              &nbsp; Atur Jadwal
            </Button>
          ) : mmit_status === 9 || mmit_status === 10 ? (
            <Link to={`/partner/guard/profile/${code}`}>
              <Button variant="dark" size="sm">
                <FontAwesomeIcon icon={faUser} />
                &nbsp; Profil
              </Button>
            </Link>
          ) : (
            ""
          )}
          <Link to={`/partner/guard/update/${code}`} className="ms-2">
            <Button variant="warning" size="sm" className="text-white">
              <FontAwesomeIcon icon={faPencilAlt} />
            </Button>
          </Link>
        </td>
      </tr>
    );
  };

  useEffect(() => {
    // fetch(`${process.env.REACT_APP_MITRA_TNOS_API_URL}/all-mitra`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setGuardData(data);
    //   });
    // Fetch data with post method with https://dev-portal-api.tnos.world/mitra/list and body category: "1"
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
      method: "POST",
      body: JSON.stringify({ category: "1" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGuardData(data.data);
      });
    if (localStorage.getItem("guardFullname") !== null) {
      setFlashMessage({
        status: true,
        message: `Berhasil memverifikasi dokumen untuk ${localStorage.getItem(
          "guardFullname"
        )}`,
        color: "success",
      });
      setTimeout(() => {
        localStorage.removeItem("guardFullname");
      }, 3000);
    } else if (localStorage.getItem("guardUpdateMessage") !== null) {
      setFlashMessage({
        status: true,
        message: localStorage.getItem("guardUpdateMessage"),
        color: "success",
      });
      setTimeout(() => {
        localStorage.removeItem("guardUpdateMessage");
      }, 3000);
    }
  }, []);

  return (
    <>
      <Preloader show={!getGuardData ? true : false} />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>Mitra Ditangguhkan</Breadcrumb.Item>
          </Breadcrumb>
          <h5>Mitra Ditangguhkan</h5>
          <p className="mb-0">Daftar Mitra Ditangguhkan.</p>
        </div>
      </div>
      <Tab.Container
        defaultActiveKey={
          window.location.href.split("/")[4].split("#")[1]
            ? window.location.href.split("/")[4].split("#")[1]
            : "active_tab"
        }
      >
        <Row>
          <Col lg={12}>
            <Nav fill variant="pills" className="flex-column flex-sm-row">
              {/* {getGuardDataTabs?.map((item) => (
                <Nav.Item>
                  <Nav.Link
                    href={"#" + item.eventKey}
                    eventKey={item.eventKey}
                    className="mb-sm-3 mb-md-0 bg-white"
                  >
                    <FontAwesomeIcon icon={item.icon} className="me-2" />{" "}
                    {item.title}
                  </Nav.Link>
                </Nav.Item>
              ))} */}
            </Nav>
            <Tab.Content>
              {getGuardDataTabs?.map((item) => (
                <Tab.Pane
                  id={item.eventKey}
                  eventKey={item.eventKey}
                  className="py-4"
                >
                  <Card border="light" className="shadow-sm mb-4">
                    <Card.Body className="pb-0">
                      {getFlashMesage?.status === true && (
                        <FlashMessage duration={3000} persistOnHover={true}>
                          <Alert variant={getFlashMesage.color}>
                            <div className="d-flex justify-content-between">
                              <div>{getFlashMesage.message}</div>
                            </div>
                          </Alert>
                        </FlashMessage>
                      )}
                      <div className="tnos-data-table">
                        <Table
                          responsive
                          className="table-centered table-nowrap rounded mb-0"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th className="border-0">Nama</th>
                              <th className="border-0">Email</th>
                              <th className="border-0">Nomor Telepon</th>
                              <th className="border-0">Klasifikasi</th>
                              {/* <th className="border-0">Status</th> */}
                              <th className="border-0">
                                {" "}
                                <Link to={`/partner/guard/barcodes`}>
                                  <Badge bg="primary" className="badge-lg">
                                    <FontAwesomeIcon icon={faPrint} />
                                    &nbsp; Cetak Barcode
                                  </Badge>
                                </Link>
                              </th>
                              <th className="border-0"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {getGuardData?.map((gd) => (
                              <>
                                {item.mmit_status.includes(gd.mmit_status) &&
                                  gd.mmid_data !== null && (
                                    <TableRow
                                      key={`guard-data-${gd.code}`}
                                      {...gd}
                                    />
                                  )}
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="h6">
            {getGuardData?.map((gd) => (
              <>
                {gd.code === getGuardCode && (
                  <>
                    {gd.mmit_status === 1
                      ? "Atur Jadwal Verifikasi Aktual"
                      : gd.mmit_status === 4
                      ? "Hasil Verifikasi Aktual"
                      : gd.mmit_status === 5
                      ? "Atur Jadwal Pembekalan"
                      : gd.mmit_status === 7
                      ? "Atur Jadwal Pembekalan"
                      : gd.mmit_status === 9
                      ? "Atur Jadwal Aktif"
                      : ""}
                  </>
                )}
              </>
            ))}
          </Modal.Title>
          <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          {" "}
          {getGuardData?.map((gd) => (
            <>
              {gd.code === getGuardCode && (
                <>
                  {gd.mmit_status === 1 ? (
                    <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                      <input type="hidden" name="statusId" value="1" />
                      <input
                        type="hidden"
                        name="name"
                        value="JadwalInterview"
                      />
                      <input
                        type="hidden"
                        name="Fullname"
                        value={gd.fullname}
                      />
                      <Row>
                        <Col className="mb-3">
                          <Form.Group id="LokasiInterview">
                            <Form.Label>Lokasi Verifikasi Aktual </Form.Label>
                            <Form.Select name="LokasiInterview" required>
                              <option
                                key="LokasiInterview_1"
                                value="CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2, Banten"
                              >
                                CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2,
                                Banten
                              </option>
                              <option
                                key="LokasiInterview_2"
                                value="Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama, Jakarta Selatan"
                              >
                                Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama,
                                Jakarta Selatan
                              </option>
                              <option
                                key="LokasiInterview_3"
                                value="Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati"
                              >
                                Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Row>
                            <Col md={12} className="mb-3">
                              <Form.Group id="TglJamInterview">
                                <Form.Label>
                                  Tanggal / Jam Verifikasi Aktual
                                </Form.Label>
                                <Form.Control
                                  required
                                  type="datetime-local"
                                  name="TglJamInterview"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Row>
                            <Col md={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>
                                  Dokumen Verifikasi Aktual
                                </Form.Label>
                                <ol>
                                  <li>KTP</li>
                                  <li>Kartu Keluarga</li>
                                  <li>SKCK</li>
                                  <li>Surat Keterangan Bebas Narkoba</li>

                                  {JSON.parse(gd.mmid_data).data.current_job ===
                                    "1" ||
                                  JSON.parse(gd.mmid_data).data.current_job ===
                                    "2" ? (
                                    <>
                                      <li>Skep Purna / KTA</li>
                                      <li>Sertifikat Brevet TNI / POLRI</li>
                                    </>
                                  ) : (
                                    <li>Sertifikat Pendidikan Satpam</li>
                                  )}

                                  <li>Sertifikat Bela Diri</li>
                                  <li>Pegalaman Kerja Bid Pengamanan</li>
                                </ol>
                                {JSON.parse(gd.mmid_data).data.current_job ===
                                  "1" ||
                                JSON.parse(gd.mmid_data).data.current_job ===
                                  "2" ? (
                                  <small>
                                    ( Nomor 1-5 asli dokumen wajib dibawa )
                                  </small>
                                ) : (
                                  <small>
                                    ( Nomor 1-4 asli dokumen wajib dibawa )
                                  </small>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <hr />
                      <Button
                        variant="link"
                        className="text-gray ms-auto"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="float-end"
                      >
                        Atur Jadwal
                      </Button>
                    </Form>
                  ) : gd.mmit_status === 4 ? (
                    <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                      <input type="hidden" name="statusId" value="4" />
                      <input type="hidden" name="name" value="Interview" />
                      <input
                        type="hidden"
                        name="Fullname"
                        value={gd.fullname}
                      />
                      <Row>
                        <Col className="mb-3">
                          <Form.Group id="lulus_gagal_interview">
                            <Form.Label>
                              Apakah hasil verifikasi aktual yang bersangkutan
                              sesuai ?
                            </Form.Label>
                          </Form.Group>
                          <Form.Check
                            inline
                            defaultChecked
                            type="radio"
                            defaultValue="Y"
                            label="Sesuai"
                            name="status"
                            id="lulus_interview"
                            htmlFor="lulus_interview"
                          />

                          <Form.Check
                            inline
                            type="radio"
                            defaultValue="N"
                            label="Tidak Sesuai"
                            name="status"
                            id="gagal_interview"
                            htmlFor="gagal_interview"
                          />

                          <Form.Group id="catatan" className="mt-4 d-none">
                            <Form.Label>
                              Catatan
                              <span className="text-danger"> *</span>
                            </Form.Label>
                            <Form.Control as="textarea" name="note" rows={5} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        type="submit"
                        className="float-end"
                      >
                        Kirim
                      </Button>
                    </Form>
                  ) : gd.mmit_status === 5 ? (
                    <Form method="POST" onSubmit={changeStatusPartnerLolos}>
                      <input type="hidden" name="statusId" value="5" />
                      <input
                        type="hidden"
                        name="pembekalan-mitra"
                        value="yes"
                      />
                      <input
                        type="hidden"
                        name="name"
                        value="JadwalInterview"
                      />
                      <input
                        type="hidden"
                        name="Fullname"
                        value={gd.fullname}
                      />
                      <Row>
                        <Col className="mb-3">
                          <Form.Group id="LokasiInterview">
                            <Form.Label>Lokasi Pembekalan </Form.Label>
                            <Form.Select name="LokasiInterview" required>
                              <option
                                key="LokasiInterview_1"
                                value="CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2, Banten"
                              >
                                CBD Bintaro Jaya, Blok O, Jl. Sektor VII No.2,
                                Banten
                              </option>
                              <option
                                key="LokasiInterview_2"
                                value="Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama, Jakarta Selatan"
                              >
                                Jl. Metro Duta, Pd. Pinang, Kec. Kby. Lama,
                                Jakarta Selatan
                              </option>
                              <option
                                key="LokasiInterview_3"
                                value="Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati"
                              >
                                Jl.Condet No.5, RW.3, Bale Kambang, Kramat Jati
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Row>
                            <Col md={12} className="mb-3">
                              <Form.Group id="TglJamInterview">
                                <Form.Label>
                                  Tanggal / Jam Pembekalan
                                </Form.Label>
                                <Form.Control
                                  required
                                  type="datetime-local"
                                  name="TglJamInterview"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <hr />
                      <Button
                        variant="link"
                        className="text-gray ms-auto"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="float-end"
                      >
                        Atur Jadwal
                      </Button>
                    </Form>
                  ) : gd.mmit_status === 7 ? (
                    "Atur Jadwal Pembekalan"
                  ) : gd.mmit_status === 9 ? (
                    "Atur Jadwal Aktif"
                  ) : (
                    ""
                  )}
                </>
              )}
            </>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};
