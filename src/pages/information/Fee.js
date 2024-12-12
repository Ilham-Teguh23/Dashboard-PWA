import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Modal,
  Alert,
  InputGroup,
  Table,
} from "@themesberg/react-bootstrap";
import FlashMessage from "react-flash-message";
import Preloader from "../../components/Preloader";

export default () => {
  const [getPriceData, setPriceData] = useState();
  const [getSelectedPriceData, setSelectedPriceData] = useState();
  const [getDataType, setDataType] = useState();
  const [getPriceId] = useState();
  const [getPriceInput] = useState();
  const [showDefault, setShowDefault] = useState(false);
  const [getFlashMesage, setFlashMessage] = useState({
    status: false,
    message: "",
    color: "",
  });

  const handleClose = () => setShowDefault(false);
  const updatePrice = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (getPriceInput) {
      if (getPriceInput === parseInt(formData.get("prevPrice"))) {
        setShowDefault(false);
      } else {
        fetch(
          `${process.env.REACT_APP_API_URL}/fee-price-update/${getPriceId}`,
          {
            method: "POST",
            body: JSON.stringify({
              price: getPriceInput,
              created_by: localStorage.getItem("user_id"),
              updated_by: localStorage.getItem("user_id"),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.affectedRows > 0) {
              setShowDefault(false);
              setFlashMessage({
                status: true,
                message: "Successfully Updated Price",
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
            } else {
              console.log("error");
            }
          });
      }
    } else {
      setShowDefault(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/fee-price-join`)
      .then((res) => res.json())
      .then((data) => {
        setPriceData(data);
      });
  }, []);

  return (
    <>
      <Preloader show={!getPriceData ? true : false} />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-xl-0"></div>
      </div>

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
          <Table
            responsive
            bordered
            className="table-centered table-nowrap rounded mb-0 text-center"
            style={{ verticalAlign: "middle" }}
          >
            <thead>
              <tr>
                <th colspan="3" rowspan="2"></th>
                <th colspan="2">Weekdays</th>
                <th colspan="2">Weekend</th>
                <th colspan="2">Holiday</th>
                <th rowspan="2"></th>
              </tr>
              <tr>
                <th className="bg-warning text-white">Normal</th>
                <th className="bg-dark text-white">Night</th>
                <th className="bg-warning text-white">Normal</th>
                <th className="bg-dark text-white">Night</th>
                <th className="bg-warning text-white">Normal</th>
                <th className="bg-dark text-white">Night</th>
              </tr>
            </thead>
            <tbody>
              {getPriceData?.map((item) => (
                <tr>
                  {item.fee_service_type_id === 1 &&
                  item.fee_partner_class_id === 1 ? (
                    <>
                      <td rowspan="4" style={{ writingMode: "vertical-l" }}>
                        Pricing
                      </td>
                      <td rowspan="2">
                        TNOS
                        <br />
                        Security
                        <br />
                        Assistance
                      </td>
                      <td className="bg-dark text-white">{item.class}</td>
                    </>
                  ) : item.fee_partner_class_id === 2 ? (
                    <td className="bg-light">{item.class}</td>
                  ) : (
                    <td colspan="2">{item.service_type}</td>
                  )}
                  {[
                    item.normal_price_weekdays,
                    item.night_price_weekdays,
                    item.normal_price_weekend,
                    item.night_price_weekend,
                    item.normal_price_holiday,
                    item.night_price_holiday,
                  ].map((itemSub) => (
                    <td>
                      {item.fee_service_type_id === 2 ? (
                        <>
                          {parseInt(itemSub.split(",")[0]).toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}
                          <small> /{item.price_per.split(",")[0]}</small>
                          <br />
                          {parseInt(itemSub.split(",")[1]).toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}
                          <small> /{item.price_per.split(",")[1]}</small>
                        </>
                      ) : (
                        <>
                          {parseInt(itemSub).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                          <small> /{item.price_per}</small>
                        </>
                      )}
                    </td>
                  ))}
                  <td>
                    {" "}
                    <Button
                      variant="warning"
                      size="sm"
                      className="text-white"
                      onClick={() => {
                        setShowDefault(true);
                        setSelectedPriceData(item);
                        setDataType("Price");
                      }}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                  </td>
                </tr>
              ))}

              {getPriceData?.map((item) => (
                <tr>
                  {item.fee_service_type_id === 1 &&
                  item.fee_partner_class_id === 1 ? (
                    <>
                      <td rowspan="4" style={{ writingMode: "vertical-l" }}>
                        Partner
                        <br />
                        Income
                        <br />
                        Scheme
                      </td>
                      <td rowspan="2">
                        TNOS
                        <br />
                        Security
                        <br />
                        Assistance
                      </td>
                      <td className="bg-dark text-white">{item.class}</td>
                    </>
                  ) : item.fee_partner_class_id === 2 ? (
                    <td className="bg-light">{item.class}</td>
                  ) : (
                    <td colspan="2">{item.service_type}</td>
                  )}
                  {[
                    item.normal_partner_income_weekdays,
                    item.night_partner_income_weekdays,
                    item.normal_partner_income_weekend,
                    item.night_partner_income_weekend,
                    item.normal_partner_income_holiday,
                    item.night_partner_income_holiday,
                  ].map((itemSub) => (
                    <td>
                      {item.fee_service_type_id === 2 ? (
                        <>
                          {parseInt(itemSub.split(",")[0]).toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}
                          <small> /{item.price_per.split(",")[0]}</small>
                          <br />
                          {parseInt(itemSub.split(",")[1]).toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}
                          <small> /{item.price_per.split(",")[1]}</small>
                        </>
                      ) : (
                        <>
                          {parseInt(itemSub).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                          <small> /{item.price_per}</small>
                        </>
                      )}
                    </td>
                  ))}
                  <td>
                    {" "}
                    <Button
                      variant="warning"
                      size="sm"
                      className="text-white"
                      onClick={() => {
                        setShowDefault(true);
                        setSelectedPriceData(item);
                        setDataType("Income");
                      }}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        as={Modal.Dialog}
        centered
        show={showDefault}
        onHide={handleClose}
        size="md"
      >
        <Modal.Body>
          {getSelectedPriceData && getDataType === "Price" ? (
            <Form onSubmit={updatePrice} method="POST">
              <Form.Group className="mb-3">
                <Form.Label>Weekdays Price</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_price_weekdays"
                        defaultValue={
                          getSelectedPriceData.normal_price_weekdays
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_price_weekdays"
                        defaultValue={getSelectedPriceData.night_price_weekdays}
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weekend Price</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_price_weekend"
                        defaultValue={getSelectedPriceData.normal_price_weekend}
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_price_weekend"
                        defaultValue={getSelectedPriceData.night_price_weekend}
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Holiday Price</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_price_holiday"
                        defaultValue={getSelectedPriceData.normal_price_holiday}
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_price_holiday"
                        defaultValue={getSelectedPriceData.night_price_holiday}
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col>
                  {" "}
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="btn btn-sm w-100"
                  >
                    Tutup
                  </Button>
                </Col>
                <Col>
                  {" "}
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn btn-sm w-100"
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : getSelectedPriceData && getDataType === "Income" ? (
            <Form onSubmit={updatePrice} method="POST">
              <Form.Group className="mb-3">
                <Form.Label>Weekdays Partner Income</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_partner_income_weekdays"
                        defaultValue={
                          getSelectedPriceData.normal_partner_income_weekdays
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_partner_income_weekdays"
                        defaultValue={
                          getSelectedPriceData.night_partner_income_weekdays
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weekend Partner Income</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_partner_income_weekend"
                        defaultValue={
                          getSelectedPriceData.normal_partner_income_weekend
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_partner_income_weekend"
                        defaultValue={
                          getSelectedPriceData.night_partner_income_weekend
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Holiday Partner Income</Form.Label>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        Normal
                      </InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="normal_partner_income_holiday"
                        defaultValue={
                          getSelectedPriceData.normal_partner_income_holiday
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Night</InputGroup.Text>
                      <Form.Control
                        type="num"
                        name="night_partner_income_holiday"
                        defaultValue={
                          getSelectedPriceData.night_partner_income_holiday
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        /{getSelectedPriceData.price_per}
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col>
                  {" "}
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="btn btn-sm w-100"
                  >
                    Tutup
                  </Button>
                </Col>
                <Col>
                  {" "}
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn btn-sm w-100"
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
