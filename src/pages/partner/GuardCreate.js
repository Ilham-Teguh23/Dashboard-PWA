import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Button,
} from "@themesberg/react-bootstrap";

export default () => {
  const [getGroupData, setGroupData] = useState([]);
  const [matchPassword, setMatchPassword] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admin-group`)
      .then((res) => res.json())
      .then((data) => {
        setGroupData(data);
      });
  }, []);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

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
          // if data.affectedRows is > 1, then the user was created successfully
          if (data.affectedRows > 0) {
            // Redirect to the user list page
            window.location.href = "/#/tnos-admin/user";
          } else {
            // Show error message
            console.error(data.message);
          }
        });
    } else {
      setMatchPassword(false);
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
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>Bootstrap tables</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Tambah Pengguna</h5>
          <Form onSubmit={onFormSubmit} method="POST">
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="fullname">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="fullname"
                    placeholder="Masukkan nama lengkap"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    placeholder="Masukkan username"
                  />
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
