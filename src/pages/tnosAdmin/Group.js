import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faPencilAlt,
    faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import {
    Card,
    Alert,
    Table,
    Button,
    Row,
    Col,
    Badge,
    Tab,
    Form,
    Modal,
    InputGroup,
} from "@themesberg/react-bootstrap";
import FlashMessage from "react-flash-message";

export default () => {
    const [getGroupData, setGroupData] = useState();
    const [getSelectedGroupId, setSelectedGroupId] = useState(
        parseInt(localStorage.getItem("getGroupAccessId"))
            ? parseInt(localStorage.getItem("getGroupAccessId"))
            : 1
    );
    const [getMenuAccess, setMenuAccess] = useState();
    const [getMenuData, setMenuData] = useState([]);
    const [getMenuDataCheck, setMenuDataCheck] = useState();
    const [getSubMenuData, setSubMenuData] = useState([]);
    const [getSubMenuDataCheck, setSubMenuDataCheck] = useState();
    const [getModalShowDefault, setModalShowDefault] = useState(false);
    const [getGroupNameChange, setGroupNameChange] = useState();
    const handleClose = () => setModalShowDefault(false);
    const [formErr, setFormErr] = useState(false);
    const [getInnerAlert, setInnerAlert] = useState();
    const [showAlert, setShowAlert] = useState(false);

    const [getFlashMesage, setFlashMessage] = useState({
        status: false,
        message: "",
        color: "",
    });

    const TableRow = (props) => {
        const { id, name } = props;

        return (
            <tr>
                <td>{props.num}</td>
                <td className={getSelectedGroupId === id && "fw-bolder"}>
                    {getSelectedGroupId === id && (
                        <>
                            <FontAwesomeIcon icon={faArrowCircleRight} />
                            &nbsp;
                        </>
                    )}
                    {name}
                </td>
                <td className="text-center">
                    <Button
                        variant="warning"
                        size="sm"
                        className="text-white"
                        onClick={() => {
                            setSelectedGroupId(id);
                            let menuDataCheck = [];
                            let subMenuDataCheck = [];

                            getMenuAccess.forEach((menu) => {
                                if (id === menu.tnos_admin_group_id) {
                                    let menuIds = menu.menu_ids;

                                    if (menuIds !== null) {
                                        let menuIdsCheck = menuIds.split(",").map(function (item) {
                                            return parseInt(item);
                                        });
                                        getMenuData.forEach((menu) => {
                                            menuDataCheck.push({
                                                id: menu.id,
                                                name: menu.name,
                                                checked: menuIdsCheck.includes(menu.id),
                                            });
                                        });
                                    } else {
                                        getMenuData.forEach((menu) => {
                                            menuDataCheck.push({
                                                id: menu.id,
                                                name: menu.name,
                                                checked: false,
                                            });
                                        });
                                    }
                                }
                            });

                            getMenuAccess.forEach((menu) => {
                                if (id === menu.tnos_admin_group_id) {
                                    let subMenuIds = menu.sub_menu_ids;
                                    let readWriteIds = menu.read_write_ids;

                                    if (subMenuIds !== null) {
                                        let subMenuIdsCheck = subMenuIds
                                            .split(",")
                                            .map(function (item) {
                                                return parseInt(item);
                                            });
                                        let readWriteIdsCheck = readWriteIds
                                            .split(",")
                                            .map(function (item) {
                                                return parseInt(item);
                                            });
                                        getSubMenuData.forEach((subMenu) => {
                                            subMenuDataCheck.push({
                                                id: subMenu.id,
                                                name: subMenu.name,
                                                menu_id: subMenu.menu_id,
                                                checked: subMenuIdsCheck.includes(subMenu.id),
                                                readwrite: readWriteIdsCheck.includes(subMenu.id),
                                            });
                                        });
                                    } else {
                                        getSubMenuData.forEach((subMenu) => {
                                            subMenuDataCheck.push({
                                                id: subMenu.id,
                                                name: subMenu.name,
                                                menu_id: subMenu.menu_id,
                                                checked: false,
                                            });
                                        });
                                    }
                                }
                            });

                            setMenuDataCheck(menuDataCheck);
                            setSubMenuDataCheck(subMenuDataCheck);
                        }}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                </td>
            </tr>
        );
    };

    const handleGroupAdd = () => {
        if (getGroupNameChange.length > 0) {
            fetch(`${process.env.REACT_APP_API_URL}/admin-group-create`, {
                method: "POST",
                body: JSON.stringify({ name: getGroupNameChange }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data[0].statusCode === "200") {
                        setInnerAlert({
                            color: "success",
                            message: "Berhasil menambahkan grup",
                        });
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                            window.location.reload();
                        }, 3000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setFormErr(true);
            setTimeout(() => {
                setFormErr(false);
            }, 3000);
        }
    };

    const handleGroupNameChange = (e) => {
        setGroupNameChange(e.target.value);
    };

    const updateGroupData = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const getDatas = [
            {
                name: "menu",
                item: getMenuData,
                ids: [],
            },
            {
                name: "sub_menu",
                item: getSubMenuData,
                ids: [],
            },
            {
                name: "sub_menu_readwrite",
                item: getSubMenuData,
                ids: [],
            },
        ];

        getDatas.forEach((data) => {
            data.item.forEach((subData) => {
                formData.get(data.name + "_" + subData.id) === "on" &&
                    data.ids.push(subData.id);
            });
        });

        fetch(
            `${process.env.REACT_APP_API_URL}/admin-group-menu-access/${getSelectedGroupId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    group_name: formData.get("group_name"),
                    menu_ids: getDatas[0].ids.toString(),
                    sub_menu_ids: getDatas[1].ids.toString(),
                    read_write_ids: getDatas[2].ids.toString(),
                }),
            }
        )
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
                        localStorage.setItem("getGroupAccessId", getSelectedGroupId);
                        window.location.reload();
                    }, 3000);
                } else {
                    console.log("error");
                }
            });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/admin-group`)
            .then((res) => res.json())
            .then((data) => {
                setGroupData(data);
            });
        fetch(`${process.env.REACT_APP_API_URL}/menu`)
            .then((res) => res.json())
            .then((data) => {

                console.log("Menu");
                console.log(data);
                
                setMenuData(data);
            });
        fetch(`${process.env.REACT_APP_API_URL}/sub-menu`)
            .then((res) => res.json())
            .then((data) => {

                console.log("Sub Menu");
                console.log(data);
            
                setSubMenuData(data);
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/admin-group-menu-access`)
            .then((res) => res.json())
            .then((data) => {

                console.log("Group Menu Access");
                console.log(data);
                

                fetch(`${process.env.REACT_APP_API_URL}/menu`)
                    .then((res) => res.json())
                    .then((menuData) => {

                        console.log("Menu Access");
                        console.log(menuData);
                        
                        
                        let menuDataCheck = [];
                        data.forEach((menu) => {
                            if (getSelectedGroupId === menu.tnos_admin_group_id) {
                                let menuIds = menu.menu_ids;

                                if (menuIds !== null) {
                                    let menuIdsCheck = menuIds.split(",").map(function (item) {
                                        return parseInt(item);
                                    });
                                    menuData.forEach((menu) => {
                                        menuDataCheck.push({
                                            id: menu.id,
                                            name: menu.name,
                                            checked: menuIdsCheck.includes(menu.id),
                                        });
                                    });
                                } else {
                                    menuData.forEach((menu) => {
                                        menuDataCheck.push({
                                            id: menu.id,
                                            name: menu.name,
                                            checked: false,
                                        });
                                    });
                                }
                            }
                        });
                        setMenuDataCheck(menuDataCheck);
                    });
                fetch(`${process.env.REACT_APP_API_URL}/sub-menu`)
                    .then((res) => res.json())
                    .then((subMenuData) => {
                        let subMenuDataCheck = [];
                        data.forEach((subMenu) => {
                            if (getSelectedGroupId === subMenu.tnos_admin_group_id) {
                                let subMenuIds = subMenu.sub_menu_ids;
                                let readWriteIds = subMenu.read_write_ids;

                                if (subMenuIds !== null) {
                                    let subMenuIdsCheck = subMenuIds
                                        .split(",")
                                        .map(function (item) {
                                            return parseInt(item);
                                        });
                                    let readWriteIdsCheck = readWriteIds
                                        .split(",")
                                        .map(function (item) {
                                            return parseInt(item);
                                        });
                                    subMenuData.forEach((subMenu) => {
                                        subMenuDataCheck.push({
                                            id: subMenu.id,
                                            name: subMenu.name,
                                            menu_id: subMenu.menu_id,
                                            checked: subMenuIdsCheck.includes(subMenu.id),
                                            readwrite: readWriteIdsCheck.includes(subMenu.id),
                                        });
                                    });
                                } else {
                                    subMenuData.forEach((subMenu) => {
                                        subMenuDataCheck.push({
                                            id: subMenu.id,
                                            name: subMenu.name,
                                            menu_id: subMenu.menu_id,
                                            checked: false,
                                        });
                                    });
                                }
                            }
                        });
                        setSubMenuDataCheck(subMenuDataCheck);
                    });

                setMenuAccess(data);
            });
    }, [getFlashMesage, getSelectedGroupId]);

    return (
        <>
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                <Row>
                    <Col md={5}>
                        <Card border="light" className="shadow-sm mb-4 mt-3">
                            <Card.Body className="pb-0">
                                <Table
                                    responsive
                                    className="table-centered table-nowrap rounded mb-0"
                                >
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="border-0">No.</th>
                                            <th className="border-0">Nama Grup</th>
                                            <th className="border-0 text-center">
                                                <Badge
                                                    bg="primary"
                                                    className="badge-lg"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setModalShowDefault(true);
                                                        setGroupNameChange("");
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                    &nbsp; Tambah
                                                </Badge>
                                                <Modal
                                                    as={Modal.Dialog}
                                                    centered
                                                    show={getModalShowDefault}
                                                    onHide={handleClose}
                                                >
                                                    <Modal.Header>
                                                        <Modal.Title className="h6">
                                                            Tambah Grup
                                                        </Modal.Title>
                                                        <Button
                                                            variant="close"
                                                            aria-label="Close"
                                                            onClick={handleClose}
                                                        />
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        {showAlert && (
                                                            <Alert
                                                                variant={getInnerAlert.color}
                                                                onClose={() => setShowAlert(false)}
                                                                dismissible
                                                            >
                                                                {getInnerAlert.message}
                                                            </Alert>
                                                        )}
                                                        <Form.Group>
                                                            <InputGroup className="mt-2">
                                                                <Form.Control
                                                                    className={formErr && "border-danger"}
                                                                    type="text"
                                                                    placeholder="Masukkan Nama Grup..."
                                                                    onChange={handleGroupNameChange}
                                                                    required
                                                                />
                                                                <InputGroup.Text
                                                                    className="bg-dark text-white"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={handleGroupAdd}
                                                                >
                                                                    Tambah
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                            {formErr && (
                                                                <Form.Text className="text-muted text-danger">
                                                                    Nama wajib diisi!
                                                                </Form.Text>
                                                            )}
                                                        </Form.Group>
                                                    </Modal.Body>
                                                </Modal>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getGroupData?.map((gd, index) => (
                                            <>
                                                <TableRow
                                                    key={`lawyer-data-${gd.id}`}
                                                    {...gd}
                                                    num={index + 1}
                                                />
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card border="light" className="shadow-sm mb-4 mt-3">
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
                                <Form method="POST" onSubmit={updateGroupData}>
                                    {getGroupData?.map((gd) => (
                                        <>
                                            {gd.id === getSelectedGroupId && (
                                                <>
                                                    <Form.Group id="name">
                                                        <Form.Label>
                                                            Nama Grup <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            name="group_name"
                                                            defaultValue={gd.name}
                                                        />
                                                    </Form.Group>

                                                    <h5 className="my-4">Menu</h5>
                                                    {/* Make checkbox foreach for menu and his sub menu with his access inline */}
                                                    <Row>
                                                        {getMenuDataCheck?.map((item, index) => (
                                                            <div key={index}>
                                                                <Form.Check
                                                                    key={`menu_${item.id}`}
                                                                    id={`menu_${item.id}`}
                                                                    name={`menu_${item.id}`}
                                                                    type="checkbox"
                                                                    label={item.name}
                                                                    defaultChecked={item.checked}
                                                                />
                                                                {/* getSubMenuData */}
                                                                {getSubMenuDataCheck?.map((subItem) => (
                                                                    <div key={subItem.id}>
                                                                        {subItem.menu_id === item.id && (
                                                                            <Row>
                                                                                <Col>
                                                                                    <Form.Check
                                                                                        key={`sub_menu_${subItem.id}`}
                                                                                        id={`sub_menu_${subItem.id}`}
                                                                                        name={`sub_menu_${subItem.id}`}
                                                                                        type="checkbox"
                                                                                        label={subItem.name}
                                                                                        style={{ marginLeft: "25px" }}
                                                                                        defaultChecked={subItem.checked}
                                                                                    />
                                                                                </Col>
                                                                                <Col>
                                                                                    {" "}
                                                                                    <Form.Check
                                                                                        key={`sub_menu_readwrite_${subItem.id}`}
                                                                                        id={`sub_menu_readwrite_${subItem.id}`}
                                                                                        name={`sub_menu_readwrite_${subItem.id}`}
                                                                                        type="switch"
                                                                                        label="Read and Write"
                                                                                        defaultChecked={subItem.readwrite}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </Row>

                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="float-end mb-3"
                                                    >
                                                        Perbarui
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    ))}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    );
};
