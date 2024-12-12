import { faPlus, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Modal, Row } from "@themesberg/react-bootstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const MyModal = ({ show, handleClose, id, isEditing, isTable }) => {

    const location = useLocation();
    const [formData, setFormData] = useState({});
    const [btnHargaFetch, setBtnHargaFetch] = useState([])
    const [hargaIncludeTnos, setHargaIncludeTnos] = useState(0);
    const [tnosFee, setTnosFee] = useState(0);
    const [platformFee, setPlatformFee] = useState(0);
    const [pricePPN, setPricePPN] = useState(0);
    const [pricePWA, setPricePWA] = useState(0);
    const [hargaIncludeTNOSRange, setHargaIncludeTNOSRange] = useState(0)
    const [includeTnosFee, setIncludeTnosFee] = useState(0)
    const [selectedSetting, setSelectedSetting] = useState(0)
    const [selectedSatuanUnit, setSelectedSatuanUnit] = useState(0)
    const [getReference, setReference] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [btnHargaList, setBtnHargaList] = useState([{ hargaDari: "", hargaSampai: "", hargaAkhir: "" }]);

    const [getSettingHargaDasar] = useState([
        {
            key: "status_0",
            value: 0,
            defaultValue: "Pilih",
        },
        {
            key: "status_1",
            value: 1,
            defaultValue: "Include TNOS Fee",
        },
        {
            key: "status_2",
            value: 2,
            defaultValue: "Harga Dasar Vendor",
        },
    ]);

    const [getSatuanUnit, setSatuanUnit] = useState([])

    const handleChangeReference = (e) => {

        const { name, value } = e.target
        const selectedOption = getReference.find(item => item.id === value)

        if (selectedOption && !selectedOptions.some(option => option.id === selectedOption.id)) {
            setSelectedOptions([...selectedOptions, selectedOption]);
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: ""
        }))
    }

    const handleDeleteArr = (id) => {
        setSelectedOptions(selectedOptions.filter(option => option.id !== id))
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));

        const includePpn = isEditing ? parseFloat(name === "include_ppn_new" ? value : formData.include_ppn_new || 0) : parseFloat(name === "include_ppn" ? value : formData.include_ppn || 0);
        const platformFee = isEditing ? parseFloat(name === "platform_fee_new" ? value : formData.platform_fee_new || 0) : parseFloat(name === "platform_fee" ? value : formData.platform_fee || 0);

        if (selectedSetting === 1 || formData.transaction_status === "1") {
            const includeTnosFeeRange = parseFloat(name === "include_tnos_range" ? value : formData.include_tnos_range || 0)
            const percentanceTNOSFee = parseFloat(name === "percentance" ? value : formData.percentance || 0)
            const calculateTnosFeeRange = (includeTnosFeeRange * percentanceTNOSFee / 100);
            setHargaIncludeTNOSRange(calculateTnosFeeRange);
            setIncludeTnosFee(includeTnosFeeRange)

            if (includePpn === 0) {
                const calculatePPN = 0;
                setPricePPN(0)
            } else {
                const calculatePPN = (includeTnosFeeRange * includePpn / 100)
                setPricePPN(calculatePPN)
            }

            setTnosFee(includeTnosFeeRange - calculateTnosFeeRange)

            const calculatedPlatform = (includeTnosFeeRange * platformFee / 100);
            setPlatformFee(calculatedPlatform)

            const calculatePWA = pricePPN + calculatedPlatform
            setPricePWA(calculatePWA)

        } else if (selectedSetting === 2 || formData.transaction_status === "2") {
            const hargaDasar = isEditing ? parseFloat(name === "harga_dasar" ? value : formData.harga_dasar || 0) : parseFloat(name === "harga_dasar" ? value : formData.harga_dasar || 0);
            const includeTnosFee = isEditing ? parseFloat(name === "include_tnos_fee_new" ? value : formData.include_tnos_fee_new || 0) : parseFloat(name === "include_tnos_fee" ? value : formData.include_tnos_fee || 0);

            const calculatedHarga = hargaDasar + (hargaDasar * includeTnosFee / 100);
            setHargaIncludeTnos(calculatedHarga);

            if (includePpn === 0) {
                const calculatedTnosFee = (calculatedHarga - hargaDasar);
                const calculcatePPN = 0
                setTnosFee(calculatedTnosFee);
                setPricePPN(calculcatePPN);
                const calculatedPlatform = (calculatedHarga * platformFee / 100);
                setPlatformFee(calculatedPlatform)

                const calculatePricePWa = calculatedHarga + calculatedPlatform
                setPricePWA(calculatePricePWa)
            } else {
                const calculatedTnosFee = (calculatedHarga - hargaDasar);
                const calculcatePPN = (calculatedHarga * includePpn / 100);
                setTnosFee(calculatedTnosFee);
                setPricePPN(calculcatePPN);

                const calculatedPlatform = (calculatedHarga * platformFee / 100);
                setPlatformFee(calculatedPlatform)

                const calculatePricePWa = calculcatePPN + calculatedPlatform
                setPricePWA(calculatePricePWa)
            }
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (location.pathname.includes("/pwa-b2b/section")) {
            if (location.pathname.endsWith("product-sub-section") || location.pathname.endsWith("product")) {

                const section_id_data = location.pathname.split("/")[3];

                const {
                    id,
                    section_id,
                    status,
                    sections,
                    include_tnos_fee_new,
                    harga_dasar_new,
                    created_at,
                    tnos_fee_new,
                    platform_fee_new,
                    include_ppn_new,
                    ...filteredFormData
                } = formData

                const updatedFormData = isEditing
                    ? {
                        ...filteredFormData,
                        harga: pricePWA,
                        harga_dasar: formData.transaction_status === "1" ? hargaIncludeTNOSRange : formData.harga_dasar,
                        include_tnos_fee: formData.transaction_status === "1" ? includeTnosFee : tnosFee,
                        include_ppn: pricePPN,
                        tnos_fee: tnosFee,
                        platform_fee: platformFee,
                        satuan: formData.satuan,
                        setting: formData.transaction_status === "1" ? "include-tnos" : "harga-dasar"
                    } : {
                        ...formData,
                        section_id: section_id_data,
                        harga: pricePWA,
                        harga_dasar: selectedSetting === 1 ? hargaIncludeTNOSRange : formData.harga_dasar,
                        include_tnos_fee: selectedSetting === 1 ? includeTnosFee : tnosFee,
                        include_ppn: pricePPN,
                        tnos_fee: tnosFee,
                        platform_fee: platformFee,
                        satuan: formData.satuan,
                        setting: selectedSetting,
                        status: location.pathname.endsWith("product-sub-section") ? 1 : 0,
                    }

                const submitData = new FormData();

                for (const key in updatedFormData) {
                    submitData.append(key, updatedFormData[key]);
                }

                const dataObj = {};
                submitData.forEach((value, key) => {
                    dataObj[key] = value;
                });

                let apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product-sub-section`;

                try {
                    if (isEditing) {
                        await axios
                            .put(`${apiUrl}/${id}`, dataObj)
                            .then((response) => {
                                if (response.data.status === true) {
                                    handleClose();
                                    toast.success("Data Berhasil di Simpan");

                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 1000)
                                } else if (response.data.status === false) {
                                    handleClose();
                                    toast.error(response.data.message)
                                }
                            }).catch((error) => {
                                toast.error(error);
                            });
                    } else {
                        await axios.post(apiUrl, dataObj, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }).then((response) => {
                            console.log(response);

                            if (response.data.status === true) {
                                handleClose();
                                toast.success("Data Berhasil di Tambahkan");

                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else if (response.data.status === false) {
                                handleClose();
                                toast.error(response.data.message);
                            }
                        }).catch((error) => {
                            toast.error(error);
                        });
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengirim data : " + error);
                }
            } else {
                const submitData = new FormData();

                for (const key in formData) {
                    submitData.append(key, formData[key]);
                }

                let apiUrl = '';

                const dataObj = {};
                submitData.forEach((value, key) => {
                    dataObj[key] = value;
                });

                const id = location.pathname.split("/")[3];
                apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/subsection`;
                dataObj["section_id"] = id;
                submitData.append("section_id", id);

                if (isEditing) {
                    submitData.append("_method", "PUT")
                }

                try {
                    if (isEditing) {
                        await axios
                            .post(`${apiUrl}/${id}`, submitData)
                            .then((response) => {
                                if (response.data.status === true) {
                                    handleClose();
                                    toast.success("Data Berhasil di Simpan");

                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 1000)
                                } else if (response.data.status === false) {
                                    handleClose();
                                    toast.error(response.data.message)
                                }
                            }).catch((error) => {
                                toast.error(error);
                            });
                    } else {
                        await axios.post(apiUrl, submitData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }).then((response) => {
                            console.log(response);

                            if (response.data.status === true) {
                                handleClose();
                                toast.success("Data Berhasil di Tambahkan");

                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else if (response.data.status === false) {
                                handleClose();
                                toast.error(response.data.message);
                            }
                        }).catch((error) => {
                            toast.error(error);
                        });
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengirim data : " + error);
                }
            }
        } else {
            if (location.pathname.includes("lainnya")) {

                const updatedFormData = {
                    ...formData,
                    url_id: location.pathname.split("/")[3],
                    is_product: "false",
                    harga: pricePWA,
                    harga_dasar: hargaIncludeTNOSRange,
                    include_tnos_fee: includeTnosFee,
                    include_ppn: pricePPN,
                    tnos_fee: tnosFee,
                    satuan: selectedSatuanUnit,
                    platform_fee: platformFee,
                    ref_columns: selectedOptions.map(option => option.id).join(","),
                }

                const submitData = new FormData();

                for (const key in updatedFormData) {
                    submitData.append(key, updatedFormData[key]);
                }

                const dataObj = {};
                submitData.forEach((value, key) => {
                    dataObj[key] = value;
                });

                let apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/others`;

                if (location.pathname.endsWith("others-prod-sub")) {
                    dataObj["is_product"] = false
                } else if (location.pathname.endsWith("others-prod")) {
                    dataObj["is_product"] = true
                }

                try {
                    if (isEditing) {
                        await axios
                            .put(`${apiUrl}/${id}`, dataObj)
                            .then((response) => {
                                if (response.data.status === true) {
                                    handleClose();
                                    toast.success("Data Berhasil di Simpan");
                                } else if (response.data.status === false) {
                                    handleClose();
                                    toast.error(response.data.message)
                                }
                            }).catch((error) => {
                                toast.error(error);
                            });
                    } else {
                        await axios.post(apiUrl, dataObj, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }).then((response) => {
                            console.log(response);

                            if (response.data.status === true) {
                                handleClose();
                                toast.success("Data Berhasil di Tambahkan");
                            } else if (response.data.status === false) {
                                handleClose();
                                toast.error(response.data.message);
                            }
                        }).catch((error) => {
                            toast.error(error);
                        });
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengirim data : " + error);
                }

            } else {
                const submitData = new FormData();

                for (const key in formData) {
                    submitData.append(key, formData[key]);
                }

                if (location.pathname.includes("/pwa-b2b/component-others")) {
                    if (isEditing) {
                        btnHargaFetch.forEach((harga, index) => {
                            submitData.append(`id_harga_komponen[${index}]`, harga.id)
                            submitData.append(`harga_dari[${index}]`, harga.harga_dari);
                            submitData.append(`harga_sampai[${index}]`, harga.harga_sampai);
                            submitData.append(`harga_akhir[${index}]`, harga.harga_akhir);
                        })
                    } else {
                        btnHargaList.forEach((harga, index) => {
                            submitData.append(`hargaDari[${index}]`, harga.hargaDari);
                            submitData.append(`hargaSampai[${index}]`, harga.hargaSampai);
                            submitData.append(`hargaAkhir[${index}]`, harga.hargaAkhir);
                        })
                    }
                }

                const dataObj = {};
                submitData.forEach((value, key) => {
                    dataObj[key] = value;
                });

                let apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/provider`;

                if (location.pathname.includes("/pwa-b2b/security-provider/")) {
                    if (location.pathname.endsWith("/durasi")) {
                        const id = location.pathname.split("/")[3];
                        apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/durasi`;
                        dataObj["layanan_id"] = id;
                        submitData.append("layanan_id", id);

                        if (isEditing) {
                            submitData.append("_method", "PUT")
                        }

                    } else {
                        const id = location.pathname.split("/")[3];
                        apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/layanan`;
                        dataObj["provider_id"] = id;
                        submitData.append("provider_id", id);

                        if (isEditing) {
                            submitData.append("_method", "PUT")
                        }
                    }
                } else if (location.pathname.includes("/pwa-b2b/section")) {
                    if (location.pathname.endsWith("product-sub-section")) {
                        const id = location.pathname.split("/")[3];
                        apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product`;
                        dataObj["section_id"] = id;
                        submitData.append("section_id", id);

                        if (isEditing) {
                            submitData.append("_method", "PUT")
                        }
                    } else if (location.pathname.endsWith("sub-section")) {
                        const id = location.pathname.split("/")[3];
                        apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/subsection`;
                        dataObj["section_id"] = id;
                        submitData.append("section_id", id);

                        if (isEditing) {
                            submitData.append("_method", "PUT")
                        }
                    } else {
                        const id = location.pathname.split("/")[3];
                        apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product`;
                        dataObj["section_id"] = id;
                        submitData.append("section_id", id);

                        if (isEditing) {
                            submitData.append("_method", "PUT")
                        }
                    }
                } else if (location.pathname === "/pwa-b2b/security-provider") {
                    apiUrl = apiUrl

                    if (isEditing) {
                        submitData.append("_method", "PUT")
                    }

                } else if (location.pathname.includes("/pwa-b2b/unit")) {
                    apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit`
                    submitData["id"] = id;

                    if (isEditing) {
                        submitData.append("_method", "PUT")
                    }
                } else if (location.pathname.includes("/pwa-b2b/component-others")) {
                    apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/komponen-lainnya`
                    submitData.append("satuan", formData.satuan)

                    if (isEditing) {
                        submitData.append("_method", "PUT")
                    }
                } else {
                    const id = location.pathname.split("/")[3];
                    apiUrl = `${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/section`;
                    dataObj["durasi_id"] = id;
                    submitData.append("durasi_id", id);

                    if (isEditing) {
                        submitData.append("_method", "PUT")
                    }
                }

                try {
                    if (isEditing) {
                        await axios
                            .post(`${apiUrl}/${id}`, submitData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            .then((response) => {
                                if (response.data.status === true) {
                                    handleClose();
                                    toast.success("Data Berhasil di Simpan");

                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 1000)

                                } else if (response.data.status === false) {
                                    handleClose();
                                    toast.error(response.data.message)
                                }
                            }).catch((error) => {
                                toast.error(error);
                            });
                    } else {
                        await axios.post(apiUrl, submitData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }).then((response) => {
                            console.log(response);

                            if (response.data.status === true) {
                                handleClose();
                                toast.success("Data Berhasil di Tambahkan");

                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else if (response.data.status === false) {
                                handleClose();
                                toast.error(response.data.message);
                            }
                        }).catch((error) => {
                            toast.error(error);
                        });
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengirim data : " + error);
                }
            }
        }

    };

    const resetForm = () => {
        setHargaIncludeTnos(0)
        setTnosFee(0)
        setPricePPN(0)
        setPlatformFee(0)
        setPricePWA(0)
        setFormData({})
    }

    const handleChangeHarga = (index, e) => {
        const { name, value } = e.target;
        const updatedHargaList = [...btnHargaList];
        updatedHargaList[index][name] = value;
        setBtnHargaList(updatedHargaList);
    };

    const handleChangeHargaFetch = (index, e) => {
        const { name, value } = e.target;
        const updatedBtnHargaFetch = [...btnHargaFetch];
        updatedBtnHargaFetch[index] = {
            ...updatedBtnHargaFetch[index],
            [name]: value,
        };
        setBtnHargaFetch(updatedBtnHargaFetch);
    }

    const addBtnHarga = () => {
        setBtnHargaList([...btnHargaList, { hargaDari: "", hargaSampai: "", hargaAkhir: "" }]);
    }

    const addBtnHargaFetch = () => {
        setBtnHargaFetch([
            ...btnHargaFetch,
            { harga_dari: '', harga_sampai: '', harga_akhir: '' }
        ]);
    }

    const handleChangeKomponenLainnya = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleChangeSatuanProdSubSec = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleChangeSetting = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            transaction_status: value,
            setting: value === "2" ? "harga-dasar" : "include-tnos",
        }));
    };

    useEffect(() => {
        const fetchDataColumn = async () => {
            try {
                let response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product-sub-section/${location.pathname.split("/")[3]}`);

                setReference(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDataUnit = async () => {
            try {
                let response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit`)

                setSatuanUnit(response.data.data.unit)
            } catch (error) {
                console.log(error);
            }
        }

        if (location.pathname.includes("lainnya")) {
            fetchDataColumn()
            fetchDataUnit()
        } else {
            if (location.pathname.includes("pwa-b2b/section") || location.pathname.includes("pwa-b2b/component-others")) {
                fetchDataUnit()
            }
        }

    }, [location.pathname]);

    useEffect(() => {
        if (id) {
            const fetchDataById = async () => {
                try {
                    let response = null;
                    if (isTable === "provider") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/provider/${id}`);
                    } else if (isTable === "layanan") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/layanan/${id}/show`)
                    } else if (isTable === "section") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/section/${id}/show`)
                    } else if (isTable === "product") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product/${id}/show`)
                    } else if (isTable === "subsection") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/subsection/${id}/show`)
                    } else if (isTable === "unit") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/unit/${id}/show`)
                    } else if (isTable === "others-component") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/komponen-lainnya/${id}/show`)
                    } else if (isTable === "durasi") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/durasi/${id}/show`)
                    } else if (isTable === "product-sub-section") {
                        response = await axios.get(`${process.env.REACT_APP_API_PWA_TNOS_DSBRD_URL}/pwa-revamp/product-sub-section/${id}/show`)
                    }

                    if (response) {

                        console.log("PRODUCT SUB SECTION");
                        console.log(response.data.data);

                        if (isTable === "product-sub-section" || isTable === "product") {
                            const data = { ...response.data.data }

                            data.transaction_status = data.setting === "harga-dasar" ? "2" : "1";

                            if (data.setting === "harga-dasar") {

                                const setPriceIncludeTnosFee = (data.include_tnos_fee / data.harga_dasar) * 100
                                data.include_tnos_fee_new = Math.round(setPriceIncludeTnosFee);

                                const setHargaDasar = data.harga_dasar + (data.harga_dasar * data.include_tnos_fee_new / 100)
                                data.harga_dasar_new = setHargaDasar

                                const setIncludePPN = (data.include_ppn / setHargaDasar) * 100;
                                data.include_ppn_new = Math.round(setIncludePPN)

                                const setPlatform = (data.platform_fee / setHargaDasar) * 100
                                data.platform_fee_new = Math.round(setPlatform)

                                const setTnosFeeMath = data.harga_dasar * data.include_tnos_fee_new / 100
                                data.tnos_fee_new = Math.round(setTnosFeeMath)

                                setHargaIncludeTnos(data.harga_dasar_new)
                                setTnosFee(data.tnos_fee)
                                setPricePPN(data.include_ppn)
                                setPlatformFee(data.platform_fee)
                                setPricePWA(data.harga)
                            } else if (data.setting === "include-tnos") {
                                const setPersentanseHargaDasar = (data.harga_dasar / data.include_tnos_fee) * 100
                                data.percentance_new = Math.round(setPersentanseHargaDasar)
                            }

                            setFormData(data);
                        } else {
                            setFormData(response.data.data); // Untuk kondisi lainnya
                        }

                        if (isTable === "others-component") {
                            setBtnHargaFetch(response.data.data.harga_komponen)
                        }
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengambil data.");
                }
            };

            fetchDataById();
        }
    }, [id, isTable, selectedSetting, selectedSatuanUnit]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Edit Data" : "Tambah Data"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {location.pathname.includes("/pwa-b2b/security-provider/") ? (
                    location.pathname.endsWith("/durasi") ? (
                        <>
                            <Form onSubmit={handleSubmit} method="POST">
                                <div className="mb-3">
                                    <label htmlFor="durasi" className="form-label">
                                        Durasi
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="durasi"
                                        name="durasi"
                                        placeholder="Masukkan Durasi Jam"
                                        value={formData.durasi || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Form onSubmit={handleSubmit} method="POST">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nama Layanan
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Masukkan Nama Layanan"
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form>
                        </>
                    )
                ) : (location.pathname.includes("/pwa-b2b/layanan")) ? (
                    <Form onSubmit={handleSubmit} method="POST">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label"> Nama </label>
                            <input type="text" className="form-control" id="name" name="name" placeholder="Masukkan Nama" value={formData.name || ""} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="have_sub_section" className="form-label"> Punya Sub Menu </label>
                            <Form.Select value={formData.have_sub_section || ""} name="have_sub_section" id="have_sub_section" onChange={handleChange}>
                                <option value="">- Pilih -</option>
                                <option value="0">Tidak</option>
                                <option value="1">Ya</option>
                            </Form.Select>
                        </div>
                    </Form>
                ) : (location.pathname.includes("/pwa-b2b/section")) ? (
                    <>
                        {location.pathname.endsWith("product-sub-section") || location.pathname.endsWith("product") ? (
                            <>
                                <Form onSubmit={handleSubmit} method="POST">
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <label htmlFor="column" className="form-label"> Kolom </label>
                                                <input type="text" className="form-control" id="column" name="column" placeholder="Masukkan Nama Kolom" value={formData.column || ""} onChange={handleChange} />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <label htmlFor="satuan" className="form-label"> Satuan </label>
                                                <Form.Select
                                                    name="satuan"
                                                    value={formData.satuan || ""}
                                                    onChange={handleChangeSatuanProdSubSec}
                                                >
                                                    <option value="">- Pilih -</option>
                                                    {getSatuanUnit?.map((item) => (
                                                        <option key={item.key} value={item.id}>
                                                            {item.satuan}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <div className="mb-3">
                                                <label htmlFor="harga_dasar" className="form-label"> Setting Harga Dasar </label>

                                                {isEditing ? (
                                                    <Form.Select
                                                        name="transaction_status"
                                                        value={formData.transaction_status || ""}
                                                        onChange={handleChangeSetting}
                                                    >
                                                        {getSettingHargaDasar?.map((item) => (
                                                            <option key={item.key} value={item.value}>
                                                                {item.defaultValue}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <Form.Select
                                                        name="transaction_status"
                                                        value={selectedSetting}
                                                        onChange={(e) => setSelectedSetting(parseInt(e.target.value))}
                                                    >
                                                        {getSettingHargaDasar?.map((item) => (
                                                            <option key={item.key} value={item.value}>
                                                                {item.defaultValue}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                    {isEditing ? (
                                        <>
                                            {formData.setting === "harga-dasar" ? (
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="harga_dasar" className="form-label"> Harga Dasar </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="harga_dasar"
                                                                name="harga_dasar"
                                                                placeholder="Masukkan Harga Dasar"
                                                                value={formData.harga_dasar || ""}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="include_tnos_fee_new" className="form-label"> Include TNOS Fee (%) </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="include_tnos_fee_new"
                                                                name="include_tnos_fee_new"
                                                                placeholder="Masukkan Include TNOS Fee (%)"
                                                                value={formData.include_tnos_fee_new || ""}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="include_tnos_range" className="form-label"> Include TNOS Wid </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="include_tnos_range"
                                                                name="include_tnos_range"
                                                                placeholder="Masukkan Include TNOS"
                                                                value={formData.include_tnos_fee || ""}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="percentance" className="form-label"> Persentanse Harga Dasar Wid </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="percentance"
                                                                name="percentance"
                                                                placeholder="Masukkan Persentanse"
                                                                value={formData.percentance_new || ""}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )}

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <label htmlFor="include_ppn_new" className="form-label"> Include PPN (%) </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="include_ppn_new"
                                                            name="include_ppn_new"
                                                            placeholder="Masukkan Include PPN"
                                                            value={formData.include_ppn_new === 0 ? "0" : formData.include_ppn_new}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <label htmlFor="platform_fee_new" className="form-label"> Platform Fee </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="platform_fee_new"
                                                            name="platform_fee_new"
                                                            placeholder="Masukkan Platform Fee"
                                                            value={formData.platform_fee_new || ""}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />

                                            {formData.setting === "include-tnos" ? (
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> Harga Dasar </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(hargaIncludeTNOSRange)} </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                ""
                                            )}

                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-1">
                                                        <label htmlFor="include_tnos_fee" className="form-label"> Include TNOS {selectedSetting === 1 ? "" : "Fee"} </label>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-1" style={{ textAlign: 'right' }}>
                                                        <label htmlFor="include_tnos_fee" className="form-label">
                                                            {isEditing ? (
                                                                <>
                                                                    {formData.transaction_status === "1" ? (
                                                                        <></>
                                                                    ) : (
                                                                        <>
                                                                            {formatRupiah(hargaIncludeTnos)}
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {selectedSetting === 1 ? (
                                                                        formatRupiah(includeTnosFee)
                                                                    ) : (
                                                                        formatRupiah(hargaIncludeTnos)
                                                                    )}
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-1">
                                                        <label htmlFor="include_tnos_fee" className="form-label"> TNOS Fee </label>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-1" style={{ textAlign: 'right' }}>
                                                        <label htmlFor="include_tnos_fee" className="form-label">
                                                            {formatRupiah(tnosFee)}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-1">
                                                        <label htmlFor="include_tnos_fee" className="form-label"> Include PPN </label>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-1" style={{ textAlign: 'right' }}>
                                                        <label htmlFor="include_tnos_fee" className="form-label">
                                                            {formatRupiah(pricePPN)}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-1">
                                                        <label htmlFor="include_tnos_fee" className="form-label"> Harga Platform </label>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-1" style={{ textAlign: 'right' }}>
                                                        <label htmlFor="include_tnos_fee" className="form-label">
                                                            {formatRupiah(platformFee)}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-1">
                                                        <label htmlFor="include_tnos_fee" className="form-label"> Harga PWA </label>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-1" style={{ textAlign: 'right' }}>
                                                        <label htmlFor="include_tnos_fee" className="form-label">
                                                            {formatRupiah(pricePWA)}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>

                                    ) : (
                                        selectedSetting !== 0 ? (
                                            <>
                                                {selectedSetting === 2 ? (
                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="harga_dasar" className="form-label"> Harga Dasar </label>
                                                                <input type="number" className="form-control" id="harga_dasar" name="harga_dasar" placeholder="Masukkan Harga Dasar" value={formData.harga_dasar || ""} onChange={handleChange} />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="include_tnos_fee" className="form-label"> Include TNOS Fee (%) </label>
                                                                <input type="number" className="form-control" id="include_tnos_fee" name="include_tnos_fee" placeholder="Masukkan Include TNOS Fee (%)" value={formData.include_tnos_fee || ""} onChange={handleChange} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ) : selectedSetting === 1 ? (
                                                    <>
                                                        <Row>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <label htmlFor="include_tnos_range" className="form-label"> Include TNOS </label>
                                                                    <input type="number" className="form-control" id="include_tnos_range" name="include_tnos_range" placeholder="Masukkan Include TNOS" value={formData.include_tnos_range || ""} onChange={handleChange} />
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <label htmlFor="percentance" className="form-label"> Persentanse Harga Dasar </label>
                                                                    <input type="number" className="form-control" id="percentance" name="percentance" placeholder="Masukkan Persentanse" value={formData.percentance || ""} onChange={handleChange} />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="include_ppn" className="form-label"> Include PPN (%) </label>
                                                            <input type="number" className="form-control" id="include_ppn" name="include_ppn" placeholder="Masukkan Include PPN" value={formData.include_ppn || ""} onChange={handleChange} />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <label htmlFor="platform_fee" className="form-label"> Platform Fee </label>
                                                            <input type="number" className="form-control" id="platform_fee" name="platform_fee" placeholder="Masukkan Platform Fee" value={formData.platform_fee || ""} onChange={handleChange} />
                                                        </div>
                                                    </Col>
                                                </Row>

                                                {hargaIncludeTnos !== 0 || hargaIncludeTNOSRange !== 0 ? (
                                                    <Button variant="danger" size="sm" onClick={resetForm}>
                                                        <FontAwesomeIcon icon={faTrash} /> Reset
                                                    </Button>
                                                ) : (
                                                    <>
                                                    </>
                                                )}

                                                <hr />

                                                {selectedSetting === 1 ? (
                                                    <Row>
                                                        <Col md={4}>
                                                            <div className="mb-1">
                                                                <label htmlFor="include_tnos_fee" className="form-label"> Harga Dasar </label>
                                                            </div>
                                                        </Col>
                                                        <Col md={8}>
                                                            <div className="mb-1" style={{ textAlign: 'right' }}>
                                                                <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(hargaIncludeTNOSRange)} </label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                ) : (
                                                    <></>
                                                )}

                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> Include TNOS {selectedSetting === 1 ? "" : "Fee"} </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label">
                                                                {selectedSetting === 1 ? (
                                                                    formatRupiah(includeTnosFee)
                                                                ) : (
                                                                    formatRupiah(hargaIncludeTnos)
                                                                )}
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> TNOS Fee </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(tnosFee)} </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> Include PPN </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(pricePPN)} </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> Harga Platform </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(platformFee)} </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <label htmlFor="include_tnos_fee" className="form-label"> Harga PWA </label>
                                                        </div>
                                                    </Col>
                                                    <Col md={8}>
                                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(pricePWA)} </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    )}
                                </Form>
                            </>
                        ) : location.pathname.endsWith("sub-section") ? (
                            <>
                                <Form onSubmit={handleSubmit} method="POST">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label"> Nama </label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Masukkan Nama" value={formData.name || ""} onChange={handleChange} />
                                    </div>
                                </Form>
                            </>
                        ) : (
                            <>
                                <Form onSubmit={handleSubmit} method="POST">
                                    <div className="mb-3">
                                        <label htmlFor="column" className="form-label"> Kolom </label>
                                        <input type="text" className="form-control" id="column" name="column" placeholder="Masukkan Nama Kolom" value={formData.column || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="harga" className="form-label"> Harga </label>
                                        <input type="number" className="form-control" id="harga" name="harga" placeholder="Masukkan Harga" value={formData.harga || ""} onChange={handleChange} />
                                    </div>
                                </Form>
                            </>
                        )}
                    </>
                ) : (location.pathname.includes("/pwa-b2b/lainnya")) ? (
                    <Form onSubmit={handleSubmit} method="POST">
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="others_column" className="form-label">
                                        Others Column
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="others_column"
                                        name="others_column"
                                        placeholder="Masukkan Others Column"
                                        value={formData.others_column || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="satuan" className="form-label"> Satuan </label>
                                    <Form.Select
                                        name="satuan"
                                        value={selectedSatuanUnit}
                                        onChange={(e) => setSelectedSatuanUnit(e.target.value)}
                                    >
                                        <option value="">- Pilih -</option>
                                        {getSatuanUnit?.map((item) => (
                                            <option key={item.key} value={item.id}>
                                                {item.satuan}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <label htmlFor="reference_id" className="form-label">
                                Reference Column
                            </label>
                            <Form.Select name="reference_id" value={formData.reference_id || ""} onChange={handleChangeReference}>
                                <option value="">- Pilih Referensi Kolom -</option>
                                {getReference?.length > 0 ? (
                                    getReference?.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.column}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">- Loading -</option>
                                )}
                            </Form.Select>
                        </div>

                        <div className="mb-3">
                            <h6>Termasuk Pilihan Kolom</h6>
                            {selectedOptions.length > 0 ? (
                                <ul>
                                    {selectedOptions.map((option, index) => (
                                        <li key={index}>
                                            {option.column}{" "}
                                            <span
                                                style={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                    marginLeft: "10px"
                                                }}
                                                onClick={() => handleDeleteArr(option.id)}
                                            >
                                                🗑️
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Belum Ada Pilihan</p>
                            )}
                        </div>

                        <Row>
                            <Col md={12}>
                                <div className="mb-3">
                                    <label htmlFor="harga_dasar" className="form-label"> Setting Harga Dasar </label>
                                    <Form.Select
                                        name="transaction_status"
                                        value={selectedSetting}
                                        onChange={(e) => setSelectedSetting(parseInt(e.target.value))}
                                    >
                                        {getSettingHargaDasar?.map((item) => (
                                            <option key={item.key} value={item.value}>
                                                {item.defaultValue}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>

                        {selectedSetting !== 0 ? (
                            <>
                                {selectedSetting === 2 ? (
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <label htmlFor="harga_dasar" className="form-label"> Harga Dasar </label>
                                                <input type="number" className="form-control" id="harga_dasar" name="harga_dasar" placeholder="Masukkan Harga Dasar" value={formData.harga_dasar || ""} onChange={handleChange} />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <label htmlFor="include_tnos_fee" className="form-label"> Include TNOS Fee (%) </label>
                                                <input type="number" className="form-control" id="include_tnos_fee" name="include_tnos_fee" placeholder="Masukkan Include TNOS Fee (%)" value={formData.include_tnos_fee || ""} onChange={handleChange} />
                                            </div>
                                        </Col>
                                    </Row>
                                ) : selectedSetting === 1 ? (
                                    <>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label htmlFor="include_tnos_range" className="form-label"> Include TNOS </label>
                                                    <input type="number" className="form-control" id="include_tnos_range" name="include_tnos_range" placeholder="Masukkan Include TNOS" value={formData.include_tnos_range || ""} onChange={handleChange} />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label htmlFor="percentance" className="form-label"> Persentanse Harga Dasar </label>
                                                    <input type="number" className="form-control" id="percentance" name="percentance" placeholder="Masukkan Persentanse" value={formData.percentance || ""} onChange={handleChange} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="include_ppn" className="form-label"> Include PPN (%) </label>
                                            <input type="number" className="form-control" id="include_ppn" name="include_ppn" placeholder="Masukkan Include PPN" value={formData.include_ppn || ""} onChange={handleChange} />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="platform_fee" className="form-label"> Platform Fee </label>
                                            <input type="number" className="form-control" id="platform_fee" name="platform_fee" placeholder="Masukkan Platform Fee" value={formData.platform_fee || ""} onChange={handleChange} />
                                        </div>
                                    </Col>
                                </Row>

                                {hargaIncludeTnos !== 0 || hargaIncludeTNOSRange !== 0 ? (
                                    <Button variant="danger" size="sm" onClick={resetForm}>
                                        <FontAwesomeIcon icon={faTrash} /> Reset
                                    </Button>
                                ) : (
                                    <>
                                    </>
                                )}

                                <hr />

                                {selectedSetting === 1 ? (
                                    <Row>
                                        <Col md={4}>
                                            <div className="mb-1">
                                                <label htmlFor="include_tnos_fee" className="form-label"> Harga Dasar </label>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className="mb-1" style={{ textAlign: 'right' }}>
                                                <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(hargaIncludeTNOSRange)} </label>
                                            </div>
                                        </Col>
                                    </Row>
                                ) : (
                                    <></>
                                )}

                                <Row>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label htmlFor="include_tnos_fee" className="form-label"> Include TNOS {selectedSetting === 1 ? "" : "Fee"} </label>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                            <label htmlFor="include_tnos_fee" className="form-label">
                                                {selectedSetting === 1 ? (
                                                    formatRupiah(includeTnosFee)
                                                ) : (
                                                    formatRupiah(hargaIncludeTnos)
                                                )}
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label htmlFor="include_tnos_fee" className="form-label"> TNOS Fee </label>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(tnosFee)} </label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label htmlFor="include_tnos_fee" className="form-label"> Include PPN </label>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(pricePPN)} </label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label htmlFor="include_tnos_fee" className="form-label"> Harga Platform </label>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(platformFee)} </label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label htmlFor="include_tnos_fee" className="form-label"> Harga PWA </label>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className="mb-1" style={{ textAlign: 'right' }}>
                                            <label htmlFor="include_tnos_fee" className="form-label"> {formatRupiah(pricePWA)} </label>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <></>
                        )}
                    </Form>
                ) : (location.pathname.includes("/pwa-b2b/unit")) ? (
                    <>
                        <Form onSubmit={handleSubmit} method="POST">
                            <div className="mb-3">
                                <label htmlFor="satuan" className="form-label">
                                    Satuan
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="satuan"
                                    name="satuan"
                                    placeholder="Masukkan Satuan"
                                    value={formData.satuan || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </Form>
                    </>
                ) : (location.pathname.includes("/pwa-b2b/component-others")) ? (
                    <>
                        <Form onSubmit={handleSubmit} method="POST">
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label htmlFor="komponen" className="form-label">
                                            Nama Komponen
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="komponen"
                                            name="komponen"
                                            placeholder="Masukkan Nama Komponen"
                                            value={formData.komponen || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label htmlFor="satuan" className="form-label"> Satuan </label>
                                        <Form.Select
                                            name="satuan"
                                            value={formData.satuan || ""}
                                            onChange={handleChangeKomponenLainnya}>
                                            <option value="">- Pilih -</option>
                                            {getSatuanUnit?.map((item) => (
                                                <option key={item.key} value={item.id}>
                                                    {item.satuan}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </Col>
                            </Row>

                            {isEditing ? (
                                <>
                                    {btnHargaFetch.map((btnHarga, index) => (
                                        <>
                                            <input type="hidden" name="id_harga_komponen" value={btnHarga.id} />
                                            <Row key={index}>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor={`harga_dari-${index}`} className="form-label">
                                                            Harga Dari
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`harga_dari-${index}`}
                                                            name="harga_dari"
                                                            placeholder="Masukkan Harga Dari"
                                                            value={btnHarga.harga_dari}
                                                            onChange={(e) => handleChangeHargaFetch(index, e)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor={`harga_sampai-${index}`} className="form-label">
                                                            Harga Sampai
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`harga_sampai-${index}`}
                                                            name="harga_sampai"
                                                            placeholder="Masukkan Harga Sampai"
                                                            value={btnHarga.harga_sampai}
                                                            onChange={(e) => handleChangeHargaFetch(index, e)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor={`harga_akhir-${index}`} className="form-label">
                                                            Harga Akhir
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`harga_akhir-${index}`}
                                                            name="harga_akhir"
                                                            placeholder="Masukkan Harga Sampai"
                                                            value={btnHarga.harga_akhir}
                                                            onChange={(e) => handleChangeHargaFetch(index, e)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    ))}

                                    <Row>
                                        <Col md={12}>
                                            <Button variant="success" size="sm" onClick={addBtnHargaFetch}>
                                                <FontAwesomeIcon icon={faPlus} /> Tambah Harga
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <>
                                    {btnHargaList.map((harga, index) => (
                                        <Row key={index}>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <label htmlFor={`hargaDari-${index}`} className="form-label">
                                                        Harga Dari
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`hargaDari-${index}`}
                                                        name="hargaDari"
                                                        placeholder="Masukkan Harga Dari"
                                                        value={harga.hargaDari}
                                                        onChange={(e) => handleChangeHarga(index, e)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <label htmlFor={`hargaSampai-${index}`} className="form-label">
                                                        Harga Sampai
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`hargaSampai-${index}`}
                                                        name="hargaSampai"
                                                        placeholder="Masukkan Harga Sampai"
                                                        value={harga.hargaSampai}
                                                        onChange={(e) => handleChangeHarga(index, e)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <label htmlFor={`hargaAkhir-${index}`} className="form-label">
                                                        Harga Akhir
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`hargaAkhir-${index}`}
                                                        name="hargaAkhir"
                                                        placeholder="Masukkan Harga Sampai"
                                                        value={harga.hargaAkhir}
                                                        onChange={(e) => handleChangeHarga(index, e)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Row>
                                        <Col md={12}>
                                            <Button variant="success" size="sm" onClick={addBtnHarga}>
                                                <FontAwesomeIcon icon={faPlus} /> Tambah Harga
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Form>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit} method="POST">
                        <div className="mb-3">
                            <label htmlFor="name_sc" className="form-label">
                                Nama Security Provider
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name_sc"
                                name="name_sc"
                                placeholder="Masukkan Nama Security Provider"
                                value={formData.name_sc || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name_pt" className="form-label">
                                Nama PT
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name_pt"
                                name="name_pt"
                                placeholder="Masukkan Nama PT"
                                value={formData.name_pt || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                                Logo Gambar
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                name="image"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                className="form-control"
                                id="description"
                                placeholder="Masukkan Deskripsi"
                                rows={5}
                                value={formData.description || ""}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button type="reset" size="sm" variant="danger" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} /> Batal
                </Button>
                <Button type="submit" size="sm" variant="success" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyModal;
