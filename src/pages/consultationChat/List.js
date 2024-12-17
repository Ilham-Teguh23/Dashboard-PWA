import { faCheckCircle, faClock, faCommentDots, faExternalLinkAlt, faPaperPlane, faPencilAlt, faPrint, faRedo, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Nav, OverlayTrigger, Row, Tab, Tooltip } from "@themesberg/react-bootstrap"
import React, { act, useEffect, useState } from "react"
import { TnosDataTable } from "../../components/TnosDataTable"
import { Link } from "react-router-dom"
import moment from "moment"
import ReadableDateTime from "../../components/ReadableDateTime"
import Preloader from "../../components/Preloader"
import Loading from "../../components/Loading"
import { toast } from "react-toastify";

export default () => {

    const [selectedFilterTest, setSelectedFilterTest] = useState(1)
    const [getGlobalId, setGlobalId] = useState();
    const allowedGroup = [4, 11]

    const [getTabPaneDefault] = useState([
        {
            eventKey: "tab_menunggu",
            icon: faClock,
            title: "Menunggu",
            valueTab: "W"
        },
        {
            eventKey: "tab_terjawab",
            icon: faCommentDots,
            title: "Terjawab",
            valueTab: "A"
        },
        {
            eventKey: "tab_disetujui",
            icon: faCheckCircle,
            title: "Disetujui",
            valueTab: "Y"
        }
    ])

    const today = moment().format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)

    const [activeTab, setActiveTab] = useState("")
    const [getTabPane, setTabPane] = useState([]);
    const [tabData, setTabData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [loader, isLoader] = useState(false)

    const [getFilterTest] = useState([
        {
            key: "key_filter_0",
            value: 1,
            defaultValue: "Real"
        },
        {
            key: "key_filter_1",
            value: 2,
            defaultValue: "Test"
        }
    ])

    const handleSearchByDate = (e) => {

        e.preventDefault();

        if (!startDate || !endDate) {
            alert("Mohon isi tanggal mulai dan tanggal selesai.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
            return;
        }

        getTabPane.forEach((category) => {
            fetchData(category.eventKey)
        })
    }

    const [selectedItem, setSelectedItem] = useState(null)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setSelectedItem(item)
        setShow(true)
    }

    const fetchData = async (valueTab) => {
        setIsLoading(true);

        let statusValue = ""
        if (valueTab === "tab_menunggu") {
            statusValue = "W"
        } else if (valueTab === "tab_terjawab") {
            statusValue = "A"
        } else if (valueTab === "tab_disetujui") {
            statusValue = "Y"
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_CONSUL_DASH_CHAT}/status/${statusValue}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            let filtered = data?.data?.filter((item) => {
                const tconsultNameLower = item.tconsult_name.toLowerCase()

                const isTestFiltered = selectedFilterTest === 2
                    ? tconsultNameLower.includes("test")
                    : !tconsultNameLower.includes("test")

                return isTestFiltered
            })

            if (startDate && endDate) {

                filtered = filtered.filter(item => {
                    const itemDate = moment(item.tconsult_createat).format("YYYY-MM-DD");
                    const start = moment(startDate).startOf('day');
                    const end = moment(endDate).endOf('day');
                    return moment(itemDate).isBetween(start, end, null, '[]');
                });
            }

            setTabData((prev) => ({
                ...prev,
                [valueTab]: filtered || []
            }));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleTabSelect = (selectedKey) => {
        const selectedValueTab = getTabPane.find((tab) => tab.eventKey === selectedKey)?.eventKey;
        if (selectedValueTab) {
            setActiveTab(selectedValueTab);

            if (!tabData[selectedValueTab]) {
                fetchData(selectedValueTab);
            }
        }
    }

    useEffect(() => {
        const defaultValueTab = getTabPane[0]?.eventKey;
        if (defaultValueTab) {
            fetchData(defaultValueTab);
        }
    }, [getTabPane]);

    useEffect(() => {
        const userGroupId = parseInt(localStorage.getItem("user_group_id"), 10);

        if (userGroupId === 11) {
            setTabPane([
                {
                    eventKey: "tab_terjawab",
                    icon: faCommentDots,
                    title: "Terjawab",
                    valueTab: "A"
                },
                {
                    eventKey: "tab_disetujui",
                    icon: faCheckCircle,
                    title: "Disetujui",
                    valueTab: "Y"
                }
            ]);
            setActiveTab("tab_terjawab");
        } else {
            setTabPane(getTabPaneDefault);
            setActiveTab("tab_menunggu");
        }

    }, [])

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

    const onFormSubmit = (e) => {
        isLoader(true)
        e.preventDefault();

        const formData = new FormData(e.target);

        let toasMsg = formData.get("statusChat") === "W" ? "Mengirim" : "Memperbarui";

        const now = new Date();
        const formattedDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        let combine = ""
        if (activeTab === "tab_terjawab") {
            combine = `${formData.get('appAnswer')}\n\n${formData.get('templateAnswerApp')}\n\n#Tgl: ${formData.get("tglJawabOld")}`
        } else if (activeTab === "tab_menunggu") {
            combine = `${formData.get('appAnswer')}\n\n${formData.get('templateAnswerApp')}\n\n#Tgl: ${formattedDate}`
        }

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
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    handleClose();
                    setIsLoading(false);
                    isLoader(false)
                    toast.success(`Berhasil ${toasMsg} Jawaban`);

                    if (activeTab !== "tab_terjawab") {
                        setTabData((prev) => {
                            const updatedTabData = { ...prev };
                            updatedTabData[activeTab] = updatedTabData[activeTab]?.filter(
                                (item) => item.id !== parseInt(formData.get("idAnswer"))
                            );
                            return updatedTabData;
                        });

                        const currentTabIndex = getTabPane.findIndex((tab) => tab.eventKey === activeTab);
                        const nextTab = getTabPane[currentTabIndex + 1]?.eventKey;
                        if (nextTab) {
                            fetchData(nextTab);
                        }
                    } else {
                        fetchData(activeTab)
                    }
                }
            })
    }

    const processedAnswer = () => {
        if (!selectedItem?.tconsult_answer) return "";

        const fullAnswer = selectedItem.tconsult_answer;
        const cutPoint = fullAnswer.indexOf("Tim Pengacara TNOS");

        if (cutPoint !== -1) {
            return fullAnswer.substring(0, cutPoint).trim();
        }

        return fullAnswer.trim();
    };

    const onApprove = (id) => {
        setGlobalId(id);
        isLoader(true);

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
                    handleClose();
                    setIsLoading(false);
                    isLoader(false)
                    toast.success(`Berhasil Menyetujui Jawaban`);

                    setTabData((prev) => {
                        const updatedTabData = { ...prev };
                        updatedTabData[activeTab] = updatedTabData[activeTab]?.filter(
                            (item) => item.id !== parseInt(id)
                        );
                        return updatedTabData;
                    });

                    const currentTabIndex = getTabPane.findIndex((tab) => tab.eventKey === activeTab);
                    const nextTab = getTabPane[currentTabIndex + 1]?.eventKey;
                    if (nextTab) {
                        fetchData(nextTab);
                    }
                } else {
                    toast.error(`Gagal Menyetujui Jawaban`)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Preloader show={!tabData ? true : false} />

            {isLoading && <Loading />}

            <Col xl={12} className="mt-2">
                <Tab.Container
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                >
                    <Row>
                        <Col lg={12}>
                            <Nav className="nav-tabs">
                                {getTabPane.map((category) => (
                                    <Nav.Item className="col-md-3" key={category.eventKey}>
                                        <Nav.Link
                                            eventKey={category.eventKey}
                                            className="text-center"
                                        >
                                            <FontAwesomeIcon icon={category.icon} className="me-2" />{" "}
                                            {category.title}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            <Tab.Content>
                                {getTabPane.map((category) => (
                                    <Tab.Pane key={category.eventKey} eventKey={category.eventKey}>
                                        <Card border="light">
                                            <Card.Body>

                                                <Row className="mb-3">
                                                    <Col md={3}>
                                                        <Form.Group id="filter_test">
                                                            <Form.Label>Filter</Form.Label>
                                                            <Form.Select
                                                                name="klasifikasi"
                                                                value={selectedFilterTest}
                                                                onChange={(e) => setSelectedFilterTest(parseInt(e.target.value))}
                                                                required
                                                            >
                                                                {getFilterTest?.map((item) => (
                                                                    <option key={item.key} value={item.value}>
                                                                        {item.defaultValue}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col md={5}>
                                                        <Form>
                                                            <Form.Group id="topbarSearch">
                                                                <Form.Label>Tanggal</Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        type="date"
                                                                        name="start_date_time"
                                                                        step="1"
                                                                        required
                                                                        value={startDate}
                                                                        onChange={(e) => setStartDate(e.target.value)}
                                                                    />
                                                                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                                                                    <Form.Control
                                                                        type="date"
                                                                        name="end_date_time"
                                                                        step="1"
                                                                        required
                                                                        value={endDate}
                                                                        onChange={(e) => setEndDate(e.target.value)}
                                                                    />
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={handleSearchByDate}
                                                                    >
                                                                        Search
                                                                    </Button>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                </Row>

                                                <TnosDataTable
                                                    data={
                                                        <>
                                                            <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                                <tr className="text-center">
                                                                    <th className="border-0">No.</th>
                                                                    <th className="border-0">Id</th>
                                                                    {category.valueTab === "A" || category.valueTab === "Y" ? (
                                                                        <th className="border-0">Tanggal Jawab</th>
                                                                    ) : ""}
                                                                    <th className="border-0">Tanggal Dibuat</th>
                                                                    <th className="border-0">Dibuat Oleh</th>
                                                                    <th className="border-0">Nama</th>
                                                                    <th className="border-0">Pertanyaan</th>
                                                                    <th className="border-0">Aksi</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tabData[category.eventKey] && tabData[category.eventKey].length > 0 ? (
                                                                    tabData[category.eventKey].map((item, index) => (
                                                                        <tr key={item.id}>
                                                                            <td className="text-center">{index + 1}.</td>
                                                                            <td className="text-center">{item.id}</td>
                                                                            {category.valueTab === "A" || category.valueTab === "Y" ? (
                                                                                <td>{item.tconsult_answer.match(/#Tgl:\s*(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{1,2}:\d{1,2})/)?.[1] || ''}</td>
                                                                            ) : ""}
                                                                            <td>{ReadableDateTime(item.tconsult_createat)}</td>
                                                                            <td>
                                                                                {iconLink(item.tconsult_createby, `/member/profile/${item.tconsult_createby}`)}
                                                                            </td>
                                                                            <td>{item.tconsult_name}</td>
                                                                            <td>
                                                                                {limitString(ucFirst(item.tconsult_ask))}{" "}
                                                                                <OverlayTrigger
                                                                                    trigger={["hover", "focus"]}
                                                                                    overlay={<Tooltip>Lihat</Tooltip>}
                                                                                >
                                                                                    <FontAwesomeIcon
                                                                                        icon={faExternalLinkAlt}
                                                                                        style={{ cursor: "pointer" }}
                                                                                        onClick={() => {
                                                                                            localStorage.setItem("webAnswer", item.tconsult_answer_web);
                                                                                            handleShow(item);
                                                                                        }}
                                                                                    />
                                                                                </OverlayTrigger>
                                                                            </td>
                                                                            <td>
                                                                                {item.tconsult_status !== "Y" && (
                                                                                    <>
                                                                                        <OverlayTrigger
                                                                                            trigger={["hover", "focus"]}
                                                                                            overlay={
                                                                                                <Tooltip>
                                                                                                    {item.tconsult_status === "W" ? "Jawab" : "Perbarui Jawaban"}
                                                                                                </Tooltip>
                                                                                            }
                                                                                        >
                                                                                            <Button
                                                                                                variant="warning"
                                                                                                size="sm"
                                                                                                className="text-white"
                                                                                                onClick={() => {
                                                                                                    handleShow(item)
                                                                                                }}
                                                                                            >
                                                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                        &nbsp; &nbsp;
                                                                                    </>
                                                                                )}
                                                                                {item.tconsult_status === "A" && (
                                                                                    (allowedGroup ? (
                                                                                        <>
                                                                                            {getGlobalId === item.id ? (
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
                                                                                                                onApprove(item.id);
                                                                                                            }}
                                                                                                        >
                                                                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                                                                        </Button>
                                                                                                    </OverlayTrigger>
                                                                                                    &nbsp; &nbsp;
                                                                                                </>
                                                                                            )}
                                                                                        </>
                                                                                    ) : "")
                                                                                )}
                                                                                -
                                                                                {/* {item.tconsult_status === "A" &&
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
                                                                                )} */}
                                                                                {/* {getUserGroupId === "4" || getUserGroupId === "11" ? (
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
                                                                                )} */}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr className="text-center">
                                                                        <td colSpan={category.valueTab === "W" ? 7 : 8}>No Data Available</td>
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
                            {selectedItem && (
                                <>
                                    {selectedItem?.id} (
                                    {iconLink(
                                        selectedItem?.tconsult_createby,
                                        `/member/profile/${selectedItem?.tconsult_createby}`
                                    )}{" "}
                                    - {selectedItem?.tconsult_name})
                                </>
                            )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="hidden" name="idAnswer" value={selectedItem?.id} />

                        {activeTab === "tab_terjawab" && (
                            <input type="hidden" name="tglJawabOld" value={selectedItem?.tconsult_answer.match(/#Tgl:\s*(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{1,2}:\d{1,2})/)?.[1] || ''} />
                        )}

                        <input
                            type="hidden"
                            name="statusChat"
                            value={selectedItem?.tconsult_status}
                        />
                        <strong>Pertanyaan :</strong>
                        <p>&nbsp; &nbsp; &nbsp;{selectedItem?.tconsult_ask}</p>
                        <Form.Group className="mb-3">
                            <Form.Label>Jawaban untuk Aplikasi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="appAnswer"
                                defaultValue={activeTab === "tab_terjawab" ? processedAnswer() : selectedItem?.tconsult_answer}
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
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button
                            variant="danger"
                        onClick={() => {
                            infoFitur();
                        }}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Kirim ke Spam
                        </Button> */}
                        {selectedItem && (
                            <>
                                {selectedItem?.tconsult_status === "W" ? (
                                    <>
                                        {loader ? (
                                            <Button variant="primary" disabled>
                                                <FontAwesomeIcon icon={faRedo} spin /> Loading
                                            </Button>
                                        ) : (
                                            <Button variant="primary" type="submit">
                                                <FontAwesomeIcon icon={faPaperPlane} /> Kirim
                                            </Button>
                                        )}
                                    </>
                                ) : selectedItem?.tconsult_status === "A" ? (
                                    <>
                                        {loader ? (
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
                                                {/* {getUserGroupId === "4" || getUserGroupId === "11" ? (
                                        <Button
                                            variant="success"
                                            onClick={() => {
                                                onApprove(selectedItem?.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} /> Menyetujui
                                        </Button>
                                    ) : (
                                        <></>
                                    )} */}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )

}