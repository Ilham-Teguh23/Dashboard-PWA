import { Alert, Badge, Breadcrumb, Button, Card, Col, Form, InputGroup, Modal, Row } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Preloader from "../../components/Preloader";
import ReadableDateTime from "../../components/ReadableDateTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default () => {

    const { id } = useParams();

    const [getGuardFrontData, setGuardFrontData] = useState();
    const [getInnerAlert, setInnerAlert] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [getGuardData, setGuardData] = useState();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [getDocFile, setDocFile] = useState(null);
    const [showBtn, setShowBtn] = useState(false);
    const [getModalType, setModalType] = useState("document");
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
    const [getSimCategoryArr] = useState([
        { key: "tipesim_0", value: null, defaultValue: "-" },
        { key: "tipesim_1", value: "SIM1", defaultValue: "SIM UMUM" },
        { key: "tipesim_2", value: "SIM2", defaultValue: "SIM TNI-POLRI" },
    ]);
    const [getCurrentJob] = useState([
        { key: "current_job_1", value: "1", defaultValue: "TNI" },
        { key: "current_job_2", value: "2", defaultValue: "POLRI" },
        { key: "current_job_3", value: "3", defaultValue: "Umum" },
    ]);
    const [getLastRank] = useState([
        { key: "pangkat_terakhir_1", value: "1", defaultValue: "Perwira" },
        { key: "pangkat_terakhir_2", value: "2", defaultValue: "Bintara" },
        { key: "pangkat_terakhir_3", value: "3", defaultValue: "Tamtama" },
    ]);
    const [getCorpsOrigin] = useState([
        { key: "asal_korps_1", value: "1", defaultValue: "Infanteri" },
        { key: "asal_korps_2", value: "2", defaultValue: "Marinir" },
        { key: "asal_korps_3", value: "3", defaultValue: "Paskhas" },
        { key: "asal_korps_4", value: "4", defaultValue: "Artileri Medan" },
        {
            key: "asal_korps_5",
            value: "5",
            defaultValue: "Artileri Pertahanan Udara",
        },
        { key: "asal_korps_6", value: "6", defaultValue: "Kavaleri" },
        { key: "asal_korps_7", value: "7", defaultValue: "Pelaut" },
        { key: "asal_korps_8", value: "8", defaultValue: "Polisi Militer" },
        { key: "asal_korps_9", value: "9", defaultValue: "Ajudan Jenderal" },
        { key: "asal_korps_10", value: "10", defaultValue: "Angkutan" },
        { key: "asal_korps_11", value: "11", defaultValue: "Jasmani" },
        { key: "asal_korps_12", value: "12", defaultValue: "Peralatan" },
        { key: "asal_korps_13", value: "13", defaultValue: "Perbekalan" },
        { key: "asal_korps_14", value: "14", defaultValue: "Perhubungan" },
        { key: "asal_korps_15", value: "15", defaultValue: "Teknik" },
        { key: "asal_korps_16", value: "16", defaultValue: "Wanita TNI" },
        { key: "asal_korps_17", value: "17", defaultValue: "Zeni" },
    ]);

    const [getBrevetQualification] = useState([
        { key: "kualifikasi_bravet_1", value: "1", defaultValue: "Bravo" },
        { key: "kualifikasi_bravet_2", value: "2", defaultValue: "Cakra" },
        { key: "kualifikasi_bravet_3", value: "3", defaultValue: "Dallan" },
        { key: "kualifikasi_bravet_4", value: "4", defaultValue: "Dalpur" },
        { key: "kualifikasi_bravet_5", value: "5", defaultValue: "Denjaka" },
        { key: "kualifikasi_bravet_6", value: "6", defaultValue: "Freefal" },
        { key: "kualifikasi_bravet_7", value: "7", defaultValue: "Hiu Kencana" },
        { key: "kualifikasi_bravet_8", value: "8", defaultValue: "Jibom/Jihandak" },
        { key: "kualifikasi_bravet_9", value: "9", defaultValue: "Komando" },
        { key: "kualifikasi_bravet_10", value: "10", defaultValue: "Kopaska" },
        {
            key: "kualifikasi_bravet_11",
            value: "11",
            defaultValue: "Manusia Katak",
        },
        { key: "kualifikasi_bravet_12", value: "12", defaultValue: "Mobud" },
        { key: "kualifikasi_bravet_13", value: "13", defaultValue: "Navrad" },
        { key: "kualifikasi_bravet_14", value: "14", defaultValue: "Pandu Udara" },
        { key: "kualifikasi_bravet_15", value: "15", defaultValue: "Para" },
        {
            key: "kualifikasi_bravet_16",
            value: "16",
            defaultValue: "Pelatih (SPI &amp; SBI)",
        },
        { key: "kualifikasi_bravet_17", value: "17", defaultValue: "Pemburu" },
        { key: "kualifikasi_bravet_18", value: "18", defaultValue: "Raider" },
        { key: "kualifikasi_bravet_19", value: "19", defaultValue: "SAR Tempur" },
        { key: "kualifikasi_bravet_20", value: "20", defaultValue: "Scuba TNI AL" },
        { key: "kualifikasi_bravet_21", value: "21", defaultValue: "Selam TNI" },
        { key: "kualifikasi_bravet_22", value: "22", defaultValue: "Taifib" },
        { key: "kualifikasi_bravet_23", value: "23", defaultValue: "Taipur" },
        { key: "kualifikasi_bravet_24", value: "24", defaultValue: "Tembak Mahir" },
    ]);
    const [getLastRankPolri] = useState([
        { key: "pangkat_terakhir_polri_1", value: "1", defaultValue: "Perwira" },
        { key: "pangkat_terakhir_polri_2", value: "2", defaultValue: "Bintara" },
        { key: "pangkat_terakhir_polri_3", value: "3", defaultValue: "Tamtama" },
    ]);
    const [getCorpsOriginPolri] = useState([
        { key: "asal_korps_polri_1", value: "1", defaultValue: "Brimob" },
        { key: "asal_korps_polri_2", value: "2", defaultValue: "Sabhara" },
        { key: "asal_korps_polri_3", value: "3", defaultValue: "Polisi Pantai" },
        { key: "asal_korps_polri_4", value: "4", defaultValue: "Polwan" },
    ]);

    const getPhotoMitra = (code, photo) => {
        let arrphoto1 = [];
        let arrphoto2 = [];
        let arrphoto3 = "";
        if (photo) {
            arrphoto1 = photo.split("-");
            arrphoto2 = arrphoto1[1].split("_");
            arrphoto3 = arrphoto2[1].split(".");
        }

        let avatar = "";
        if (arrphoto3) {
            avatar =
                "https://01-tnos-storage.s3.ap-southeast-1.amazonaws.com/IMG/" +
                arrphoto2[0] +
                "/" +
                code +
                "/" +
                arrphoto1[0] +
                "/" +
                arrphoto3[0] +
                "/" +
                photo;
        }

        return avatar;
    };

    const getDoc = (datax, label) => {
        let resdata = JSON.parse(datax);
        let photo = '';
        if (label === 'KTP') {
            let photoa = resdata[0].fileKtp.split('-');
            let photob = photoa[1].split('_');
            let id = photoa[0];
            let type = photob[0];
            let uida = photob[1].split('.');
            let uid = uida[0];
            photo = 'IMG/IDC/' + getGuardFrontData?.code + '/' + id + '/' + uid + '/' + resdata[0].fileKtp;
        } else if (label === 'Foto') {
            let photoa = resdata[0].filePhoto.split('-');
            let photob = photoa[1].split('_');
            let id = photoa[0];
            let type = photob[0];
            let uida = photob[1].split('.');
            let uid = uida[0];
            photo = 'IMG/AVA/' + getGuardFrontData?.code + '/' + id + '/' + uid + '/' + resdata[0].filePhoto;
        } else if (label === 'Lain-Lain') {
            let photoa = resdata[0].fileAnother.split('-');
            let photob = photoa[1].split('_');
            let id = photoa[0];
            let type = photob[0];
            let uida = photob[1].split('.');
            let uid = uida[0];
            photo = 'IMG/SID/' + getGuardFrontData?.code + '/' + id + '/' + uid + '/' + resdata[0].fileAnother;
        }
        let fileattach = 'https://01-tnos-storage.s3.ap-southeast-1.amazonaws.com/' + photo;
        setDocFile(fileattach)
        // console.log("------------------------------")
        // console.log(label);
        // console.log(photo);
        // console.log("------------------------------")
    };

    const handleChange = (event) => {
        if (event.target.files.length > 0) {
            setImage(event.target.files[0]);
            setPreview(URL.createObjectURL(event.target.files[0]));
            setShowBtn(true);
        }
    };

    const handleUpload = (partner_code) => {
        // Code to send image to server and save in folder here
        const formData = new FormData();
        const fileName = "guard-" + partner_code + ".jpg";
        const renamedImage = new File([image], fileName, { type: image.type });
        formData.append("mitracode", partner_code);
        formData.append("photo_file", renamedImage);

        fetch(`${process.env.REACT_APP_MITRA_TNOS_API_URL}/update-photo-mitra`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (JSON.parse(data).statusCode === "200") {
                    setInnerAlert({
                        color: "success",
                        message: "Foto berhasil diubah",
                    });
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch((error) => {
                setInnerAlert({
                    color: "danger",
                    message: "Something went wrong, please check your connection",
                });
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
                console.error(error);
            });
    };

    const [getBrevetQualificationPolri] = useState([
        {
            key: "kualifikasi_bravet_polri_1",
            value: "1",
            defaultValue: "Combat Diving",
        },
        {
            key: "kualifikasi_bravet_polri_2",
            value: "2",
            defaultValue: "Hirbak/Tembak Mahir",
        },
        {
            key: "kualifikasi_bravet_polri_3",
            value: "3",
            defaultValue: "Jump Master",
        },
        {
            key: "kualifikasi_bravet_polri_4",
            value: "4",
            defaultValue: "Kesiap Tempur",
        },
        { key: "kualifikasi_bravet_polri_5", value: "5", defaultValue: "Mobud" },
        {
            key: "kualifikasi_bravet_polri_6",
            value: "6",
            defaultValue: "Navigasi Darat",
        },
        { key: "kualifikasi_bravet_polri_7", value: "7", defaultValue: "Pelopor" },
        {
            key: "kualifikasi_bravet_polri_8",
            value: "8",
            defaultValue: "Perang Hutan",
        },
        { key: "kualifikasi_bravet_polri_9", value: "9", defaultValue: "PPH" },
        { key: "kualifikasi_bravet_polri_10", value: "10", defaultValue: "Rigger" },
        {
            key: "kualifikasi_bravet_polri_11",
            value: "11",
            defaultValue: "SAR Tempur",
        },
        {
            key: "kualifikasi_bravet_polri_12",
            value: "12",
            defaultValue: "Selam Rescue",
        },
        {
            key: "kualifikasi_bravet_polri_13",
            value: "13",
            defaultValue: "Terjun Bebas",
        },
        {
            key: "kualifikasi_bravet_polri_14",
            value: "14",
            defaultValue: "Wanteror",
        },
    ]);
    const [getSecurityEducationArr] = useState([
        { key: "pendidikan_satpam_0", value: null, defaultValue: "-" },
        { key: "pendidikan_satpam_1", value: "1", defaultValue: "Garda Utama" },
        { key: "pendidikan_satpam_2", value: "2", defaultValue: "Garda Madya" },
        { key: "pendidikan_satpam_3", value: "3", defaultValue: "Garda Pratama" },
    ]);
    const [getSelfDefense] = useState([
        { key: "bela_diri_0", value: null, defaultValue: "-" },
        { key: "bela_diri_1", value: "1", defaultValue: "Silat" },
        { key: "bela_diri_2", value: "2", defaultValue: "Tarung Drajat" },
        { key: "bela_diri_3", value: "3", defaultValue: "Kungfu" },
        { key: "bela_diri_4", value: "4", defaultValue: "Karate" },
        { key: "bela_diri_5", value: "5", defaultValue: "Yong Moo Do" },
        { key: "bela_diri_6", value: "6", defaultValue: "Taekwondo" },
        { key: "bela_diri_7", value: "7", defaultValue: "Kempo" },
        { key: "bela_diri_8", value: "8", defaultValue: "Jujitsu" },
        { key: "bela_diri_9", value: "9", defaultValue: "Mix Martial Art" },
        { key: "bela_diri_10", value: "10", defaultValue: "Judo" },
        { key: "bela_diri_11", value: "11", defaultValue: "Tinju" },
        { key: "bela_diri_12", value: "12", defaultValue: "Aikido" },
        { key: "bela_diri_13", value: "13", defaultValue: "Jujutsu" },
        { key: "bela_diri_14", value: "14", defaultValue: "Muaythai" },
    ]);
    const [getMartialArtsLevel] = useState([
        { key: "tingkatan_level_0", value: null, defaultValue: "-" },
        { key: "tingkatan_level_1", value: "1", defaultValue: "Setara Dan 1" },
        {
            key: "tingkatan_level_2",
            value: "2",
            defaultValue: "Setara Sabuk Hitam",
        },
        {
            key: "tingkatan_level_3",
            value: "3",
            defaultValue: "Setara Sabuk Coklat",
        },
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

    useEffect(() => {

        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
            method: "POST",
            body: JSON.stringify({ category: "1" }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((data) => {
                let datas = data.data.filter((item) => item.code === id)[0];
                setGuardFrontData(datas);
                setGuardData({
                    data: JSON.parse(datas.mmid_data)[0].data[0],
                    fileAnother: JSON.parse(datas.mmid_data)[0].fileAnother,
                    fileKtp: JSON.parse(datas.mmid_data)[0].fileKtp,
                    filePhoto: JSON.parse(datas.mmid_data)[0].filePhoto,
                });
            })

    }, [id])

    const handleClose = () => setShowDefault(false);

    const changeStatusPartner = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch(
            `${process.env.REACT_APP_MITRA_TNOS_API_URL}/verifikasi-mitra/${id}`,
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
                localStorage.setItem("guardFullname", getGuardFrontData?.fullname);
                window.location.href = "/partner/guard#actual_verification_tab";
            });
    };

    return (
        <Row>
            <Preloader show={!getGuardData ? true : false} />
            <Row className="mt-4"></Row>
            <Breadcrumb
                className="d-none d-md-inline-block"
                listProps={{
                    className: "breadcrumb-dark breadcrumb-transparent",
                }}
            >
                <Breadcrumb.Item href="/partner/guard">
                    Mitra Pengamanan
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Verifikasi Dokumen</Breadcrumb.Item>
            </Breadcrumb>
            <Col xs={12} xl={12}>
                <Card border="light" className="bg-white shadow-sm mb-4">
                    <Card.Body>
                        <Form method="POST" onSubmit={changeStatusPartner}>
                            <Row>
                                <Col md={4} className="mb-3">
                                    <Form.Group id="mitraPengamananDetail">
                                        <Form.Label>Mitra Pengamanan</Form.Label>
                                        <ul>
                                            {[
                                                ["Kode Mitra", "code"],
                                                ["Nama Lengkap", "fullname"],
                                            ].map(([label, key]) => (
                                                <li key={key}>
                                                    <b>{label} : </b>
                                                    {getGuardFrontData?.[key] === null
                                                        ? "-"
                                                        : getGuardFrontData?.[key]}
                                                </li>
                                            ))}
                                            <li>
                                                <b>Tanggal Mendaftar : </b>
                                                {getGuardFrontData?.mmit_date_insert === null
                                                    ? "-"
                                                    : ReadableDateTime(
                                                        getGuardFrontData?.mmit_date_insert
                                                    ).split(" ")[0]}
                                            </li>
                                            <li>
                                                <b>Jam Mendaftar : </b>
                                                {getGuardFrontData?.mmit_date_insert === null
                                                    ? "-"
                                                    : ReadableDateTime(
                                                        getGuardFrontData?.mmit_date_insert
                                                    ).split(" ")[1]}
                                            </li>
                                            <li>
                                                <b>Klasifikasi : </b>
                                                {getGuardFrontData?.levelname === null ? (
                                                    "-"
                                                ) : getGuardFrontData?.levelname === "A" ? (
                                                    <Badge bg="primary" className="ms-1">
                                                        Platinum
                                                    </Badge>
                                                ) : getGuardFrontData?.levelname === "B" ? (
                                                    <Badge bg="light" className="ms-1 text-dark">
                                                        Silver
                                                    </Badge>
                                                ) : getGuardFrontData?.levelname === "C" ? (
                                                    <Badge bg="light" className="ms-1 text-dark">
                                                        Silver
                                                    </Badge>
                                                ) : (
                                                    ""
                                                )}
                                            </li>
                                            <li>
                                                <b>Status : </b>
                                                <Badge
                                                    bg={
                                                        getGuardFrontData?.mmit_status === 0
                                                            ? "cyan"
                                                            : getGuardFrontData?.mmit_status === 1
                                                                ? "soft-green"
                                                                : getGuardFrontData?.mmit_status === 2
                                                                    ? "warning"
                                                                    : getGuardFrontData?.mmit_status === 3
                                                                        ? "secondary"
                                                                        : getGuardFrontData?.mmit_status === 4
                                                                            ? "primary"
                                                                            : getGuardFrontData?.mmit_status === 5
                                                                                ? "gray"
                                                                                : getGuardFrontData?.mmit_status === 6
                                                                                    ? "blue"
                                                                                    : getGuardFrontData?.mmit_status === 7
                                                                                        ? "pink"
                                                                                        : getGuardFrontData?.mmit_status === 9
                                                                                            ? "success"
                                                                                            : getGuardFrontData?.mmit_status === 10
                                                                                                ? "gray"
                                                                                                : ""
                                                    }
                                                >
                                                    {getGuardFrontData?.mmit_status === 0
                                                        ? "Menunggu Verifikasi"
                                                        : getGuardFrontData?.mmit_status === 1
                                                            ? "Lolos Verifikasi Dokumen"
                                                            : getGuardFrontData?.mmit_status === 2
                                                                ? "Tidak Lolos Verifikasi Dokumen"
                                                                : getGuardFrontData?.mmit_status === 3
                                                                    ? "Atur Jadwal Verifikasi Aktual"
                                                                    : getGuardFrontData?.mmit_status === 4
                                                                        ? "Menunggu Verifikasi Aktual"
                                                                        : getGuardFrontData?.mmit_status === 5
                                                                            ? "Jadwal Pembekalan"
                                                                            : getGuardFrontData?.mmit_status === 6
                                                                                ? "Tidak Lolos Verifikasi Aktual"
                                                                                : getGuardFrontData?.mmit_status === 7
                                                                                    ? "Pembekalan"
                                                                                    : getGuardFrontData?.mmit_status === 9
                                                                                        ? "Online"
                                                                                        : getGuardFrontData?.mmit_status === 10
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
                                                ["Nama Belakang", "last_name"],
                                                ["Tempat Lahir", "place_of_birth"],
                                            ].map(([label, key]) => (
                                                <li key={key}>
                                                    <b>{label} : </b>
                                                    {getGuardData?.data?.[key] === null
                                                        ? "-"
                                                        : getGuardData?.data?.[key]}
                                                </li>
                                            ))}
                                            <li>
                                                <b>Tanggal Lahir : </b>
                                                {getGuardData?.data.date_of_birth === null
                                                    ? "-"
                                                    : getGuardData?.data.date_of_birth}
                                            </li>
                                            {[
                                                ["No. HP Aktif", "phone_1"],
                                                ["Email", "email"],
                                            ].map(([label, key]) => (
                                                <li key={key}>
                                                    <b>{label} : </b>
                                                    {getGuardData?.data?.[key] === null
                                                        ? "-"
                                                        : getGuardData?.data?.[key]}
                                                </li>
                                            ))}
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="alamatSesuaiKtp">
                                        <Form.Label>Alamat Sesuai KTP</Form.Label>
                                        <ul>
                                            <li>
                                                <b>Alamat : </b>
                                                {getGuardData?.data.address_card === null
                                                    ? "-"
                                                    : getGuardData?.data.address_card}
                                            </li>
                                            <li>
                                                <b>Provinsi : </b>
                                                {getGuardData?.data.province === null
                                                    ? "-"
                                                    : getGuardData?.data.province}
                                            </li>
                                            <li>
                                                <b>Kabupaten / Kota : </b>
                                                {getGuardData?.data.district === null
                                                    ? "-"
                                                    : getGuardData?.data.district}
                                            </li>
                                            <li>
                                                <b>Kecamatan : </b>
                                                {getGuardData?.data.sub_district === null
                                                    ? "-"
                                                    : getGuardData?.data.sub_district}
                                            </li>
                                            <li>
                                                <b>Kelurahan / Desa : </b>
                                                {getGuardData?.data.village === null
                                                    ? "-"
                                                    : getGuardData?.data.village}
                                            </li>
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="alamatSaatIni">
                                        <Form.Label>Alamat Saat Ini</Form.Label>
                                        <ul>
                                            {getGuardData?.data.currdomisilicheck === "1" ? (
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
                                                        {!getGuardData?.data.current_address
                                                            ? "-"
                                                            : getGuardData?.data.current_address}
                                                    </li>
                                                    <li>
                                                        <b>Provinsi : </b>
                                                        {!getGuardData?.data.current_province
                                                            ? "-"
                                                            : getGuardData?.data.current_province}
                                                    </li>
                                                    <li>
                                                        <b>Kabupaten / Kota : </b>
                                                        {!getGuardData?.data.current_kabupaten
                                                            ? "-"
                                                            : getGuardData?.data.current_kabupaten}
                                                    </li>
                                                    <li>
                                                        <b>Kecamatan : </b>
                                                        {!getGuardData?.data.current_kecamatan
                                                            ? "-"
                                                            : getGuardData?.data.current_kecamatan}
                                                    </li>
                                                    <li>
                                                        <b>Kelurahan / Desa : </b>
                                                        {!getGuardData?.data.current_keldesa
                                                            ? "-"
                                                            : getGuardData?.data.current_keldesa}
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </Form.Group>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <Form.Group id="dataDiriLanjutan">
                                        <Form.Label>Data Diri</Form.Label>
                                        <ul>
                                            <li>
                                                <b>Jenis Kelamin : </b>
                                                {getGuardData?.data.gender === null
                                                    ? "-"
                                                    : getGenderArr?.map(
                                                        (item) =>
                                                            getGuardData?.data.gender === item.value &&
                                                            item.defaultValue
                                                    )}
                                            </li>
                                            <li>
                                                <b>Golongan Darah : </b>
                                                {getGuardData?.data.gol_darah === null
                                                    ? "-"
                                                    : getGuardData?.data.gol_darah}
                                            </li>
                                            <li>
                                                <b>Status Perkawinan : </b>
                                                {getGuardData?.data.status_kawin === null
                                                    ? "-"
                                                    : getMarriageStatusArr?.map(
                                                        (item) =>
                                                            getGuardData?.data.status_kawin ===
                                                            item.value && item.defaultValue
                                                    )}
                                            </li>
                                            <li>
                                                <b>Pendidikan Terakhir : </b>
                                                {getGuardData?.data.final_education === null
                                                    ? "-"
                                                    : getGuardData?.data.final_education}
                                            </li>
                                            <li>
                                                <b>Tipe SIM : </b>
                                                {getGuardData?.data.tipesim === null
                                                    ? "-"
                                                    : getSimCategoryArr?.map(
                                                        (item) =>
                                                            getGuardData?.data.tipesim === item.value &&
                                                            item.defaultValue
                                                    )}
                                            </li>
                                            <li>
                                                <b>Jenis SIM : </b>
                                                {getGuardData?.data.jenis_sim === null
                                                    ? "-"
                                                    : getGuardData?.data.jenis_sim}
                                            </li>
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="dataPekerjaan">
                                        <Form.Label>Data Pekerjaan</Form.Label>
                                        <ul>
                                            <li>
                                                <b>Pengalaman Security : </b>
                                                {getGuardData?.data.pengalaman_security === null
                                                    ? "-"
                                                    : getGuardData?.data.pengalaman_security + " Tahun"}
                                            </li>
                                            <li>
                                                <b>Latar Belakang : </b>
                                                {getGuardData?.data.current_job === null
                                                    ? "-"
                                                    : getCurrentJob?.map(
                                                        (item) =>
                                                            getGuardData?.data.current_job ===
                                                            item.value && item.defaultValue
                                                    )}
                                            </li>

                                            {getGuardData?.data.current_job === "1" ? (
                                                <>
                                                    <li>
                                                        <b>Pangkat Terakhir : </b>
                                                        {getGuardData?.data.pangkat_terakhir === null
                                                            ? "-"
                                                            : getLastRank?.map(
                                                                (item) =>
                                                                    getGuardData?.data.pangkat_terakhir ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Asal Korps : </b>
                                                        {getGuardData?.data.asal_korps === null
                                                            ? "-"
                                                            : getCorpsOrigin?.map(
                                                                (item) =>
                                                                    getGuardData?.data.asal_korps ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Kualifikasi / Brevet : </b>
                                                        {getGuardData?.data.kualifikasi_bravet === null
                                                            ? "-"
                                                            : getBrevetQualification?.map((item) =>
                                                                getGuardData?.data.kualifikasi_bravet.map(
                                                                    (subItem) =>
                                                                        subItem === item.value &&
                                                                        "[" + item.defaultValue + "] "
                                                                )
                                                            )}
                                                    </li>
                                                </>
                                            ) : getGuardData?.data.current_job === "2" ? (
                                                <>
                                                    <li>
                                                        <b>Pangkat Terakhir : </b>
                                                        {getGuardData?.data.pangkat_terakhir === null
                                                            ? "-"
                                                            : getLastRankPolri?.map(
                                                                (item) =>
                                                                    getGuardData?.data.pangkat_terakhir ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Asal Korps : </b>
                                                        {getGuardData?.data.asal_korps === null
                                                            ? "-"
                                                            : getCorpsOriginPolri?.map(
                                                                (item) =>
                                                                    getGuardData?.data.asal_korps ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Kualifikasi / Brevet : </b>
                                                        {getGuardData?.data.kualifikasi_bravet === null
                                                            ? "-"
                                                            : getBrevetQualificationPolri?.map((item) =>
                                                                getGuardData?.data.kualifikasi_bravet.map(
                                                                    (subItem) =>
                                                                        subItem === item.value &&
                                                                        "[" + item.defaultValue + "] "
                                                                )
                                                            )}
                                                    </li>
                                                </>
                                            ) : getGuardData?.data.current_job === "3" ? (
                                                <>
                                                    <li>
                                                        <b>Pendidikan Satpam : </b>
                                                        {getGuardData?.data.pendidikan_satpam === null
                                                            ? "-"
                                                            : getSecurityEducationArr?.map(
                                                                (item) =>
                                                                    getGuardData?.data.pendidikan_satpam ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Bela Diri : </b>
                                                        {getGuardData?.data.bela_diri === null
                                                            ? "-"
                                                            : getSelfDefense?.map(
                                                                (item) =>
                                                                    getGuardData?.data.bela_diri ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                    <li>
                                                        <b>Tingkatan / Level : </b>
                                                        {getGuardData?.data.tingkatan_level === null
                                                            ? "-"
                                                            : getMartialArtsLevel?.map(
                                                                (item) =>
                                                                    getGuardData?.data.tingkatan_level ===
                                                                    item.value && item.defaultValue
                                                            )}
                                                    </li>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="riwayatPekerjaanBidangKeamanan">
                                        <Form.Label>Riwayat Pekerjaan Bidang Keamanan</Form.Label>
                                        <ul>
                                            <li>
                                                <b>Tempat Bekerja : </b>
                                                {getGuardData?.data.tempat_bekerja === null
                                                    ? "-"
                                                    : getGuardData?.data.tempat_bekerja}
                                            </li>
                                            <li>
                                                <b>Tahun Bekerja : </b>
                                                {getGuardData?.data.mulai_tahun_bekerja === null
                                                    ? "-"
                                                    : getGuardData?.data.mulai_tahun_bekerja + " "}
                                                s/d
                                                {getGuardData?.data.akhir_tahun_bekerja === null
                                                    ? "-"
                                                    : " " + getGuardData?.data.akhir_tahun_bekerja}
                                            </li>
                                            <li>
                                                <b>Jabatan : </b>
                                                {getGuardData?.data.jabatan === null
                                                    ? "-"
                                                    : getGuardData?.data.jabatan}
                                            </li>
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="dataBank">
                                        <Form.Label>Data Bank</Form.Label>
                                        <ul>
                                            <li>
                                                <b>Nama Bank : </b>
                                                {getGuardData?.data.bank === null
                                                    ? "-"
                                                    : getBankProvider?.map(
                                                        (item) =>
                                                            getGuardData?.data.bank === item.value &&
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
                                                    {getGuardData?.data?.[key] === null
                                                        ? "-"
                                                        : getGuardData?.data?.[key]}
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
                                                ["Nama Depan", "nama_depan_kerabat"],
                                                ["Nama Belakang", "nama_belakang_pasangan"],
                                                ["Hubungan", "hubungan"],
                                                ["No. HP", "no_hp_kerabat"],
                                            ].map(([label, key]) => (
                                                <li key={key}>
                                                    <b>{label} : </b>
                                                    {getGuardData?.data?.[key] === null
                                                        ? "-"
                                                        : getGuardData?.data?.[key]}
                                                </li>
                                            ))}
                                        </ul>
                                    </Form.Group>
                                    <Form.Group id="dokumenMitraPengamanan">
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
                                                            setDocumentModalTitle(
                                                                `Dokumen (${label})`
                                                            );
                                                            setShowDefault(true);
                                                            setModalType("document");
                                                            getDoc(getGuardFrontData?.mmid_data, label)
                                                        }}
                                                    >
                                                        <u value={key}>
                                                            Lihat &nbsp;
                                                            <FontAwesomeIcon
                                                                icon={faExternalLinkAlt}
                                                            />
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
                                                {getModalType === "updateImage" ? (
                                                    <>
                                                        {showAlert && (
                                                            <Alert
                                                                variant={getInnerAlert.color}
                                                                onClose={() =>
                                                                    setShowAlert(false)
                                                                }
                                                                dismissible
                                                            >
                                                                {getInnerAlert.message}
                                                            </Alert>
                                                        )}
                                                        {preview ? (
                                                            <img src={preview} alt="Preview" />
                                                        ) : (
                                                            <img
                                                                src={getPhotoMitra(
                                                                    getGuardFrontData?.code,
                                                                    getGuardFrontData?.mmid_picture
                                                                )}
                                                                alt="Current"
                                                            />
                                                        )}
                                                        <InputGroup className="mt-2">
                                                            <Form.Control
                                                                type="file"
                                                                onChange={handleChange}
                                                            />
                                                            {showBtn && (
                                                                <InputGroup.Text
                                                                    className="bg-dark text-white"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() =>
                                                                        handleUpload(
                                                                            getGuardFrontData?.code
                                                                        )
                                                                    }
                                                                >
                                                                    Upload
                                                                </InputGroup.Text>
                                                            )}
                                                        </InputGroup>
                                                    </>
                                                ) : (
                                                    <img src={getDocFile} alt="" />
                                                )}
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
                                        id="guard_lulus_radio"
                                        htmlFor="guard_lulus"
                                    />

                                    <Form.Check
                                        inline
                                        type="radio"
                                        defaultValue="N"
                                        label="Tidak Sesuai"
                                        name="status"
                                        id="guard_gagal"
                                        htmlFor="guard_gagal"
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
    )
}