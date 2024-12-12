import { faPlus, faSearch, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Card, Col, Form, InputGroup, Modal, Nav, Row, Tab, Table } from "@themesberg/react-bootstrap"
import React, { useEffect, useState } from "react"

export default () => {

    const [showModal, setShowModal] = useState(false)
    const handleShowPengguna = () => setShowModal(true)
    const handleClosePengguna = () => setShowModal(false)
    const [user, setUser] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [formData, setFormData] = useState({})

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_TAB_URL}/fcmtoken/user/on`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json()
            let extractedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []

            setUser(extractedData)
            setSelectedUsers([])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selectedUsers.length > 0) {
            localStorage.setItem('selectedUsers', JSON.stringify(selectedUsers))
        } else {
            localStorage.removeItem('selectedUsers')
        }
    }, [selectedUsers]);

    useEffect(() => {
        const savedSelectedUsers = localStorage.getItem('selectedUsers');
        if (savedSelectedUsers) {
            setSelectedUsers(JSON.parse(savedSelectedUsers))
        }
    }, [])

    const handleSelectAll = () => {
        setSelectAll(!selectAll)

        if (!selectAll) {
            setSelectedUsers(user.map((item) => ({ mmbr_code: item.mmbr_code, fcmtoken: item.fcmtoken })))
        } else {
            setSelectedUsers([])
        }
    }

    const handleCheckboxChange = (userId, fcmToken) => {
        const newSelectedUsers = selectedUsers.find(user => user.mmbr_code === userId)
            ? selectedUsers.filter(user => user.mmbr_code !== userId) 
            : [...selectedUsers, { mmbr_code: userId, fcmtoken: fcmToken }]
        setSelectedUsers(newSelectedUsers);
    };

    const isAllSelected = selectedUsers.length === user.length

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setSelectAll(false)
        } else if (selectedUsers.length === user.length) {
            setSelectAll(true)
        }
    }, [selectedUsers, user.length]);

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            const storeUsers = localStorage.getItem("selectedUsers")
            const selectedUsers = JSON.parse(storeUsers)

            const memberCodes = selectedUsers.map((user) => user.mmbr_code)
            const fcmTokens = selectedUsers.map((user) => user.fcmtoken)

            const response = await fetch(`https://api-tab.tnos.app/api/broadcast/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.judulPesan,
                    body: formData.kutipan,
                    member_code: memberCodes,
                    token: fcmTokens
                })
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Row>
                <Col md={5}>
                    <Card>
                        <Card.Header>
                            <FontAwesomeIcon icon={faPlus} /> Tambah Informasi Pesan
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <label htmlFor="judulPesan" className="form-label">
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="judulPesan"
                                    name="judulPesan"
                                    value={formData.judulPesan || ''}
                                    placeholder="Masukkan Judul Pesan"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="durasi" className="form-label">
                                    Pilih Data Pengguna
                                </label>
                                <br />
                                <button
                                    className="btn btn-primary mt-2 btn-sm btn-block"
                                    onClick={handleShowPengguna}
                                >
                                    <FontAwesomeIcon icon={faUser} /> Data Pengguna
                                </button>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="kutipan" className="form-label">
                                    Kutipan
                                </label>
                                <textarea
                                    name="kutipan"
                                    id="kutipan"
                                    cols="5"
                                    rows="5"
                                    className="form-control"
                                    placeholder="Masukkan Kutipan"
                                    value={formData.kutipan || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Button type="reset" variant="danger">
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                            >
                                Kirim
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card>
                        <Card.Body>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {showModal && (
                <Modal show={showModal} onHide={handleClosePengguna} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FontAwesomeIcon icon={faUser} /> List Data Pengguna</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Container defaultActiveKey="user">
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="user">User</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="responder">Responder</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="user">
                                    <Card>
                                        <Card.Body>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form>
                                                        <Form.Group id="topbarSearch">
                                                            <Form.Label>Cari Pengguna</Form.Label>
                                                            <InputGroup className="input-group-merge search-bar">
                                                                <InputGroup.Text>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </InputGroup.Text>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Cari Pengguna"
                                                                    id="all_search"
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>
                                            <div style={{ maxHeight: '400px', overflowY: "auto" }}>
                                                <Table className="table table-hover align-items-center">
                                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    style={{ cursor: 'pointer' }}
                                                                    checked={isAllSelected}
                                                                    onChange={handleSelectAll}
                                                                />
                                                            </th>
                                                            <th>Nama</th>
                                                            <th className="text-center">No. HP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {user.length > 0 ? (
                                                            user.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                style={{ cursor: 'pointer' }}
                                                                                checked={selectedUsers.some(user => user.mmbr_code === item.mmbr_code)}
                                                                                onChange={() => handleCheckboxChange(item.mmbr_code, item.fcmtoken)}
                                                                            />
                                                                        </td>
                                                                        <td>{item.mmbr_name}</td>
                                                                        <td className="text-center">{item.mmbr_phone}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="2" className="text-center">No users found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="responder">
                                    <Card>
                                        <Card.Body>
                                            <div style={{ maxHeight: '400px', overflowY: "auto" }}>
                                                <Table className="table table-hover align-items-center">
                                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                                        <tr>
                                                            <th className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </th>
                                                            <th>Nama</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Widia Rahani</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">
                                                                <input type="checkbox" style={{ cursor: 'pointer' }} />
                                                            </td>
                                                            <td>Responder Mohammad Ilham</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )

}