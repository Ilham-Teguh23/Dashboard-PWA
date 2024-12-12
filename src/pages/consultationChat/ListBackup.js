import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExternalLinkAlt,
    faSearch,
    faClock,
    faCommentDots,
    faCheckCircle,
    faTrash,
    faPencilAlt,
    faPaperPlane,
    faRedo,
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
    Tab,
    Nav,
    Modal,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import Preloader from "../../components/Preloader";
import { TnosDataTable } from "../../components/TnosDataTable";
import EditorRte from "../../components/EditorRte";
import Toastify from "../../components/Toastify";
import ReadableDateTime from "../../components/ReadableDateTime";
import DateBetweenFilter from "../../components/DateBetweenFilter";
import moment from "moment";
import { toast } from "react-toastify";

export default () => {

    const [getUserGroupId] = useState(localStorage.getItem("user_group_id"));
    const [getPermission, setPermission] = useState([]);
    const [getPermissionTab, setPermissionTab] = useState([]);
    const [activeTab, setActiveTab] = useState("0_tab")
    const [isLoading, setIsLoading] = useState(false);
    const [getAllData, setAllData] = useState();
    const [getData, setData] = useState();
    const [getGlobalId, setGlobalId] = useState();
    const [getConsul, setConsul] = useState();
    //   Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //   Text Editor (handleEditorChange akan dipanggil setiap kali nilai pada EditorRte berubah)
    const handleEditorChange = (value) => {
        localStorage.setItem("webAnswer", value);
    };

    const infoFitur = () => {
        return Toastify("Fitur ini masih proses pembuatan", "info");
    };

    const onFormSubmit = (e) => {

        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target);

        let toasMsg =
            formData.get("statusChat") === "W" ? "Mengirim" : "Memperbarui";

        const now = new Date();
        const formattedDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        const combine = `${formData.get('appAnswer')}\n\n${formData.get('templateAnswerApp')}\n\n#Tgl: ${formattedDate}`
        
        fetch(`${process.env.REACT_APP_CONSUL_CHAT}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                answer: combine,
                // answer_web: localStorage.getItem("webAnswer"),
                answer_web: "",
                id: parseInt(formData.get("idAnswer")),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {

                    Promise.all(
                        getPermission.map((status) =>
                            fetch(
                                `${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/${status}`,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            ).then((res) => res.json())
                        )
                    )
                        .then((data) => {

                            console.log("DATA SUCCESS 2");
                            console.log(data);

                            const dataArray = data.map((item) =>
                                item.status === "success" ? item.data : []
                            );

                            setData(dataArray);
                            setAllData(dataArray);
                            handleClose();
                            setIsLoading(false);
                            toast.success(`Berhasil ${toasMsg} Jawaban`);
                        })
                        .catch((err) => {
                            console.log(err);
                            toast.error(`Gagal ${toasMsg} Jawaban`);
                        });
                } else {
                    toast.success(`Gagal ${toasMsg} Jawaban`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onApprove = (id) => {
        setGlobalId(id);
        setIsLoading(true);

        fetch(`${process.env.REACT_APP_CONSUL_CHAT}/approve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: parseInt(id),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    Promise.all(
                        getPermission.map((status) =>
                            fetch(
                                `${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/${status}`,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            ).then((res) => res.json())
                        )
                    )
                        .then((data) => {
                            const dataArray = data.map((item) =>
                                item.status === "success" ? item.data : []
                            );
                            setData(dataArray);
                            setAllData(dataArray);
                            handleClose();
                            setIsLoading(false);
                            Toastify(`Berhasil Menyetujui Jawaban`);
                        })
                        .catch((err) => {
                            console.log(err);
                            Toastify(`Gagal Menyetujui Jawaban`, "error");
                        });
                } else {
                    Toastify(`Gagal Menyetujui Jawaban`, "error");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        const getStatusPermission = (statusArr) => {
            const permissionMap = {
                W: [faClock, "Menunggu"],
                A: [faCommentDots, "Terjawab"],
                Y: [faCheckCircle, "Disetujui"],
            };

            const permission = statusArr.map((status) => status);
            const permissionTab = statusArr.map((status) => permissionMap[status]);

            return { permission, permissionTab };
        };

        const permissionConfig = {
            4: getStatusPermission(["W", "A", "Y"]),
            7: getStatusPermission(["W", "A", "Y"]),
            10: getStatusPermission(["W", "A", "Y"]),
            11: getStatusPermission(["A", "Y"]),
        };

        let permission = ["Y"];
        let permissionTab = [[faCheckCircle, "Disetujui"]];
        const userGroupId = getUserGroupId;

        for (const [groupId, config] of Object.entries(permissionConfig)) {
            if (groupId === userGroupId) {
                permission = config.permission;
                permissionTab = config.permissionTab;
                break;
            }
        }

        setPermission(permission);
        setPermissionTab(permissionTab);

        Promise.all(
            permission.map((status) =>
                fetch(`${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/${status}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((res) => res.json())
            )
        )
            .then((data) => {

                const dataArray = data.map((item) =>
                    item.status === "success" ? item.data : []
                );
                setData(dataArray);
                setAllData(dataArray);
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const onFilterClicked = (e) => {
        let datas = [...getAllData];

        e.preventDefault();
        const formData = new FormData(e.target);
        let sid = parseInt(formData.get("status_id"));
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
            datas[sid] = getAllData[sid].filter(
                (item) =>
                    allSearchFun(item.id, "num") ||
                    allSearchFun(item.tconsult_createby) ||
                    allSearchFun(item.tconsult_name, "tlc") ||
                    allSearchFun(item.tconsult_ask, "tlc") ||
                    allSearchFun(item.tconsult_answer, "tlc") ||
                    allSearchFun(item.tconsult_answer_web, "tlc")
            );
        }

        datas[sid] = DateBetweenFilter(
            datas[sid],
            "tconsult_createat",
            formData.get("start_date_time"),
            formData.get("end_date_time")
        );

        setData(datas);
    };

    const handleSelect = (selectedKey) => {
        setActiveTab(selectedKey)
    }

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
                {activeTab === "0_tab" ? (
                    ""
                ) : (
                    <td>{tconsult_answer.match(/#Tgl:\s*(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{1,2}:\d{1,2})/)?.[1] || ''}</td>
                ) }
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
                    {tconsult_status !== "Y" && (
                        <>
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                overlay={
                                    <Tooltip>
                                        {tconsult_status === "W" ? "Jawab" : "Perbarui Jawaban"}
                                    </Tooltip>
                                }
                            >
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="text-white"
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
                                >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Button>
                            </OverlayTrigger>
                            &nbsp; &nbsp;
                        </>
                    )}
                    {tconsult_status === "A" &&
                        (getUserGroupId === "4" || getUserGroupId === "11") ? (
                        <>
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
                                                overlay={<Tooltip>Menyetujui</Tooltip>}
                                            >
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => {
                                                        onApprove(id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </Button>
                                            </OverlayTrigger>
                                            &nbsp; &nbsp;
                                        </>
                                    )}
                                </>
                            ) : (
                                <OverlayTrigger
                                    trigger={["hover", "focus"]}
                                    overlay={<Tooltip>Menyetujui</Tooltip>}
                                >
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => {
                                            onApprove(id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    </Button>
                                </OverlayTrigger>
                            )}
                            &nbsp; &nbsp;
                        </>
                    ) : (
                        <></>
                    )}
                    {getUserGroupId === "4" || getUserGroupId === "11" ? (
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>Kirim ke Spam</Tooltip>}
                        >
                            <Button
                                variant="danger"
                                size="sm"
                                className="text-white"
                                onClick={() => {
                                    infoFitur();
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </OverlayTrigger>
                    ) : (
                        <></>
                    )}
                </td>
            </tr>
        );
    }

    return (
        <>
            <Preloader show={!getData ? true : false} />
            <Col xl={12} className="mt-2">
                <Tab.Container defaultActiveKey="0_tab">
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs" activeKey={activeTab} onSelect={handleSelect}>
                                {getPermissionTab.map((tabItem, i) => (
                                    <Nav.Item>
                                        <Nav.Link eventKey={`${i}_tab`}>
                                            <FontAwesomeIcon icon={tabItem[0]} /> {tabItem[1]}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                {getData?.map((statusData, i) => (
                                    <Tab.Pane eventKey={`${i}_tab`} key={`${i}_tab`}>
                                        <Card border="light">
                                            <Card.Body>
                                                <Form
                                                    onSubmit={onFilterClicked}
                                                    className="navbar-search mb-3"
                                                >
                                                    <input type="hidden" name="status_id" value={i} />
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
                                                                        id={`${i}_all_search`}
                                                                        name="all_search"
                                                                    />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="datetime-local"
                                                                    id={`${i}_start_date_time`}
                                                                    name="start_date_time"
                                                                    step="1"
                                                                    defaultValue="2022-01-01T00:00:00"
                                                                    required
                                                                />
                                                                <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                                <Form.Control
                                                                    type="datetime-local"
                                                                    id={`${i}_end_date_time`}
                                                                    name="end_date_time"
                                                                    step="1"
                                                                    defaultValue={moment().format(
                                                                        "YYYY-MM-DDTHH:mm:ss"
                                                                    )}
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
                                                    <em>Menampilkan {getData[i].length} Data</em>
                                                </small>
                                                <TnosDataTable
                                                    reload={false}
                                                    data={
                                                        <>
                                                            <thead className="thead-light">
                                                                <tr className="text-center">
                                                                    <th className="border-0">No.</th>
                                                                    <th className="border-0">Id</th>
                                                                    {i === 0 ? (
                                                                        ""
                                                                    ) : (
                                                                        <th className="border-0">Tanggal Jawab</th>

                                                                    ) }
                                                                    <th className="border-0">Tanggal Dibuat</th>
                                                                    <th className="border-0">Dibuat Oleh</th>
                                                                    <th className="border-0">Nama</th>
                                                                    <th className="border-0">Pertanyaan</th>
                                                                    <th className="border-0"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {statusData?.length > 0 ? (
                                                                    statusData?.map((m, index) => (
                                                                        <TableRow
                                                                            key={`${index}-${m.mmbr_code}`}
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
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Form onSubmit={onFormSubmit} method="POST">
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
                        <Form.Group className="mb-3">
                            <Form.Label>Jawaban untuk Aplikasi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="appAnswer"
                                defaultValue={getConsul?.tconsult_answer}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Template Jawaban Aplikasi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="templateAnswerApp"
                                style={{ textAlign: "left" }}
                                defaultValue={`Tim Pengacara TNOS
            
Jika Anda ingin mendapatkan jawaban yang lebih detail dan solusi atas permasalahan hukum yang ada, Silahkan melakukan konsultasi melalui Video Call dengan Mitra Pengacara TNOS. Manfaatkan tarif promo sebesar 400 ribu untuk konsultasi sepuasnya. Untuk bantuan dan informasi lebih detail agar menghubungi CRM di no (+62) 8119595493`}
                            />
                        </Form.Group>
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Jawaban untuk Website</Form.Label>
                            <EditorRte
                                onChange={handleEditorChange}
                                defaultValue={getConsul?.tconsult_answer_web}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Template Jawaban Website</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="templateAnswerWebsite"
                                defaultValue="Jika ingin bertanya solusi hukum atau persoalan lainnya dengan detail, Anda bisa akses dan telusuri fitur lengkap layanan hukum Kami di Aplikasi TNOS.
Dapatkan penawaran menarik seperti promo layanan Konsultasi Hukum via Video Call sepuasnya, hanya 400 ribu.
Untuk informasi lebih detail, Anda dapat menghubungi CRM Kami di nomor (+62) 8119595493."
                            />
                        </Form.Group> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            onClick={() => {
                                infoFitur();
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Kirim ke Spam
                        </Button>
                        {getConsul?.tconsult_status === "W" ? (
                            <>
                                {isLoading ? (
                                    <Button variant="primary" disabled>
                                        <FontAwesomeIcon icon={faRedo} spin /> Loading
                                    </Button>
                                ) : (
                                    <Button variant="primary" type="submit">
                                        <FontAwesomeIcon icon={faPaperPlane} /> Kirim
                                    </Button>
                                )}
                            </>
                        ) : getConsul?.tconsult_status === "A" ? (
                            <>
                                {isLoading ? (
                                    <Button variant="primary" disabled>
                                        <FontAwesomeIcon icon={faRedo} spin /> Loading
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="warning"
                                            className="text-white"
                                            type="submit"
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} /> Perbarui
                                        </Button>
                                        {getUserGroupId === "4" || getUserGroupId === "11" ? (
                                            <Button
                                                variant="success"
                                                onClick={() => {
                                                    onApprove(getConsul?.id);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} /> Menyetujui
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            ""
                        )}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}