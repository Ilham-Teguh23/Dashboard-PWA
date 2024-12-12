import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Table,
  Modal,
  Alert,
} from "@themesberg/react-bootstrap";
import axios from "axios";

import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Preloader from "../../components/Preloader";

function Transaction() {
  const [dataTransaction, setDataTransaction] = useState("");
  const [dataProduct, setDataProduct] = useState("");
  const [dataEcommerce, setDataEcommerce] = useState("");
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState("Data Kosong");
  const [validationError, setValidationError] = useState("");
  const [showDefault, setShowDefault] = useState(false);
  const [hiddenAlerts, setHiddenAlerts] = useState([]);
  const [transaksiById, setTransaksiById] = useState("");
  const [detailTransaksiById, setDetailTransaksiById] = useState("");

  // percobaan pos
  const [dataKeranjang, setDataKeranjang] = useState([
    { id: "", harga: "", point_token: "" },
  ]);
  const [detailDataKeranjang, setDetailDataKeranjang] = useState([]);
  const [point, setPoint] = useState(0);

  const addProductCart = (id, harga, point_token) => {
    var data = { id: id, harga: harga, point_token: point_token };
    var a = JSON.parse(localStorage.getItem("dataKeranjang")) || [];
    a.push(data);
    getTotalHarga(a);
    localStorage.setItem("dataKeranjang", JSON.stringify(a));
    setDataKeranjang(a);
    const countsByCs = {};
    a.forEach(({ harga }) => {
      countsByCs[harga] = (countsByCs[harga] || 0) + 1;
    });
    const finalArray = Object.entries(countsByCs)
      .map(([harga, count]) => ({
        harga,
        count,
      }))
      .sort((a, b) => b.count - a.count);
    setDetailDataKeranjang(finalArray);

    localStorage.setItem("detailDataKeranjang", JSON.stringify(finalArray));
  };
  //tutup pos

  // form input manual admin
  const [userId, setUserId] = useState("");
  const [idToko, setIdToko] = useState("");
  const [noTransaction, setNoTransaction] = useState("");
  const [email, setEmail] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [harga, setHarga] = useState(0);
  // endform input

  useEffect(() => {
    fetchTransactionDataWithLimit();
    fetchProduct();
    fetchEcommerces();
    setUserId(localStorage.getItem("user_id"));
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = (alertId) => {
    const hiddenAlertsUpdated = [...hiddenAlerts, alertId];
    setHiddenAlerts(hiddenAlertsUpdated);
  };

  const shouldShowAlert = (alertId) => hiddenAlerts.indexOf(alertId) === -1;

  const handleClose = () => {
    setShowDefault(false);
  };

  const fetchTransactionDataWithLimit = async () => {
    try {
      const data = {
        limit: limit,
        search: search,
      };

      await axios
        .post(`http://127.0.0.1:8000/api/get-detail-transaction`, data)
        .then((res) => {
          setDataTransaction(res.data);
          setTotal(res.data.total);
        })
        .catch((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/get-product`)
      .then((res) => {
        setDataProduct(res.data.product);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  const fetchEcommerces = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/get-ecommerce`)
      .then((res) => {
        setDataEcommerce(res.data.ecommerces);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const resetForm = () => {
    setDataKeranjang("");
    setDetailDataKeranjang("");
    setIdToko("");
    setNameUser("");
    setNoTelepon("");
    setEmail("");
    setNoTransaction("");
    setHarga("");
    setPoint("");
    localStorage.removeItem("dataKeranjang");
    localStorage.removeItem("detailDataKeranjang");
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    alert("ini submit");
    try {
      const data = {
        id_user: userId,
        id_toko: idToko,
        no_transaction: noTransaction,
        harga: harga,
        name_user: nameUser,
        email: email,
        no_telepon: noTelepon,
        id_product: dataKeranjang,
      };
      await axios
        .post(`http://127.0.0.1:8000/api/transaction-admin`, data)
        .then((res) => {
          setDataTransaction(res.data);
          alert(
            "total harga:" +
              res.data.total_harga +
              "no transaksi" +
              res.data.no_transaksi
          );
          resetForm();
          fetchTransactionDataWithLimit();
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

  const getTotalHarga = (data) => {
    let totalHarga = data.reduce((a, v) => (a = a + v.harga), 0);
    let totalPoint = data.reduce((a, v) => (a = a + v.point_token), 0);
    setHarga(totalHarga);
    setPoint(totalPoint);
  };
  const getDetail = async (id) => {
    await axios
      .get(`http://127.0.0.1:8000/api/get-detail-transaction/${id}`)
      .then((res) => {
        setDetailTransaksiById(res.data);
        axios
          .get(
            `http://127.0.0.1:8000/api/get-transaction/${res.data.detail_transaksi_by_id.id}`
          )
          .then((res) => {
            setTransaksiById(res.data);
            setShowDefault(true);
          })
          .catch((res) => {
            console.log(res);
          });
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <Fragment>
      <Preloader
        show={
          dataEcommerce ||
          dataProduct ||
          dataTransaction ||
          detailTransaksiById ||
          transaksiById
            ? false
            : true
        }
      />
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
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Pembelian</h5>
          <div className="row">
            <div className="col-md-7">
              <div className="row">
                {dataProduct?.length > 0 ? (
                  dataProduct?.map((row, key) => {
                    return (
                      <div
                        className="col-lg-3 col-md-3 col-sm-12 mb-2"
                        key={key}
                      >
                        <div
                          className="card "
                          onClick={() =>
                            addProductCart(row.id, row.harga, row.point_token)
                          }
                        >
                          <div
                            className="card-body card-kkd"
                            style={{ padding: "12px" }}
                          >
                            {row.harga}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-body">Product kosong</div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={formSubmit}>
                <Row>
                  <Col md={12} className="mb-2">
                    <Form.Group id="no_transaction">
                      <Form.Label>No Transaksi</Form.Label>
                      <Form.Control
                        value={noTransaction}
                        onChange={(e) => setNoTransaction(e.target.value)}
                        required
                        type="text"
                        name="no_transaction"
                        placeholder="Masukkan no transaki.."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group id="name" className="mb-2">
                      <Form.Label>Nama Pembeli</Form.Label>
                      <Form.Control
                        value={nameUser}
                        onChange={(e) => setNameUser(e.target.value)}
                        required
                        type="text"
                        name="name"
                        placeholder="Masukkan nama pembeli.."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group id="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="text"
                        name="email"
                        placeholder="Masukkan email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group id="no_telepon">
                      <Form.Label>No Telepon</Form.Label>
                      <Form.Control
                        value={noTelepon}
                        onChange={(e) => setNoTelepon(e.target.value)}
                        required
                        type="text"
                        name="no_transaction"
                        placeholder="Masukkan no transaki.."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group className="">
                      <Form.Label>Pilih Toko</Form.Label>
                      <Form.Select
                        name="id_toko"
                        onChange={(e) => setIdToko(e.target.value)}
                        value={idToko}
                        required
                      >
                        {dataEcommerce?.length > 0 ? (
                          dataEcommerce?.map((row, key) => {
                            return (
                              <option value={row.id} key={key}>
                                {row.name}
                              </option>
                            );
                          })
                        ) : (
                          <option>data kosong</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="btn-group mt-3 w-100">
                  <Button
                    onClick={() => resetForm()}
                    variant="danger"
                    className="w-100"
                    type="button"
                  >
                    Batal
                  </Button>

                  <Button variant="primary" className="w-100" type="submit">
                    Simpan
                  </Button>
                </div>
              </form>
            </div>
            <div className="col-md-5">
              <h5>Detail Pembelian</h5>
              <div className="kakw" style={{ minHeight: "150px" }}>
                <table className="w-100">
                  <thead>
                    {detailDataKeranjang?.length > 0 ? (
                      detailDataKeranjang?.map((row, key) => {
                        return (
                          <tr
                            key={key}
                            style={{
                              fontSize: "13px",
                              borderBottom: "1px solid rgb(229 230 233)",
                            }}
                          >
                            <td>{`${key + 1}.`} Harga Voucher:</td>
                            <th>
                              {" "}
                              {`Rp. ${parseInt(row.harga).toLocaleString()} (${
                                row.harga / 10000
                              } point)`}{" "}
                              {row.count > 1
                                ? `total ${row.count}x:${parseInt(
                                    row.count * row.harga
                                  ).toLocaleString()}`
                                : ""}
                            </th>
                          </tr>
                        );
                      })
                    ) : (
                      <tr
                        style={{
                          fontSize: "13px",
                          borderBottom: "1px solid rgb(229 230 233)",
                        }}
                      >
                        <td>Harga Voucher:</td>
                        <th>-</th>
                      </tr>
                    )}
                    <tr style={{ fontSize: "13px" }}>
                      <td>Total Harga:</td>
                      <th>{harga ? "Rp. " + harga.toLocaleString() : "-"}</th>
                    </tr>
                    <tr style={{ fontSize: "13px" }}>
                      <td>Total Point:</td>
                      <th>{point ? point : "-"}</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>

          {}
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <h4>Data Pembelian</h4>
            <div className="mb-3" style={{ maxWidth: "230px" }}>
              <div className="input-group">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  placeholder="Pencarian..."
                />
                <button
                  onClick={() => fetchTransactionDataWithLimit()}
                  className="btn btn-primary"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
          <Table
            responsive
            className="align-items-center table-flush table-hover"
          >
            <thead className="thead-light">
              <tr>
                <th>No</th>
                <th>No Transaction</th>
                <th>Total Harga</th>
                <th>Email</th>
                <th>Nama</th>
                <th>No Telepon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataTransaction.detail_transaction?.length > 0 ? (
                dataTransaction.detail_transaction?.map((row, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{row.no_transaction}</td>
                    <td>{row.total_harga}</td>
                    <td>{row.email}</td>
                    <td>{row.name_user}</td>
                    <td>{row.no_telepon}</td>
                    <td>
                      <button
                        onClick={() => getDetail(row.id)}
                        className="btn btn-primary"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colspan={11}>data kosong</td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="col-md-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "0px" }}
                  onChange={(e) => setLimit(e.target.value)}
                  value={limit}
                />
                <Button
                  style={{ borderRadius: "0px" }}
                  variant="secondary"
                  type="submit"
                  disabled={limit <= total ? false : true}
                  onClick={() => fetchTransactionDataWithLimit()}
                >
                  {limit <= total ? "Tampil" : `max ${total}`}
                </Button>
              </div>
            </div>
            <p className="text-right" style={{ margin: "0px" }}>
              {limit >= total ? "0" : total - limit} data tidak ditampilkan dari
              total {total}
            </p>
          </div>
        </Card.Body>
      </Card>
      <Modal as={Modal.Dialog} centered show={showDefault} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="h6">
            {transaksiById ? transaksiById.message : ""}
          </Modal.Title>
          <Button variant="close" aria-label="Close" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <td>
                    No Transaction <span style={{ float: "right" }}>:</span>{" "}
                  </td>
                  <th>
                    {detailTransaksiById
                      ? detailTransaksiById.detail_transaksi_by_id
                          .no_transaction
                      : ""}
                  </th>
                </tr>
                <tr>
                  <td>
                    Total Harga <span style={{ float: "right" }}>:</span>{" "}
                  </td>
                  <th>
                    {detailTransaksiById
                      ? "Rp. " +
                        detailTransaksiById.detail_transaksi_by_id.total_harga.toLocaleString()
                      : ""}
                  </th>
                </tr>
                <tr>
                  <td>
                    Nama <span style={{ float: "right" }}>:</span>{" "}
                  </td>
                  <th>
                    {detailTransaksiById
                      ? detailTransaksiById.detail_transaksi_by_id.name_user
                      : ""}
                  </th>
                </tr>
                <tr>
                  <td>
                    Email <span style={{ float: "right" }}>:</span>{" "}
                  </td>
                  <th>
                    {detailTransaksiById
                      ? detailTransaksiById.detail_transaksi_by_id.email
                      : ""}
                  </th>
                </tr>
                <tr>
                  <td>
                    No Telepon <span style={{ float: "right" }}>:</span>{" "}
                  </td>
                  <th>
                    {detailTransaksiById
                      ? detailTransaksiById.detail_transaksi_by_id.no_telepon
                      : ""}
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <h6>Data Pembelian</h6>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Token</th>
                  <th>Harga</th>
                  <th>Point</th>
                  <th>Nama Toko</th>
                  <th>Claim</th>
                  <th>Kadaluarsa</th>
                </tr>
              </thead>
              <tbody>
                {transaksiById.transaksi_by_id?.length > 0 ? (
                  transaksiById.transaksi_by_id?.map((row, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{"*****" + row.no_token.substring(5, 16)}</td>
                      <td>{"Rp. " + row.harga.toLocaleString()}</td>
                      <td>{row.point_token}</td>
                      <td>{row.name}</td>
                      <td>{row.claim}</td>
                      <td>{row.expired_token}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colspan={11}>data kosong</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
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

export default Transaction;
