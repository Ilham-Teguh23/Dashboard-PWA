import { Button, Card, Col, Form, Row, Tab, Tabs } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";

export default () => {

    const [options, setOptions] = useState([]);
    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});

    const [getAliasProvinsi, setAliasProvinsi] = useState(false);
    const [getAliasTNI, setAliasTNI] = useState(false);
    const [getAliasPolri, setAliasPolri] = useState(false);

    const [getAliasName, setAliasName] = useState(false);

    const [getCategory, setCategory] = useState([]);
    const [getSekolah, setSekolah] = useState([]);
    const [getSubCategory, setSubCategory] = useState([]);
    const [getSelectedKategori, setSelectedKategori] = useState("");
    const [getSelectedPaket, setSelectedPaket] = useState("");

    const [getAmount, setAmount] = useState("");
    const [getLimitContact, setLimitContact] = useState("");
    const [getLimitUser, setLimitUser] = useState("");

    const [showSubCategory, setShowSubCategory] = useState(false);

    const [getProvinsi, setProvinsi] = useState([]);
    const [getKotaKab, setKotaKab] = useState([]);
    const [getSelectedProvinsi, setSelectedProvinsi] = useState("");
    const [showKotaKab, setShowKotaKab] = useState(false);

    const [getKecamatan, setKecamatan] = useState([]);
    const [getSelectedKotaKab, setSelectedKotaKab] = useState("");
    const [showKecamatan, setShowKecamatan] = useState(false);

    const [getDataProvinsiByParams, setDataProvinsiByParams] = useState([]);
    const [showProvinsiByParams, setShowProvinsiByParams] = useState(false);
    const [saveSubKategori, setSaveSubKategori] = useState("");

    const [getDataKotaKabByParams, setDataKotaKabByParams] = useState([]);
    const [getNamaAlias, setNamaAlias] = useState(false);

    const [showNama, setShowNama] = useState(true);
    const [showJenisSub, setShowJenisSub] = useState("");

    const [getDataKecamatanByParams, setDataKecamatanByParams] = useState([]);

    const getDataCategory = () => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/master/category`)
            .then((res) => res.json())
            .then((response) => {
                setCategory(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    const getDataProvinsi = () => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/provinces`)
            .then((res) => res.json())
            .then((response) => {
                setProvinsi(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    const getSubCategoryByParent = (categoryId) => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/master/sub_category`)
            .then((res) => res.json())
            .then((response) => {
                const filteredSubCategories = response.data.filter(subCategory => subCategory.parent.id_category_organization === categoryId);
                setSubCategory(filteredSubCategories);
                setShowSubCategory(true);
            }).catch((error) => {
                console.log(error);
                setShowSubCategory(false);
            });
    };

    const getKotaKabByProvinsi = (provinsiId) => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/provinces/${provinsiId}/regencies`)
            .then((res) => res.json())
            .then((response) => {
                setKotaKab(response.data);
                setShowKotaKab(true);
            }).catch((error) => {
                console.log(error);
                setShowKotaKab(false);
            });
    };

    const getKecamatanByKotaKab = (kotaKabId) => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/provinces/${kotaKabId}/districts`)
            .then((res) => res.json())
            .then((response) => {
                setKecamatan(response.data);
                setShowKecamatan(true);
            }).catch((error) => {
                console.log(error);
                setShowKecamatan(false);
            });
    };

    const getBisnisCategory = () => {
        fetch(`${process.env.REACT_APP_API_TAB_ORGANISASI}/paket/pendidikan`)
            .then((res) => res.json())
            .then((response) => {
                console.log("Adaaaa");
                console.log(response.data);
                setSekolah(response.data)
            }).catch((error) => {
                console.log(error);
            });
    }

    const getProvinsiByParams = (paramsSubKat) => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/${paramsSubKat}/institution`)
            .then((res) => res.json())
            .then((response) => {
                setDataProvinsiByParams(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    const getKotaKabDataByParams = (paramsSubKat, paramsIdProvince) => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/${paramsSubKat}/institution/regencies/${paramsIdProvince}`)
            .then((res) => res.json())
            .then((response) => {
                setDataKotaKabByParams(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    const getKecamatanDataByParams = (paramsSubKat, paramsIdRegency) => {
        fetch(`${process.env.REACT_APP_TAB_MODULE}/region/${paramsSubKat}/institution/districts/${paramsIdRegency}`)
            .then((res) => res.json())
            .then((response) => {
                setDataKecamatanByParams(response.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getDataCategory();
        getDataProvinsi();
        getBisnisCategory();

        const initialData = {
            nama: "",
            country_code: "",
            phone_number: "",
            regency_id: "",
            province_id: "",
            category_organization_id: "",
            sub_category_organization_id: "",
            email: "",
            district_id: ""
        };
        setFormData(initialData);
        setInitialFormData(initialData);
    }, []);

    useEffect(() => {
        if (getSelectedKategori) {
            getSubCategoryByParent(parseInt(getSelectedKategori, 10));
        } else {
            setShowSubCategory(false);
        }

        if (getSelectedProvinsi) {
            getKotaKabByProvinsi(getSelectedProvinsi);
        } else {
            setShowKotaKab(false);
        }

        if (getSelectedKotaKab) {
            getKecamatanByKotaKab(getSelectedKotaKab)
        } else {
            setShowKecamatan(false)
        }
    }, [getSelectedKategori, getSelectedProvinsi, getSelectedKotaKab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "sub_category_organization_id") {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const selectedName = selectedOption.getAttribute("data-name");

            if (selectedName === "TNI") {
                setAliasProvinsi(true);
                setAliasTNI(true);
                setAliasPolri(false);
                getProvinsiByParams(selectedName)
                setShowProvinsiByParams(true)
                setSaveSubKategori(selectedName)
                setShowNama(false);
                setShowJenisSub(selectedName)
            } else if (selectedName === "POLRI") {
                setAliasProvinsi(true);
                setAliasTNI(false);
                setAliasPolri(true);
                getProvinsiByParams(selectedName)
                setShowProvinsiByParams(true)
                setSaveSubKategori(selectedName)
                setShowNama(false);
                setShowJenisSub(selectedName)
            } else if (selectedName === "03") {
                fetch(`${process.env.REACT_APP_TAB_MODULE}/region/dikti/`)
                    .then((res) => res.json())
                    .then((response) => {
                        const formattedOptions = response.data.map(item => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setOptions(formattedOptions)
                    }).catch((error) => {
                        toast.error(error);
                    })
                setAliasName(true);
                setShowProvinsiByParams(false)
                setShowNama(true);
                setShowJenisSub("")
                
            } else {
            
                setAliasProvinsi(false);
                setAliasTNI(false);
                setAliasPolri(false);
                setAliasName(false);
                setShowProvinsiByParams(false)
                setShowNama(true);
                setShowJenisSub("")
            }
        }
        
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleKategoriChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedKategori(selectedValue);

        if (showJenisSub != "POLRI" || showJenisSub != "TNI" ) {
            setShowNama(true)
        }
        
        setFormData({
            ...formData,
            category_organization_id: selectedValue
        })
    };

    const handlePaketChange = (event) => {
        const selectedValue = event.target.value;

        const [id, amount, limit_contact, limit_user] = selectedValue.split('|');
        setSelectedPaket(selectedValue);
        setAmount(amount)
        setLimitContact(limit_contact)
        setLimitUser(limit_user)

        setFormData({
            ...formData,
            id_master_paket_organization: id
        })
    };

    const handleProvinsiChange = (event) => {
        const selectedValue = event.target.value
        const selectedOptionAlias = event.target.options[event.target.selectedIndex];
        const namaAlias = selectedOptionAlias.getAttribute("data-nama-alias");
    
        setNamaAlias(namaAlias)
        setSelectedProvinsi(selectedValue);

        setFormData({
            ...formData,
            province_id: selectedValue
        })

        if (saveSubKategori === "TNI" || saveSubKategori === "POLRI") {
            getKotaKabDataByParams(saveSubKategori, selectedValue)
        }
    };

    const handleKotaKabChange = (event) => {
        const selectedValue = event.target.value
        setSelectedKotaKab(selectedValue);

        if (saveSubKategori === "TNI" || saveSubKategori === "POLRI") {
            getKecamatanDataByParams(saveSubKategori, selectedValue)
        }

        setFormData({
            ...formData,
            regency_id: selectedValue
        })
    }

    const handleSubmit = async (e, formType) => {
        e.preventDefault();

        const submitData = new FormData();
        for (const key in formData) {
            submitData.append(key, formData[key]);
        }

        const plainData = {};
        submitData.forEach((value, key) => {
            plainData[key] = value;
        });

        let apiUrl;

        if (formType === "partner") {
            apiUrl = "partner"
        } else if (formType === "eksternal") {
            apiUrl = "eksternal"
        }

        const dataSend = {
            nama: showJenisSub === "" ? plainData.nama : getNamaAlias,
            email: plainData.email,
            country_code: plainData.country_code,
            phone_number: plainData.phone_number,
            district_id: plainData.district_id,
            regency_id: plainData.regency_id,
            province_id: plainData.province_id,
            nama_pic: plainData.nama_pic,
            phone_number_pic: plainData.phone_number_pic,
            alamat_organisasi: plainData.alamat_organisasi,
            category_organization_id: plainData.category_organization_id,
            sub_category_organization_id: plainData.sub_category_organization_id,
            limit_user: getLimitUser,
            limit_contact: getLimitContact,
            amount: getAmount,
            url: {
                url: 'https://tnos.co.id/'
            },
            unique_responder_id: plainData.unique_responder_id
        }

        if (formType === "eksternal") {
            dataSend["paketOrganization"] = {
                id_master_paket_organization: plainData.id_master_paket_organization,
            };
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_TAB_ORGANISASI}/account/admin/create/${apiUrl}`, dataSend, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                console.log(res);
                toast.success("Data Berhasil di Simpan");
                setFormData(initialFormData)
            }).catch((error) => {
                console.log(error);
                toast.error(error);
            })

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <Tabs
            defaultActiveKey="akun-partner"
            id="fill-tab-example"
            className="mb-3"
            fill
        >
            <Tab eventKey="akun-external" title="Akun External">
                <Card>
                    <Form method="POST">
                        <Card.Body>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="category_organization_id">
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select name="category_organization_id" value={getSelectedKategori} onChange={handleKategoriChange}>
                                            <option value="">- Pilih Kategori -</option>
                                            {getCategory?.length > 0 ? (
                                                getCategory?.map((category, index) => (
                                                    <option value={category.id_category_organization}>
                                                        {category.nama}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>- Loading -</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {showSubCategory && (
                                    <Col md="6">
                                        <Form.Group className="mb-3" controlId="sub_category_organization_id">
                                            <Form.Label>Sub Kategori</Form.Label>
                                            <Form.Select name="sub_category_organization_id" value={formData.sub_category_organization_id || ""} onChange={handleChange}>
                                                <option value="">- Pilih Sub Kategori -</option>
                                                {getSubCategory?.length > 0 ? (
                                                    getSubCategory?.map((subCategory, index) => (
                                                        <option key={index} value={subCategory.id_sub_category_organization} data-name={subCategory.code}>
                                                            {subCategory.id_sub_category_organization} - {subCategory.nama}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">- Loading -</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                {getAliasName ? (
                                    <Col md="6">
                                        <Form.Group className="mb-3" controlId="nama">
                                            <Form.Label>Nama Pendidikan Tinggi</Form.Label>
                                            <Form.Control type="text" name="nama" placeholder="Masukkan Nama" value={formData.nama || ""} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                ) : (
                                    <Col md="6">
                                        <Form.Group className="mb-3" controlId="nama">
                                            <Form.Label>Nama Organisasi</Form.Label>
                                            <Form.Control type="text" name="nama" placeholder="Masukkan Nama" value={formData.nama || ""} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                )}
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Masukkan Email" value={formData.email || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="nama_pic">
                                        <Form.Label>Nama PIC</Form.Label>
                                        <Form.Control type="text" name="nama_pic" placeholder="Masukkan Nama PIC" value={formData.nama_pic || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="phone_number_pic">
                                        <Form.Label>Nomor HP PIC</Form.Label>
                                        <Form.Control type="text" name="phone_number_pic" placeholder="Masukkan Nomor HP PIC" value={formData.phone_number_pic || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="2">
                                    <Form.Group className="mb-3" controlId="country_code">
                                        <Form.Label>Kode Negara</Form.Label>
                                        <Form.Control type="text" name="country_code" placeholder="Masukkan Kode Negara" value={formData.country_code || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="5">
                                    <Form.Group className="mb-3" controlId="phone_number">
                                        <Form.Label>Nomor HP</Form.Label>
                                        <Form.Control type="text" name="phone_number" placeholder="Masukkan Nomor HP" value={formData.phone_number || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="5">
                                    <Form.Group className="mb-3" controlId="unique_responder_id">
                                        <Form.Label>Kode Referal</Form.Label>
                                        <Form.Control type="text" name="unique_responder_id" placeholder="Masukkan Kode Referal" value={formData.unique_responder_id || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <Form.Group className="mb-3" controlId="province_id">
                                        <Form.Label>
                                            Provinsi
                                        </Form.Label>
                                        <Form.Select name="province_id" value={getSelectedProvinsi} onChange={handleProvinsiChange} >
                                            <option value="">- Pilih Provinsi -</option>
                                            {getProvinsi?.length > 0 ? (
                                                getProvinsi?.map((provinsi, index) => (
                                                    <option value={provinsi.id}>
                                                        {provinsi.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>- Loading -</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {showKotaKab && (
                                    <Col md="4">
                                        <Form.Group className="mb-3" controlId="regency_id">
                                            <Form.Label>
                                                Kota Kabupaten
                                            </Form.Label>
                                            <Form.Select name="regency_id" value={formData.regency_id || ""} onChange={handleKotaKabChange}>
                                                <option value="">- Pilih Kota Kabupaten -</option>
                                                {getKotaKab?.length > 0 ? (
                                                    getKotaKab?.map((kotaKabupaten, index) => (
                                                        <option key={index} value={kotaKabupaten.id}>
                                                            {kotaKabupaten.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">- Loading -</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}

                                {showKecamatan && (
                                    <Col md="4">
                                        <Form.Group className="mb-3" controlId="district_id">
                                            <Form.Label>
                                                Kecamatan
                                            </Form.Label>
                                            <Form.Select name="district_id" value={formData.district_id || ""} onChange={handleChange}>
                                                <option value="">- Pilih Kecamatan -</option>
                                                {getKecamatan?.length > 0 ? (
                                                    getKecamatan?.map((kecamatan, index) => (
                                                        <option key={index} value={kecamatan.id}>
                                                            {kecamatan.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">- Loading -</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="alamat_organisasi">
                                        <Form.Label>Alamat Organisasi</Form.Label>
                                        <Form.Control type="text" name="alamat_organisasi" placeholder="Masukkan Alamat Organisasi" value={formData.alamat_organisasi || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="id_master_paket_organization" value={getSelectedPaket} onChange={handlePaketChange}>
                                        <Form.Label>Paket</Form.Label>
                                        <Form.Select name="id_master_paket_organization">
                                            <option value="">- Pilih Paket -</option>
                                            {getSekolah?.length > 0 ? (
                                                getSekolah?.map((paket, index) => (
                                                    <option key={index} value={`${paket.id_master_paket_organization}|${paket.amount}|${paket.limit_contact}|${paket.limit_user}`}>
                                                        {paket.nama_paket}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>- Loading -</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="danger" style={{ marginRight: '5px' }}>
                                <FontAwesomeIcon icon={faTimes} /> Reset
                            </Button>
                            <Button variant="primary" onClick={(e) => handleSubmit(e, "eksternal")}>
                                <FontAwesomeIcon icon={faSave} /> Simpan
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </Tab>
            <Tab eventKey="akun-partner" title="Akun Partner">
                <Card>
                    <Form method="POST">
                        <Card.Body>
                            <Row>
                                {showNama ? (
                                    <>
                                        <Col md="6">
                                            <Form.Group className="mb-3" controlId="nama">
                                                <Form.Label>Nama</Form.Label>
                                                <Form.Control type="text" name="nama" placeholder="Masukkan Nama" value={formData.nama || ""} onChange={handleChange} />
                                            </Form.Group>
                                        </Col>
                                    </>
                                ) : (
                                    <>

                                    </>
                                )}
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Masukkan Email" value={formData.email || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="nama_pic">
                                        <Form.Label>Nama PIC</Form.Label>
                                        <Form.Control type="text" name="nama_pic" placeholder="Masukkan Nama PIC" value={formData.nama_pic || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="phone_number_pic">
                                        <Form.Label>Nomor HP PIC</Form.Label>
                                        <Form.Control type="text" name="phone_number_pic" placeholder="Masukkan Nomor HP PIC" value={formData.phone_number_pic || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="country_code">
                                        <Form.Label>Kode Negara</Form.Label>
                                        <Form.Control type="text" name="country_code" placeholder="Masukkan Kode Negara" value={formData.country_code || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="phone_number">
                                        <Form.Label>Nomor HP</Form.Label>
                                        <Form.Control type="text" name="phone_number" placeholder="Masukkan Nomor HP" value={formData.phone_number || ""} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Form.Group className="mb-3" controlId="category_organization_id">
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select name="category_organization_id" value={getSelectedKategori} onChange={handleKategoriChange}>
                                            <option value="">- Pilih Kategori -</option>
                                            {getCategory?.length > 0 ? (
                                                getCategory?.map((category, index) => (
                                                    <option value={category.id_category_organization}>
                                                        {category.nama}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={""}>- Loading -</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {showSubCategory && (
                                    <Col md="6">
                                        <Form.Group className="mb-3" controlId="sub_category_organization_id">
                                            <Form.Label>Sub Kategori</Form.Label>
                                            <Form.Select name="sub_category_organization_id" value={formData.sub_category_organization_id || ""} onChange={handleChange}>
                                                <option value="">- Pilih Sub Kategori -</option>
                                                {getSubCategory?.length > 0 ? (
                                                    getSubCategory?.map((subCategory, index) => (
                                                        <option key={index} value={subCategory.id_sub_category_organization} data-name={subCategory.nama}>
                                                            {subCategory.id_sub_category_organization} - {subCategory.nama}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">- Loading -</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col md="4">
                                    <Form.Group className="mb-3" controlId="province_id">
                                        <Form.Label>
                                            {getAliasProvinsi === false ? "Provinsi" : getAliasPolri ? "POLDA" : "KODAM"}
                                        </Form.Label>
                                        <Form.Select name="province_id" value={getSelectedProvinsi} onChange={handleProvinsiChange} >
                                            <option value="">- Pilih Provinsi -</option>
                                            {showProvinsiByParams ? (
                                                getDataProvinsiByParams?.length > 0 ? (
                                                    getDataProvinsiByParams?.map((provinsi, index) => (
                                                        <option value={provinsi.id} data-nama-alias={showJenisSub === "TNI" ? `KODAM ${provinsi.name}` : showJenisSub === "POLRI" ? `POLDA ${provinsi.name}` : '' } >
                                                            {showJenisSub === "TNI" ? "KODAM" : showJenisSub === "POLRI" ? 'POLDA' : '' } {provinsi.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value={""}>- Loading -</option>
                                                )
                                            ) : (
                                                getProvinsi?.length > 0 ? (
                                                    getProvinsi?.map((provinsi, index) => (
                                                        <option value={provinsi.id}>
                                                            {provinsi.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value={""}>- Loading -</option>
                                                )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {showKotaKab && (
                                    <Col md="4">
                                        <Form.Group className="mb-3" controlId="regency_id">
                                            <Form.Label>
                                                {getAliasProvinsi == false ? "Kota Kabupaten" : getAliasPolri ? "POLRES" : "KODIM"}
                                            </Form.Label>
                                            <Form.Select name="regency_id" value={formData.regency_id || ""} onChange={handleKotaKabChange}>
                                                <option value="">- Pilih Kota Kabupaten -</option>
                                                {showProvinsiByParams ? (
                                                    getDataKotaKabByParams?.length > 0 ? (
                                                        getDataKotaKabByParams?.map((kotaKabupaten, index) => (
                                                            <option key={index} value={kotaKabupaten.id}>
                                                                {showJenisSub === "TNI" ? "KODIM" : showJenisSub === "POLRI" ? 'POLRES' : '' } {kotaKabupaten.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">- Loading -</option>
                                                    )
                                                ) : (
                                                    getKotaKab?.length > 0 ? (
                                                        getKotaKab?.map((kotaKabupaten, index) => (
                                                            <option key={index} value={kotaKabupaten.id}>
                                                                {kotaKabupaten.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">- Loading -</option>
                                                    )
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}

                                {showKecamatan && (
                                    <Col md="4">
                                        <Form.Group className="mb-3" controlId="district_id">
                                            <Form.Label>
                                                {getAliasProvinsi == false ? "Kecamatan" : getAliasPolri ? "POLSEK" : "KORAMIL"}
                                            </Form.Label>
                                            <Form.Select name="district_id" value={formData.district_id || ""} onChange={handleChange}>
                                                <option value="">- Pilih Kecamatan -</option>
                                                {showProvinsiByParams ? (
                                                    getDataKecamatanByParams?.length > 0 ? (
                                                        getDataKecamatanByParams?.map((kecamatan, index) => (
                                                            <option key={index} value={kecamatan.id}>
                                                                {showJenisSub === "TNI" ? "KORAMIL" : showJenisSub === "POLRI" ? 'POLSEK' : '' } {kecamatan.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">- Loading -</option>
                                                    )
                                                ) : (
                                                    getKecamatan?.length > 0 ? (
                                                        getKecamatan?.map((kecamatan, index) => (
                                                            <option key={index} value={kecamatan.id}>
                                                                {kecamatan.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">- Loading -</option>
                                                    )
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="danger" style={{ marginRight: '5px' }}>
                                <FontAwesomeIcon icon={faTimes} /> Reset
                            </Button>
                            <Button variant="primary" onClick={(e) => handleSubmit(e, "partner")}>
                                <FontAwesomeIcon icon={faSave} /> Simpan
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </Tab>
        </Tabs>
    );
}