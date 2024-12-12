import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {
    Breadcrumb,
    Col,
    Row,
    Card,
    Form,
    Button,
    Modal,
    Badge,
} from "@themesberg/react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";
import Preloader from "../../components/Preloader";
import ReadableDateTime from "../../components/ReadableDateTime";
import ProfileCover from "../../assets/img/profile-cover.jpg";

export default () => {
    const { id } = useParams();

    const [getLawyerFrontData, setLawyerFrontData] = useState();
    const [getLawyerData, setLawyerData] = useState();
    const [getDocumentModalTitle, setDocumentModalTitle] = useState("");
    const [showDefault, setShowDefault] = useState(false);
    const [getGenderArr] = useState([
        { key: "gender_1", value: "Man", defaultValue: "Laki - Laki" },
        { key: "gender_2", value: "Woman", defaultValue: "Perempuan" },
    ]);
    const [getMarriageStatusArr] = useState([
        { key: "status_kawin_1", value: "BK", defaultValue: "Belum Kawin" },
        { key: "status_kawin_2", value: "K", defaultValue: "Kawin" },
        { key: "status_kawin_3", value: "C", defaultValue: "Cerai" },
    ]);
    const [getBankProvider] = useState([
        {
            key: "bank_1",
            value: "1",
            defaultValue: "PT. BANK RAKYAT INDONESIA (PERSERO), Tbk -- BRI",
        },
        {
            key: "bank_2",
            value: "2",
            defaultValue: "PT. BANK MANDIRI (PERSERO), Tbk",
        },
        {
            key: "bank_3",
            value: "3",
            defaultValue: "PT. BANK NEGARA INDONESIA (PERSERO), Tbk -- BNI",
        },
        {
            key: "bank_4",
            value: "4",
            defaultValue: "PT. BANK TABUNGAN NEGARA (PERSERO), Tbk -- BTN",
        },
        {
            key: "bank_5",
            value: "5",
            defaultValue: "PT. BANK DANAMON INDONESIA, Tbk",
        },
        { key: "bank_6", value: "6", defaultValue: "PT. BANK PERMATA, Tbk" },
        {
            key: "bank_7",
            value: "7",
            defaultValue: "PT. BANK CENTRAL ASIA, Tbk -- BCA",
        },
        {
            key: "bank_8",
            value: "8",
            defaultValue: "PT. BANK MAYBANK  INDONESIA, Tbk",
        },
        { key: "bank_9", value: "9", defaultValue: "PT. PAN INDONESIA BANK, Tbk" },
        { key: "bank_10", value: "10", defaultValue: "PT. BANK CIMB NIAGA, Tbk" },
        { key: "bank_11", value: "11", defaultValue: "PT. BANK UOB INDONESIA" },
        { key: "bank_12", value: "12", defaultValue: "PT. BANK OCBC NISP, Tbk" },
        {
            key: "bank_13",
            value: "13",
            defaultValue: "PT. BANK ARTHA GRAHA INTERNASIONAL, Tbk",
        },
        { key: "bank_14", value: "14", defaultValue: "PT. BANK BUMI ARTA, Tbk" },
        { key: "bank_15", value: "15", defaultValue: "PT. BANK HSBC INDONESIA" },
        {
            key: "bank_16",
            value: "16",
            defaultValue: "PT. BANK JTRUST INDONESIA, Tbk",
        },
        {
            key: "bank_17",
            value: "17",
            defaultValue: "PT. BANK MAYAPADA INTERNATIONAL, Tbk",
        },
        {
            key: "bank_18",
            value: "18",
            defaultValue: "PT. BANK OF INDIA INDONESIA, Tbk",
        },
        {
            key: "bank_19",
            value: "19",
            defaultValue: "PT. BANK MUAMALAT INDONESIA, Tbk",
        },
        {
            key: "bank_20",
            value: "20",
            defaultValue: "PT. BANK MESTIKA DHARMA, Tbk",
        },
        { key: "bank_21", value: "21", defaultValue: "PT. BANK SHINHAN INDONESIA" },
        { key: "bank_22", value: "22", defaultValue: "PT. BANK SINARMAS, Tbk" },
        {
            key: "bank_23",
            value: "23",
            defaultValue: "PT. BANK MASPION INDONESIA, Tbk",
        },
        { key: "bank_24", value: "24", defaultValue: "PT. BANK GANESHA, Tbk" },
        { key: "bank_25", value: "25", defaultValue: "PT. BANK ICBC INDONESIA" },
        {
            key: "bank_26",
            value: "26",
            defaultValue: "PT. BANK QNB INDONESIA, Tbk",
        },
        {
            key: "bank_27",
            value: "27",
            defaultValue: "PT. BANK WOORI SAUDARA INDONESIA 1906, Tbk",
        },
        { key: "bank_28", value: "28", defaultValue: "PT. BANK MEGA, Tbk" },
        { key: "bank_29", value: "29", defaultValue: "PT. BANK BNI SYARIAH" },
        { key: "bank_30", value: "30", defaultValue: "PT. BANK BUKOPIN, Tbk" },
        {
            key: "bank_31",
            value: "31",
            defaultValue: "PT. BANK SYARIAH MANDIRI -- MANDIRI SYARIAH",
        },
        {
            key: "bank_32",
            value: "32",
            defaultValue: "PT. BANK KEB HANA INDONESIA",
        },
        {
            key: "bank_33",
            value: "33",
            defaultValue: "PT. BANK MNC INTERNASIONAL, Tbk",
        },
        {
            key: "bank_34",
            value: "34",
            defaultValue: "PT. BANK RAKYAT INDONESIA AGRONIAGA, Tbk -- BRI AGRONIAGA",
        },
        { key: "bank_35", value: "35", defaultValue: "PT. BANK SBI INDONESIA" },
        { key: "bank_36", value: "36", defaultValue: "PT. BANK MEGA SYARIAH" },
        { key: "bank_37", value: "37", defaultValue: "PT. BANK INDEX SELINDO" },
        { key: "bank_38", value: "38", defaultValue: "PT. BANK MAYORA" },
        {
            key: "bank_39",
            value: "39",
            defaultValue: "PT. BANK CHINA CONSTRUCTION BANK INDONESIA, Tbk",
        },
        { key: "bank_40", value: "40", defaultValue: "PT. BANK DBS INDONESIA" },
        { key: "bank_41", value: "41", defaultValue: "PT. BANK RESONA PERDANIA" },
        { key: "bank_41", value: "41", defaultValue: "PT. BANK MIZUHO INDONESIA" },
        {
            key: "bank_43",
            value: "43",
            defaultValue: "PT. BANK CAPITAL INDONESIA, Tbk",
        },
        {
            key: "bank_44",
            value: "44",
            defaultValue: "PT. BANK BNP PARIBAS INDONESIA",
        },
        { key: "bank_45", value: "45", defaultValue: "PT. BANK ANZ INDONESIA" },
        {
            key: "bank_46",
            value: "46",
            defaultValue: "PT. BANK RABOBANK INTERNATIONAL INDONESIA",
        },
        {
            key: "bank_47",
            value: "47",
            defaultValue: "PT. BANK IBK INDONESIA, Tbk",
        },
        {
            key: "bank_48",
            value: "48",
            defaultValue: "PT. BANK NET INDONESIA SYARIAH",
        },
        { key: "bank_49", value: "49", defaultValue: "PT. BANK CTBC INDONESIA" },
        { key: "bank_50", value: "50", defaultValue: "PT. BANK COMMONWEALTH" },
        { key: "bank_51", value: "51", defaultValue: "PT. BANK BTPN, Tbk" },
        { key: "bank_52", value: "52", defaultValue: "PT. BANK VICTORIA SYARIAH" },
        { key: "bank_53", value: "53", defaultValue: "PT. BANK BRI SYARIAH, Tbk" },
        {
            key: "bank_54",
            value: "54",
            defaultValue: "PT. BANK JABAR BANTEN SYARIAH",
        },
        {
            key: "bank_55",
            value: "55",
            defaultValue: "PT. BANK BISNIS INTERNASIONAL",
        },
        { key: "bank_56", value: "56", defaultValue: "PT. BANK JASA JAKARTA" },
        { key: "bank_57", value: "57", defaultValue: "PT. BANK YUDHA BHAKTI, Tbk" },
        { key: "bank_58", value: "58", defaultValue: "PT. BANK MITRANIAGA, Tbk" },
        { key: "bank_59", value: "59", defaultValue: "PT. BANK ROYAL INDONESIA" },
        {
            key: "bank_60",
            value: "60",
            defaultValue: "PT. BANK NATIONAL NOBU, Tbk",
        },
        { key: "bank_61", value: "61", defaultValue: "PT. BANK INA PERDANA, Tbk" },
        {
            key: "bank_62",
            value: "62",
            defaultValue: "PT. BANK PANIN DUBAI SYARIAH, Tbk",
        },
        { key: "bank_63", value: "63", defaultValue: "PT. PRIMA MASTER BANK" },
        { key: "bank_64", value: "64", defaultValue: "PT. BANK SYARIAH BUKOPIN" },
        { key: "bank_65", value: "65", defaultValue: "PT. BANK SAHABAT SAMPOERNA" },
        {
            key: "bank_66",
            value: "66",
            defaultValue: "PT. BANK DINAR INDONESIA, Tbk",
        },
        { key: "bank_67", value: "67", defaultValue: "PT. BANK AMAR INDONESIA" },
        {
            key: "bank_68",
            value: "68",
            defaultValue: "PT. BANK KESEJAHTERAAN EKONOMI",
        },
        { key: "bank_69", value: "69", defaultValue: "PT. BANK BCA SYARIAH" },
        { key: "bank_70", value: "70", defaultValue: "PT. BANK ARTOS INDONESIA" },
        {
            key: "bank_71",
            value: "71",
            defaultValue:
                "PT. BANK TABUNGAN PENSIUNAN NASIONAL SYARIAH, Tbk -- BTPN SYARIAH",
        },
        { key: "bank_72", value: "72", defaultValue: "PT. BANK MULTIARTA SENTOSA" },
        {
            key: "bank_73",
            value: "73",
            defaultValue: "PT. BANK FAMA INTERNASIONAL",
        },
        { key: "bank_74", value: "74", defaultValue: "PT. BANK MANDIRI TASPEN" },
        {
            key: "bank_75",
            value: "75",
            defaultValue: "PT. BANK VICTORIA INTERNATIONAL, Tbk",
        },
        {
            key: "bank_76",
            value: "76",
            defaultValue: "PT. BANK HARDA INTERNASIONAL",
        },
        {
            key: "bank_77",
            value: "77",
            defaultValue: "PT. BPD JAWA BARAT DAN BANTEN, Tbk",
        },
        { key: "bank_78", value: "78", defaultValue: "PT. BPD DKI" },
        {
            key: "bank_79",
            value: "79",
            defaultValue: "PT. BPD DAERAH ISTIMEWA YOGYAKARTA",
        },
        { key: "bank_80", value: "80", defaultValue: "PT. BPD JAWA TENGAH" },
        { key: "bank_81", value: "81", defaultValue: "PT. BPD JAWA TIMUR, Tbk" },
        { key: "bank_82", value: "82", defaultValue: "PT. BPD JAMBI" },
        { key: "bank_83", value: "83", defaultValue: "PT. BANK ACEH SYARIAH" },
        { key: "bank_84", value: "84", defaultValue: "PT. BPD SUMATERA UTARA" },
        { key: "bank_85", value: "85", defaultValue: "PT. BPD SUMATERA BARAT" },
        { key: "bank_86", value: "86", defaultValue: "PT. BPD RIAU KEPRI" },
        {
            key: "bank_87",
            value: "87",
            defaultValue: "PT. BPD SUMATERA SELATAN DAN BANGKA BELITUNG",
        },
        { key: "bank_88", value: "88", defaultValue: "PT. BPD LAMPUNG" },
        { key: "bank_89", value: "89", defaultValue: "PT. BPD KALIMANTAN SELATAN" },
        { key: "bank_90", value: "90", defaultValue: "PT. BPD KALIMANTAN BARAT" },
        {
            key: "bank_91",
            value: "91",
            defaultValue: "PT. BPD KALIMANTAN TIMUR DAN KALIMANTAN UTARA",
        },
        { key: "bank_92", value: "92", defaultValue: "PT. BPD KALIMANTAN TENGAH" },
        {
            key: "bank_93",
            value: "93",
            defaultValue: "PT. BPD SULAWESI SELATAN DAN SULAWESI BARAT",
        },
        {
            key: "bank_94",
            value: "94",
            defaultValue: "PT. BPD SULAWESI UTARA DAN  GORONTALO",
        },
        { key: "bank_95", value: "95", defaultValue: "PT. BANK NTB SYARIAH" },
        { key: "bank_96", value: "96", defaultValue: "PT. BPD BALI" },
        {
            key: "bank_97",
            value: "97",
            defaultValue: "PT. BPD NUSA TENGGARA TIMUR",
        },
        {
            key: "bank_98",
            value: "98",
            defaultValue: "PT. BPD MALUKU DAN MALUKU UTARA",
        },
        { key: "bank_99", value: "99", defaultValue: "PT. BPD PAPUA" },
        { key: "bank_100", value: "100", defaultValue: "PT. BPD BENGKULU" },
        { key: "bank_101", value: "101", defaultValue: "PT. BPD SULAWESI TENGAH" },
        {
            key: "bank_102",
            value: "102",
            defaultValue: "PT. BPD SULAWESI TENGGARA",
        },
        { key: "bank_103", value: "103", defaultValue: "PT. BPD BANTEN, Tbk" },
        { key: "bank_104", value: "104", defaultValue: "CITIBANK, N.A." },
        { key: "bank_105", value: "105", defaultValue: "JP MORGAN CHASE BANK, NA" },
        { key: "bank_106", value: "106", defaultValue: "BANK OF AMERICA, N.A" },
        { key: "bank_107", value: "107", defaultValue: "BANGKOK BANK PCL" },
        { key: "bank_108", value: "108", defaultValue: "MUFG BANK, LTD" },
        { key: "bank_109", value: "109", defaultValue: "STANDARD CHARTERED BANK" },
        { key: "bank_110", value: "110", defaultValue: "DEUTSCHE BANK AG" },
        {
            key: "bank_111",
            value: "111",
            defaultValue: "BANK OF CHINA (HONG KONG) LIMITED",
        },
        {
            key: "bank_112",
            value: "112",
            defaultValue: "PT. BANK NUSANTARA PARAHYANGAN Tbk *)",
        },
        {
            key: "bank_113",
            value: "113",
            defaultValue: "PT. BANK OKE INDONESIA **)",
        },
        { key: "bank_114", value: "114", defaultValue: "Bank Anda" },
        { key: "bank_115", value: "115", defaultValue: "Bank Andara" },
        { key: "bank_116", value: "116", defaultValue: "Bank BPD Aceh" },
        { key: "bank_117", value: "117", defaultValue: "Bank BRI Agroniaga" },
        { key: "bank_118", value: "118", defaultValue: "Bank BTN Syariah" },
        { key: "bank_119", value: "119", defaultValue: "Bank Danamon Syariah" },
        { key: "bank_120", value: "120", defaultValue: "Bank DKI Syariah" },
        { key: "bank_121", value: "121", defaultValue: "Bank Ekonomi Raharja" },
        { key: "bank_122", value: "122", defaultValue: "Bank Kalbar Syariah" },
        { key: "bank_123", value: "123", defaultValue: "Bank Kalsel Syariah" },
        { key: "bank_124", value: "124", defaultValue: "Bank Kaltim Syariah" },
        { key: "bank_125", value: "125", defaultValue: "Bank Nagari" },
        { key: "bank_126", value: "126", defaultValue: "Bank Nagari Syariah" },
        { key: "bank_127", value: "127", defaultValue: "Bank NTB" },
        { key: "bank_128", value: "128", defaultValue: "Bank Permata Syariah" },
        { key: "bank_129", value: "129", defaultValue: "Bank Pundi Indonesia" },
        { key: "bank_130", value: "130", defaultValue: "Bank Riau Kepri Syariah" },
        {
            key: "bank_131",
            value: "131",
            defaultValue: "Bank Sumitomo Mitsui Indonesia",
        },
        {
            key: "bank_132",
            value: "132",
            defaultValue: "Bank Sumsel Babel Syariah",
        },
        { key: "bank_133", value: "133", defaultValue: "Bank Sumut Syariah" },
        {
            key: "bank_134",
            value: "134",
            defaultValue: "Bank Windu Kentjana International",
        },
        { key: "bank_135", value: "135", defaultValue: "BII Syariah" },
        { key: "bank_136", value: "136", defaultValue: "CIMB Niaga Syariah" },
        { key: "bank_137", value: "137", defaultValue: "OCBC NISP Syariah" },
        { key: "bank_138", value: "138", defaultValue: "Panin Bank Syariah" },
        {
            key: "bank_139",
            value: "139",
            defaultValue: "The Bank of Tokyo-Mitsubishi UFJ",
        },
    ]);

    const [getLegalConcentration] = useState([
        { key: "legal_concentration_0", value: null, defaultValue: "-" },
        { key: "legal_concentration_1", value: "1", defaultValue: "Pidana" },
        { key: "legal_concentration_2", value: "2", defaultValue: "Perdata" },
        { key: "legal_concentration_3", value: "3", defaultValue: "Bisnis" },
        { key: "legal_concentration_4", value: "4", defaultValue: "Pemerintahan" },
        { key: "legal_concentration_5", value: "5", defaultValue: "Syariah" },
        { key: "legal_concentration_6", value: "6", defaultValue: "Lainnya.." },
    ]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
            method: "POST",
            body: JSON.stringify({ category: "2" }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                let datas = data.data.filter((item) => item.code === id)[0];
                setLawyerFrontData(datas);
                setLawyerData({
                    data: JSON.parse(datas.mmid_data)[0].data[0],
                    fileAnother: JSON.parse(datas.mmid_data)[0].fileAnother,
                    fileKtp: JSON.parse(datas.mmid_data)[0].fileKtp,
                    filePhoto: JSON.parse(datas.mmid_data)[0].filePhoto,
                });
            });
    }, [id]);

    const handleClose = () => setShowDefault(false);

    const changeStatusPartner = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch(
            `${process.env.REACT_APP_MITRA_TNOS_API_URL}/verifikasi-lawyer/${id}`,
            {
                method: "POST",
                body: JSON.stringify({
                    code: id,
                    note: "Notes",
                    status: formData.get("status"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("lawyerFullname", getLawyerFrontData?.fullname);
                window.location.href = "/partner/lawyer#actual_verification_tab";
            });
    };

    return (
        <>
            <Row>
                <Preloader show={!getLawyerData ? true : false} />
                <Row className="mt-4"></Row>
                <Breadcrumb
                    className="d-none d-md-inline-block"
                    listProps={{
                        className: "breadcrumb-dark breadcrumb-transparent",
                    }}
                >
                    <Breadcrumb.Item href="/partner/lawyer">
                        Mitra Pengacara
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Verifikasi Dokumen</Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12} xl={12}>
                    <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                            <Form method="POST" onSubmit={changeStatusPartner}>
                                <Row>
                                    <Col md={4} className="mb-3">
                                        <Form.Group id="mitraPengacaraDetail">
                                            <Form.Label>Mitra Pengacara</Form.Label>
                                            <ul>
                                                {[
                                                    ["Kode Mitra", "code"],
                                                    ["Nama Lengkap", "fullname"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerFrontData?.[key] === null
                                                            ? "-"
                                                            : getLawyerFrontData?.[key]}
                                                    </li>
                                                ))}
                                                <li>
                                                    <b>Tanggal Mendaftar : </b>
                                                    {getLawyerFrontData?.mmit_date_insert === null
                                                        ? "-"
                                                        : ReadableDateTime(
                                                            getLawyerFrontData?.mmit_date_insert
                                                        ).split(" ")[0]}
                                                </li>
                                                <li>
                                                    <b>Jam Mendaftar : </b>
                                                    {getLawyerFrontData?.mmit_date_insert === null
                                                        ? "-"
                                                        : ReadableDateTime(
                                                            getLawyerFrontData?.mmit_date_insert
                                                        ).split(" ")[1]}
                                                </li>
                                                <li>
                                                    <b>Status : </b>
                                                    <Badge
                                                        bg={
                                                            getLawyerFrontData?.mmit_status === 0
                                                                ? "cyan"
                                                                : getLawyerFrontData?.mmit_status === 1
                                                                    ? "soft-green"
                                                                    : getLawyerFrontData?.mmit_status === 2
                                                                        ? "warning"
                                                                        : getLawyerFrontData?.mmit_status === 3
                                                                            ? "secondary"
                                                                            : getLawyerFrontData?.mmit_status === 4
                                                                                ? "primary"
                                                                                : getLawyerFrontData?.mmit_status === 5
                                                                                    ? "gray"
                                                                                    : getLawyerFrontData?.mmit_status === 6
                                                                                        ? "blue"
                                                                                        : getLawyerFrontData?.mmit_status === 7
                                                                                            ? "pink"
                                                                                            : getLawyerFrontData?.mmit_status === 9
                                                                                                ? "success"
                                                                                                : getLawyerFrontData?.mmit_status === 10
                                                                                                    ? "gray"
                                                                                                    : ""
                                                        }
                                                    >
                                                        {getLawyerFrontData?.mmit_status === 0
                                                            ? "Menunggu Verifikasi"
                                                            : getLawyerFrontData?.mmit_status === 1
                                                                ? "Lolos Verifikasi Dokumen"
                                                                : getLawyerFrontData?.mmit_status === 2
                                                                    ? "Tidak Lolos Verifikasi Dokumen"
                                                                    : getLawyerFrontData?.mmit_status === 3
                                                                        ? "Atur Jadwal Verifikasi Aktual"
                                                                        : getLawyerFrontData?.mmit_status === 4
                                                                            ? "Menunggu Verifikasi Aktual"
                                                                            : getLawyerFrontData?.mmit_status === 5
                                                                                ? "Jadwal Pembekalan"
                                                                                : getLawyerFrontData?.mmit_status === 6
                                                                                    ? "Tidak Lolos Verifikasi Aktual"
                                                                                    : getLawyerFrontData?.mmit_status === 7
                                                                                        ? "Pembekalan"
                                                                                        : getLawyerFrontData?.mmit_status === 9
                                                                                            ? "Online"
                                                                                            : getLawyerFrontData?.mmit_status === 10
                                                                                                ? "Offline"
                                                                                                : ""}
                                                    </Badge>
                                                </li>
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="dataDiri">
                                            <Form.Label>Data Diri</Form.Label>
                                            <ul>
                                                {[
                                                    ["NIK KTP", "nik"],
                                                    ["NPWP", "npwp"],
                                                    ["Nama Depan", "first_name"],
                                                    ["Nama Belakang & Gelar", "last_name"],
                                                    ["Tempat Lahir", "place_of_birth"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                                <li>
                                                    <b>Tanggal Lahir : </b>
                                                    {getLawyerData?.data.date_of_birth === null
                                                        ? "-"
                                                        : moment(getLawyerData?.data.date_of_birth).format(
                                                            "LL"
                                                        )}
                                                </li>
                                                {[
                                                    ["No. HP Aktif", "phone_1"],
                                                    ["Email", "email"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                                <li>
                                                    <b>Jenis Kelamin : </b>
                                                    {getLawyerData?.data.gender === null
                                                        ? "-"
                                                        : getGenderArr?.map(
                                                            (item) =>
                                                                getLawyerData?.data.gender === item.value &&
                                                                item.defaultValue
                                                        )}
                                                </li>
                                                <li>
                                                    <b>Golongan Darah : </b>
                                                    {getLawyerData?.data.gol_darah === null
                                                        ? "-"
                                                        : getLawyerData?.data.gol_darah}
                                                </li>
                                                <li>
                                                    <b>Status Perkawinan : </b>
                                                    {getLawyerData?.data.status_kawin === null
                                                        ? "-"
                                                        : getMarriageStatusArr?.map(
                                                            (item) =>
                                                                getLawyerData?.data.status_kawin ===
                                                                item.value && item.defaultValue
                                                        )}
                                                </li>
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="alamatSesuaiKtp">
                                            <Form.Label>Alamat Sesuai KTP</Form.Label>
                                            <ul>
                                                <li>
                                                    <b>Alamat : </b>
                                                    {getLawyerData?.data.address_card === null
                                                        ? "-"
                                                        : getLawyerData?.data.address_card}
                                                </li>
                                                <li>
                                                    <b>Provinsi : </b>
                                                    {getLawyerData?.data.province === null
                                                        ? "-"
                                                        : getLawyerData?.data.province}
                                                </li>
                                                <li>
                                                    <b>Kabupaten / Kota : </b>
                                                    {getLawyerData?.data.district === null
                                                        ? "-"
                                                        : getLawyerData?.data.district}
                                                </li>
                                                <li>
                                                    <b>Kecamatan : </b>
                                                    {getLawyerData?.data.sub_district === null
                                                        ? "-"
                                                        : getLawyerData?.data.sub_district}
                                                </li>
                                                <li>
                                                    <b>Kelurahan / Desa : </b>
                                                    {getLawyerData?.data.village === null
                                                        ? "-"
                                                        : getLawyerData?.data.village}
                                                </li>
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="alamatSaatIni">
                                            <Form.Label>Alamat Saat Ini</Form.Label>
                                            <ul>
                                                {getLawyerData?.data.currdomisilicheck === "1" ? (
                                                    <>
                                                        <li>
                                                            <b>Alamat : </b>
                                                            Sama dengan KTP
                                                        </li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>
                                                            <b>Alamat : </b>
                                                            {getLawyerData?.data.current_address === null
                                                                ? "-"
                                                                : getLawyerData?.data.current_address}
                                                        </li>
                                                        <li>
                                                            <b>Provinsi : </b>
                                                            {getLawyerData?.data.current_province_id === null
                                                                ? "-"
                                                                : getLawyerData?.data.current_province_id}
                                                        </li>
                                                        <li>
                                                            <b>Kabupaten / Kota : </b>
                                                            {getLawyerData?.data.current_district_id === null
                                                                ? "-"
                                                                : getLawyerData?.data.current_district_id}
                                                        </li>
                                                        <li>
                                                            <b>Kecamatan : </b>
                                                            {getLawyerData?.data.current_kecamatan_id === null
                                                                ? "-"
                                                                : getLawyerData?.data.current_kecamatan_id}
                                                        </li>
                                                        <li>
                                                            <b>Kelurahan / Desa : </b>
                                                            {getLawyerData?.data.current_keldesa_id === null
                                                                ? "-"
                                                                : getLawyerData?.data.current_keldesa_id}
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="mb-3">
                                        <Form.Group id="dataPekerjaan">
                                            <Form.Label>Data Pekerjaan</Form.Label>
                                            <ul>
                                                {[
                                                    ["Nama Asosiasi", "nama_asosiasi"],
                                                    ["No. Induk Anggota", "no_IndukAnggota"],
                                                    [
                                                        "Tahun Pelantikan Advokat",
                                                        "tahun_pelantikan_advokat",
                                                    ],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                                <li>
                                                    <b>Tergabung di Kantor Pengacara : </b>
                                                    {getLawyerData?.data.gabung_kantor_pengacara === null
                                                        ? "-"
                                                        : getLawyerData?.data.gabung_kantor_pengacara ===
                                                            "Y"
                                                            ? getLawyerData?.data.mention_kantor_pengacara
                                                            : "Tidak Tergabung di Kantor Pengacara"}
                                                </li>
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="riwayatPendidikan">
                                            <Form.Label>Riwayat Pendidikan</Form.Label>
                                            <ul>
                                                <li>
                                                    <b>Pendidikan Formal Hukum Terakhir : </b>
                                                    {getLawyerData?.data.pendidikan_formal_hukum === null
                                                        ? "-"
                                                        : getLawyerData?.data.pendidikan_formal_hukum}
                                                </li>
                                                <li>
                                                    <b>Konsentrasi Hukum : </b>
                                                    {getLawyerData?.data.konsentrasi_hukum === null
                                                        ? "-"
                                                        : getLegalConcentration?.map(
                                                            (item) =>
                                                                getLawyerData?.data.konsentrasi_hukum ===
                                                                item.value && item.defaultValue
                                                        )}
                                                </li>
                                                {[
                                                    ["Universitas", "universitas"],
                                                    ["No. Ijazah", "no_ijazah"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="kursusPelatihanSertifikasiYangPernahDiikuti">
                                            <Form.Label>
                                                Kursus / Pelatihan / Sertifikasi yang Pernah Diikuti
                                            </Form.Label>
                                            <ul>
                                                {[
                                                    [
                                                        "Nama Kursus / Pelatihan / Sertifikas",
                                                        "nama_kursus",
                                                    ],
                                                    ["Tahun", "tahun_kursus"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="dataBank">
                                            <Form.Label>Data Bank</Form.Label>
                                            <ul>
                                                <li>
                                                    <b>Nama Bank : </b>
                                                    {getLawyerData?.data.bank === null
                                                        ? "-"
                                                        : getBankProvider?.map(
                                                            (item) =>
                                                                getLawyerData?.data.bank === item.value &&
                                                                item.defaultValue
                                                        )}
                                                </li>
                                                {[
                                                    ["Cabang", "cabang"],
                                                    ["Nomor Rekening", "nomor_rekening"],
                                                    ["Atas Nama", "atas_nama"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="mb-3">
                                        <Form.Group id="orangTerdekatTidakSerumah">
                                            <Form.Label>Orang Terdekat Tidak Serumah</Form.Label>
                                            <ul>
                                                {[
                                                    ["Nama Depan", "nama_depan_pasangan"],
                                                    ["Nama Belakang", "nama_belakang_pasangan"],
                                                    ["Hubungan", "hubungan"],
                                                    ["No. HP", "no_hp"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        {getLawyerData?.data?.[key] === null
                                                            ? "-"
                                                            : getLawyerData?.data?.[key]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Form.Group>
                                        <Form.Group id="dokumenMitraPengacara">
                                            <Form.Label>Dokumen</Form.Label>
                                            <ul>
                                                {[
                                                    ["KTP", "nama_depan_kerabat"],
                                                    ["Foto", "nama_belakang_pasangan"],
                                                    ["Lain-Lain", "hubungan"],
                                                ].map(([label, key]) => (
                                                    <li key={key}>
                                                        <b>{label} : </b>
                                                        <span
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setDocumentModalTitle(label);
                                                                setShowDefault(true);
                                                            }}
                                                        >
                                                            <u value={key}>
                                                                Lihat &nbsp;
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                            </u>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Modal
                                                as={Modal.Dialog}
                                                centered
                                                show={showDefault}
                                                onHide={handleClose}
                                            >
                                                <Modal.Header>
                                                    <Modal.Title className="h6">
                                                        Dokumen ({getDocumentModalTitle})
                                                    </Modal.Title>
                                                    <Button
                                                        variant="close"
                                                        aria-label="Close"
                                                        onClick={handleClose}
                                                    />
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <img src={ProfileCover} alt="" />
                                                </Modal.Body>
                                            </Modal>
                                        </Form.Group>

                                        <Form.Group id="hasilVerifikasiDokumen">
                                            <Form.Label>
                                                Apakah hasil verifikasi dokumen yang bersangkutan sesuai
                                                ?
                                            </Form.Label>
                                        </Form.Group>
                                        <Form.Check
                                            inline
                                            defaultChecked
                                            type="radio"
                                            defaultValue="Y"
                                            label="Sesuai"
                                            name="status"
                                            id="lawyer_lulus_radio"
                                            htmlFor="lawyer_lulus"
                                        />

                                        <Form.Check
                                            inline
                                            type="radio"
                                            defaultValue="N"
                                            label="Tidak Sesuai"
                                            name="status"
                                            id="lawyer_gagal"
                                            htmlFor="lawyer_gagal"
                                        />

                                        <Form.Group id="catatan" className="mt-4 d-none">
                                            <Form.Label>
                                                Catatan
                                                <span className="text-danger"> *</span>
                                            </Form.Label>
                                            <Form.Control as="textarea" name="note" rows={5} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit" className="float-end">
                                    Kirim
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
