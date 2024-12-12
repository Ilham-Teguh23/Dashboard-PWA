import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Button,
  Modal,
  Alert,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { useParams } from "react-router-dom";
import FlashMessage from "react-flash-message";

export default () => {
  const { id } = useParams();
  const [getUserData, setUserData] = useState();
  const [getGroupData, setGroupData] = useState([]);
  const [getAdminData, setAdminData] = useState([]);
  const [currPassCheck, setCurrPassCheck] = useState(true);
  const [matchPassword, setMatchPassword] = useState(true);
  const [show, setShow] = useState(false);
  const [getFlashMesage, setFlashMessage] = useState({
    status: false,
    message: "",
    color: "",
  });
  const [getFormAct, setFormAct] = useState();
  const [getFieldName, setFieldName] = useState();
  const [getFormActMain, setFormActMain] = useState();
  const [getFullnameValue, setFullnameValue] = useState();
  const [getUsernameValue, setUsernameValue] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admin-group`)
      .then((res) => res.json())
      .then((data) => {
        setGroupData(data);
        fetch(`${process.env.REACT_APP_API_URL}/admin-user`)
          .then((res) => res.json())
          .then((adminData) => {
            setAdminData(adminData);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    // fetch(`${process.env.REACT_APP_API_URL}/admin-user/:id`) with useParams id
    fetch(`${process.env.REACT_APP_API_URL}/admin-user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data[0]);
      });
  }, [id]);

  const handleCheckAlert = (field, value) => {
    if (value) {
      setFieldName(field);

      fetch(`${process.env.REACT_APP_API_URL}/admin-user`)
        .then((res) => res.json())
        .then((data) => {
          let fieldData = [];

          data.forEach((item) => {
            fieldData.push(item[field]);
          });

          if (fieldData.includes(value)) {
            if (value === getUserData[field]) {
              setFormActMain({
                color: "success",
                icon: faCheckCircle,
                msg: "Tersedia !",
              });
            } else {
              setFormActMain({
                color: "danger",
                icon: faTimesCircle,
                msg: "Tidak tersedia !",
              });
            }
          } else {
            setFormActMain({
              color: "success",
              icon: faCheckCircle,
              msg: "Tersedia !",
            });
          }

          setFormAct(true);
          setTimeout(() => {
            setFormAct(false);
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkDuplicateValue = (field, value) => {
    if (value) {
      setFieldName(field);

      let fieldData = [];
      getAdminData.forEach((item) => {
        fieldData.push(item[field]);
      });

      if (fieldData.includes(value)) {
        if (value === getUserData[field]) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  const getAlertForm = (type, msg) => {
    setFormActMain({
      color: type === "err" ? "danger" : "success",
      icon: type === "err" ? faTimesCircle : faCheckCircle,
      msg,
    });

    setFormAct(true);
    setTimeout(() => {
      setFormAct(false);
    }, 3000);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Check Fullname
    if (checkDuplicateValue("fullname", getFullnameValue)) {
      getAlertForm("err", "Tidak tersedia !");
      return;
    }

    // Check Username
    if (checkDuplicateValue("username", getUsernameValue)) {
      getAlertForm("err", "Tidak tersedia !");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/admin-user-update/${id}`, {
      method: "POST",
      body: JSON.stringify({
        fullname: formData.get("fullname"),
        username: formData.get("username"),
        password: getUserData.password,
        tnos_admin_group_id: parseInt(formData.get("tnos_admin_group_id")),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data[0].statusCode === "200") {
          setFlashMessage({
            status: true,
            message: "Berhasil Memperbarui Data",
            color: "success",
          });
          setTimeout(() => {
            setFlashMessage({
              status: false,
              message: "",
              color: "",
            });
            // Redirect to the user list page
            window.location.href = "/tnos-admin/user";
          }, 3000);
        } else {
          // Show error message
          console.error(data.message);
        }
      });
  };

  const onModalFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Check if the current password is correct
    if (btoa(formData.get("current_password")) === getUserData.password) {
      // Check if the password and confirm password match
      if (formData.get("password") === formData.get("confirm_password")) {
        fetch(`${process.env.REACT_APP_API_URL}/admin-user-update/${id}`, {
          method: "POST",
          body: JSON.stringify({
            fullname: getUserData.fullname,
            username: getUserData.username,
            password: btoa(formData.get("password")),
            tnos_admin_group_id: getUserData.tnos_admin_group_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data[0].statusCode === "200") {
              setFlashMessage({
                status: true,
                message: "Berhasil Memperbarui Kata Sandi",
                color: "success",
              });
              setTimeout(() => {
                setFlashMessage({
                  status: false,
                  message: "",
                  color: "",
                });
                setShow(false);
                // Redirect to the user list page
                window.location.reload();
              }, 3000);
            } else {
              // Show error message
              console.error(data.message);
            }
          });
      } else {
        setMatchPassword(false);
        setTimeout(() => {
          setMatchPassword(true);
        }, 3000);
      }
    } else {
      setCurrPassCheck(false);
      setTimeout(() => {
        setCurrPassCheck(true);
      }, 3000);
      return;
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faChartPie} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/tnos-admin/user">Pengguna</Breadcrumb.Item>
            <Breadcrumb.Item active>Perbarui Data Pengguna</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={onFormSubmit} method="POST">
            <Row>
              <Col>
                <h5 className="mb-4">Perbarui Data Pengguna</h5>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  onClick={handleShow}
                  className="float-end"
                >
                  Perbarui Kata Sandi
                </Button>
              </Col>
            </Row>
            {getFlashMesage?.status === true && (
              <FlashMessage duration={3000} persistOnHover={true}>
                <Alert variant={getFlashMesage.color}>
                  <div className="d-flex justify-content-between">
                    <div>{getFlashMesage.message}</div>
                  </div>
                </Alert>
              </FlashMessage>
            )}
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="fullname">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <InputGroup>
                    <Form.Control
                      className={
                        getFormAct && getFieldName === "fullname"
                          ? `border-${getFormActMain.color}`
                          : ""
                      }
                      required
                      type="text"
                      name="fullname"
                      placeholder="Masukkan nama lengkap"
                      defaultValue={getUserData?.fullname}
                      onChange={(e) => {
                        setFullnameValue(e.target.value);
                      }}
                    />
                    {getFullnameValue && (
                      <InputGroup.Text
                        className={
                          getFormAct && getFieldName === "fullname"
                            ? `bg-${getFormActMain.color} text-white`
                            : "bg-dark text-white"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleCheckAlert("fullname", getFullnameValue)
                        }
                      >
                        {getFormAct && getFieldName === "fullname" ? (
                          <>
                            <FontAwesomeIcon icon={getFormActMain.icon} />
                            &nbsp;
                            {getFormActMain.msg}
                          </>
                        ) : (
                          "Cek"
                        )}
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <Form.Control
                      className={
                        getFormAct && getFieldName === "username"
                          ? `border-${getFormActMain.color}`
                          : ""
                      }
                      required
                      type="text"
                      name="username"
                      placeholder="Masukkan username"
                      defaultValue={getUserData?.username}
                      onChange={(e) => {
                        setUsernameValue(e.target.value);
                      }}
                    />
                    {getUsernameValue && (
                      <InputGroup.Text
                        className={
                          getFormAct && getFieldName === "username"
                            ? `bg-${getFormActMain.color} text-white`
                            : "bg-dark text-white"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleCheckAlert("username", getUsernameValue)
                        }
                      >
                        {getFormAct && getFieldName === "username" ? (
                          <>
                            <FontAwesomeIcon icon={getFormActMain.icon} />
                            &nbsp;
                            {getFormActMain.msg}
                          </>
                        ) : (
                          "Cek"
                        )}
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={12} className="mb-3">
                <Form.Group id="tnos_admin_group_id">
                  <Form.Label>Grup</Form.Label>
                  <Form.Select name="tnos_admin_group_id">
                    {getGroupData.map((item) =>
                      // If the group id is the same as the user group id, then set the selected option to true
                      item.id === getUserData?.tnos_admin_group_id ? (
                        <option key={item.id} value={item.id} selected>
                          {item.name}
                        </option>
                      ) : (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3">
              <Button variant="warning" type="submit" className="text-white">
                Perbarui
              </Button>
            </div>
          </Form>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Perbarui Kata Sandi</Modal.Title>
            </Modal.Header>
            <Form method="POST" onSubmit={onModalFormSubmit}>
              <Modal.Body>
                {getFlashMesage?.status === true && (
                  <FlashMessage duration={3000} persistOnHover={true}>
                    <Alert variant={getFlashMesage.color}>
                      <div className="d-flex justify-content-between">
                        <div>{getFlashMesage.message}</div>
                      </div>
                    </Alert>
                  </FlashMessage>
                )}
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="current_password">
                      <Form.Label>Kata Sandi Saat Ini</Form.Label>
                      <Form.Control
                        type="password"
                        name="current_password"
                        placeholder="Masukkan kata sandi saat ini"
                        isInvalid={!currPassCheck ? true : false}
                        required
                      />
                      {!currPassCheck && (
                        <Form.Control.Feedback type="invalid">
                          Kata sandi tidak cocok
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="password">
                      <Form.Label>Kata Sandi Baru</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Masukkan kata sandi"
                        isInvalid={!matchPassword ? true : false}
                        required
                      />
                      {!matchPassword && (
                        <Form.Control.Feedback type="invalid">
                          Konfirmasi sandi harus sama dengan kata sandi.
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="confirm_password">
                      <Form.Label>Konfirmasi Kata Sandi Baru</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm_password"
                        placeholder="Masukkan ulang kata sandi"
                        isInvalid={!matchPassword ? true : false}
                        required
                      />
                      {!matchPassword && (
                        <Form.Control.Feedback type="invalid">
                          Konfirmasi sandi harus sama dengan kata sandi.
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  Tutup
                </Button>
                <Button variant="warning" type="submit" className="text-white">
                  Perbarui
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Card.Body>
      </Card>
    </>
  );
};
