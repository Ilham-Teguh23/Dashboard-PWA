import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form, Modal, Table } from "@themesberg/react-bootstrap";
import axios from "axios";
import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Preloader from "../../components/Preloader";

function Product() {
  const [validationError, setValidationError] = useState("");
  const [dataProduct, setDataProduct] = useState("");
  const [hiddenAlerts, setHiddenAlerts] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const [attributModal, setAttributModal] = useState("");

  // add product
  const [inputFieldProduct, setInputFieldProduct] = useState({
    status: "active",
  });

  const handleOnChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputFieldProduct((values) => ({ ...values, [name]: value }));
  };

  // end add product

  useEffect(() => {
    getProduct();
  }, []);

  const getModal = () => {
    const attribut = {
      title: "Tambah Data",
      button: "Save Data",
      status: "tambah",
    };

    setAttributModal(attribut);
    setShowDefault(true);
  };
  const handleClose = () => {
    setShowDefault(false);
  };

  const onClose = (alertId) => {
    const hiddenAlertsUpdated = [...hiddenAlerts, alertId];
    setHiddenAlerts(hiddenAlertsUpdated);
  };

  const shouldShowAlert = (alertId) => hiddenAlerts.indexOf(alertId) === -1;

  const getProduct = async () => {
    try {
      await axios
        .get(`http://127.0.0.1:8000/api/product`)
        .then((res) => {
          setDataProduct(res.data);
        })
        .catch((res) => {
          console.log(res);
          // eslint-disable-next-line eqeqeq
          if (res.response.status == 500) {
            console.log(res);
          } else {
            setValidationError(res.response.data.message);
          }
        });
      // setIsDisabled(false);
      //   console.log(response.data.message);
    } catch (error) {
      // setValidationError(error.response.data.message);
      // setIsDisabled(false);
      //   console.log(validationError);
      console.log(error);
    }
  };

  const addProduct = async () => {
    try {
      const data = inputFieldProduct;
      if (!data.status) {
        data.status = "active";
      }

      await axios
        .post(`http://127.0.0.1:8000/api/add-product`, data)
        .then((res) => {
          handleClose();
          alert("sukses");
          getProduct();
        })
        .catch((res) => {
          console.log(res);
          // eslint-disable-next-line eqeqeq
          if (res.response.status == 500) {
            console.log(res);
          } else {
            setValidationError(res.response.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <Preloader show={dataProduct ? false : true} />
      <div className="shadow-sm card border-light">
        <div className=" border-light d-flex justify-content-between card-header">
          <h5 className="mb-0">Data Produk</h5>
          <button onClick={() => getModal()} className="btn btn-primary btn-sm">
            Tambah Produk
          </button>
        </div>
        <div className="card-body">
          <Table
            responsive
            className="align-items-center table-flush table-hover"
          >
            <thead className="thead-light">
              <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataProduct.product?.length > 0 ? (
                dataProduct.product?.map((row, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{row.name_product}</td>
                    <td>{"Rp. " + row.harga.toLocaleString()}</td>
                    <td>{row.point_token}</td>
                    <td>{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colspan={11}>data kosong</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="h6">{attributModal.title}</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          {Object.keys(validationError).length > 0 && (
            <Alert
              variant="danger"
              show={shouldShowAlert("danger")}
              onClose={() => onClose("danger")}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <FontAwesomeIcon icon={faBullhorn} className="me-1" />
                  <strong>Ada yang salah!</strong>
                  {Object.entries(validationError).map(([key, value]) => (
                    <div key={key}>{value}</div>
                  ))}
                </div>
                <Button
                  variant="close"
                  size="xs"
                  onClick={() => onClose("danger")}
                />
              </div>
            </Alert>
          )}
          {attributModal.status === "tambah" ? (
            <Fragment>
              <div className="form-group mb-3">
                <label htmlFor="name_product" className="mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  placeholder="Nama Produk"
                  className="form-control"
                  name="name_product"
                  onChange={(event) => handleOnChange(event)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="harga" className="mb-2">
                  Harga
                </label>
                <input
                  type="text"
                  placeholder="Harga"
                  className="form-control"
                  name="harga"
                  onChange={(event) => handleOnChange(event)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="point" className="mb-2">
                  Point
                </label>
                <input
                  type="text"
                  placeholder="Point"
                  className="form-control"
                  name="point_token"
                  onChange={(event) => handleOnChange(event)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="point" className="mb-2">
                  Pilih Status
                </label>
                <div onChange={(event) => handleOnChange(event)}>
                  <Form.Check
                    defaultChecked
                    type="radio"
                    defaultValue="active"
                    label="Aktiv"
                    name="status"
                    id="radio1"
                    htmlFor="radio1"
                  />

                  <Form.Check
                    type="radio"
                    defaultValue="non_active"
                    label="Tidak Aktiv"
                    name="status"
                    id="radio2"
                    htmlFor="radio2"
                  />
                </div>
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => addProduct()}
            variant="success"
            className="text-white ml-auto"
          >
            {attributModal.button}
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default Product;
