import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from "@themesberg/react-bootstrap";

export default () => {
  const [getGroupData, setGroupData] = useState([]);
  const [getAdminData, setAdminData] = useState([]);
  const [matchPassword, setMatchPassword] = useState(true);
  const [getFullnameValue, setFullnameValue] = useState();
  const [getUsernameValue, setUsernameValue] = useState();
  const [getFieldName, setFieldName] = useState();
  const [getFormAct, setFormAct] = useState();
  const [getFormActMain, setFormActMain] = useState();
  const [getInnerAlert, setInnerAlert] = useState();
  const [showAlert, setShowAlert] = useState(false);

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
  }, []);

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
            setFormActMain({
              color: "danger",
              icon: faTimesCircle,
              msg: "Tidak tersedia !",
            });
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
        return true;
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

    // Check if the password and confirm password match
    if (formData.get("password") === formData.get("confirm_password")) {
      const data = {};
      formData.forEach((value, key) => {
        if (key !== "confirm_password") {
          // Hash the password
          if (key === "password") {
            data[key] = btoa(value);
          } else {
            data[key] = value;
          }
        }
      });
      fetch(`${process.env.REACT_APP_API_URL}/admin-user-create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data[0].statusCode === "200") {
            setInnerAlert({
              color: "success",
              message: "Berhasil menambahkan pengguna",
            });
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              // Redirect to the user list page
              window.location.href = "/tnos-admin/user";
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
  };
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faChartPie} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/tnos-admin/user">Pengguna</Breadcrumb.Item>
            <Breadcrumb.Item active>Tambah Pengguna</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Tambah Pengguna</h5>
          {showAlert && (
            <Alert
              variant={getInnerAlert.color}
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {getInnerAlert.message}
            </Alert>
          )}
          <Form onSubmit={onFormSubmit} method="POST">
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
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="password">
                  <Form.Label>Kata Sandi</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    placeholder="Masukkan kata sandi"
                    isInvalid={!matchPassword ? true : false}
                  />
                  {!matchPassword && (
                    <Form.Control.Feedback type="invalid">
                      Konfirmasi sandi harus sama dengan kata sandi.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="confirm_password">
                  <Form.Label>Konfirmasi Kata Sandi</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="confirm_password"
                    placeholder="Masukkan ulang kata sandi"
                    isInvalid={!matchPassword ? true : false}
                  />
                  {!matchPassword && (
                    <Form.Control.Feedback type="invalid">
                      Konfirmasi sandi harus sama dengan kata sandi.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={12} className="mb-3">
                <Form.Group id="tnos_admin_group_id">
                  <Form.Label>Grup</Form.Label>
                  <Form.Select defaultValue="0" name="tnos_admin_group_id">
                    {getGroupData.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
