import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faSearch,
  faTrashAlt,
  faRedo,
  faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Card,
  Row,
  Button,
  Form,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import Preloader from "../../components/Preloader";
import { TnosDataTable } from "../../components/TnosDataTable";
import Toastify from "../../components/Toastify";
import ReadableDateTime from "../../components/ReadableDateTime";
import DateBetweenFilter from "../../components/DateBetweenFilter";
import moment from "moment";

export default () => {
  // General
  const [isLoading] = useState(false);
  const [getAllData, setAllData] = useState();
  const [getData, setData] = useState();
  const [getGlobalId] = useState();
  const [getConsul, setConsul] = useState();
  //   Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const onApprove = (id) => {
  //   setGlobalId(id);
  // };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/N`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setData(data.data);
          setAllData(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const limitString = (str) => {
    if (str.length > 15) {
      return str.substring(0, 15) + "...";
    } else {
      return str;
    }
  };

  const ucFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const iconLink = (value, url) => {
    return (
      <>
        {value} &nbsp;
        <OverlayTrigger
          trigger={["hover", "focus"]}
          overlay={<Tooltip>Lihat</Tooltip>}
        >
          <Link
            to={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Link>
        </OverlayTrigger>
      </>
    );
  };

  const infoFitur = () => {
    return Toastify("Fitur ini masih proses pembuatan", "info");
  };

  const onFilterClicked = (e) => {
    let datas = [...getAllData];

    e.preventDefault();
    const formData = new FormData(e.target);
    let allSearch = formData.get("all_search");

    const allSearchFun = (item, type = "normal") => {
      item = !item ? "" : item;

      if (type === "tlc") {
        return item.toLowerCase().includes(allSearch.toLowerCase());
      }
      if (type === "num") {
        return item.toString().includes(allSearch);
      }

      return item.includes(allSearch);
    };

    if (formData.get("all_search").length > 0) {
      datas = getAllData.filter(
        (item) =>
          allSearchFun(item.id, "num") ||
          allSearchFun(item.tconsult_createby) ||
          allSearchFun(item.tconsult_name, "tlc") ||
          allSearchFun(item.tconsult_ask, "tlc")
      );
    }

    datas = DateBetweenFilter(
      datas,
      "tconsult_createat",
      formData.get("start_date_time"),
      formData.get("end_date_time")
    );

    setData(datas);
  };

  const TableRow = (props) => {
    const {
      id,
      tconsult_createat,
      tconsult_createby,
      tconsult_name,
      tconsult_ask,
      tconsult_status,
      tconsult_answer,
      tconsult_answer_web,
    } = props;

    return (
      <tr className="text-center">
        <td>{props.num}</td>
        <td>{id}</td>
        <td>{ReadableDateTime(tconsult_createat)}</td>
        <td>
          {iconLink(tconsult_createby, `/member/profile/${tconsult_createby}`)}
        </td>
        <td>{tconsult_name}</td>
        <td>
          {limitString(ucFirst(tconsult_ask))}{" "}
          <OverlayTrigger
            trigger={["hover", "focus"]}
            overlay={<Tooltip>Lihat</Tooltip>}
          >
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.setItem("webAnswer", tconsult_answer_web);
                setConsul({
                  id,
                  tconsult_createby,
                  tconsult_name,
                  tconsult_ask: ucFirst(tconsult_ask),
                  tconsult_status,
                  tconsult_answer,
                  tconsult_answer_web,
                });
                handleShow();
              }}
            />
          </OverlayTrigger>
        </td>
        <td>
          {isLoading ? (
            <>
              {getGlobalId === id ? (
                <Button variant="primary" size="sm" disabled>
                  <FontAwesomeIcon icon={faRedo} spin />
                </Button>
              ) : (
                <>
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    overlay={<Tooltip>Pulihkan Chat</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        // onApprove(id);
                        infoFitur();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashRestore} />
                    </Button>
                  </OverlayTrigger>
                </>
              )}
            </>
          ) : (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Pulihkan Chat</Tooltip>}
            >
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // onApprove(id);
                  infoFitur();
                }}
              >
                <FontAwesomeIcon icon={faTrashRestore} />
              </Button>
            </OverlayTrigger>
          )}
          &nbsp; &nbsp;
          {isLoading ? (
            <>
              {getGlobalId === id ? (
                <Button variant="primary" size="sm" disabled>
                  <FontAwesomeIcon icon={faRedo} spin />
                </Button>
              ) : (
                <>
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    overlay={<Tooltip>Hapus Permanen</Tooltip>}
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        // onApprove(id);
                        infoFitur();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </OverlayTrigger>
                </>
              )}
            </>
          ) : (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Tooltip>Hapus Permanen</Tooltip>}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  // onApprove(id);
                  infoFitur();
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </OverlayTrigger>
          )}
        </td>
      </tr>
    );
  };

  return (
    <>
      <Preloader show={!getData ? true : false} />
      <Col xl={12} className="mt-2">
        <Card border="light">
          <Card.Body>
            <Form onSubmit={onFilterClicked} className="navbar-search mb-3">
              <Row>
                <Col xs={12} md={4}>
                  <Form.Group>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Cari Id, Nama, atau Pertanyaan..."
                        name="all_search"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <InputGroup>
                    <Form.Control
                      type="datetime-local"
                      name="start_date_time"
                      step="1"
                      defaultValue="2022-01-01T00:00:00"
                      required
                    />
                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      name="end_date_time"
                      step="1"
                      defaultValue={moment().format("YYYY-MM-DDTHH:mm:ss")}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md={2}>
                  <Button variant="primary" type="submit">
                    Filter
                  </Button>
                  &nbsp;
                  <Button
                    variant="grey"
                    onClick={() => {
                      window.location.reload();
                    }}
                    style={{ borderColor: "grey" }}
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </Button>
                </Col>
              </Row>
            </Form>
            <small>
              <em>Menampilkan {getData?.length} Data Chat Spam</em>
            </small>
            <TnosDataTable
              reload={false}
              data={
                <>
                  <thead className="thead-light">
                    <tr className="text-center">
                      <th className="border-0">No.</th>
                      <th className="border-0">Id</th>
                      <th className="border-0">Tanggal Dibuat</th>
                      <th className="border-0">Dibuat Oleh</th>
                      <th className="border-0">Nama</th>
                      <th className="border-0">Pertanyaan</th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getData?.length > 0 ? (
                      getData?.map((m, index) => (
                        <TableRow
                          key={`${index}-${m.id}`}
                          {...m}
                          num={index + 1}
                        />
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colspan={9}>Tidak ada data</td>
                      </tr>
                    )}
                  </tbody>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Col>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {getConsul?.id} (
            {iconLink(
              getConsul?.tconsult_createby,
              `/member/profile/${getConsul?.tconsult_createby}`
            )}{" "}
            - {getConsul?.tconsult_name})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="hidden" name="idAnswer" value={getConsul?.id} />
          <input
            type="hidden"
            name="statusChat"
            value={getConsul?.tconsult_status}
          />
          <strong>Pertanyaan :</strong>
          <p>&nbsp; &nbsp; &nbsp;{getConsul?.tconsult_ask}</p>
        </Modal.Body>
        <Modal.Footer>
          {isLoading ? (
            <>
              {getGlobalId === getConsul?.id ? (
                <Button variant="primary" disabled>
                  <FontAwesomeIcon icon={faRedo} spin /> Loading
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // onApprove(getConsul?.id);
                      infoFitur();
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashRestore} /> Pulihkan Chat
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                // onApprove(getConsul?.id);
                infoFitur();
              }}
            >
              <FontAwesomeIcon icon={faTrashRestore} /> Pulihkan Chat
            </Button>
          )}
          &nbsp; &nbsp;
          {isLoading ? (
            <>
              {getGlobalId === getConsul?.id ? (
                <Button variant="primary" size="sm" disabled>
                  <FontAwesomeIcon icon={faRedo} spin /> Loading
                </Button>
              ) : (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      // onApprove(getConsul?.id);
                      infoFitur();
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Hapus Permanen
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              variant="danger"
              onClick={() => {
                // onApprove(getConsul?.id);
                infoFitur();
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} /> Hapus Permanen
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
