import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Button,
} from "@themesberg/react-bootstrap";
import { useParams } from "react-router-dom";
import Preloader from "../../components/Preloader";

export default () => {
  const { id } = useParams();

  const [getLawyerFrontData, setLawyerFrontData] = useState();
  const [getLawyerData, setLawyerData] = useState();
  const [getLawyerOfficeJoinedData, setLawyerOfficeJoinedData] = useState();

  const [getFinalLegalEducationArr] = useState([
    { key: "final_legal_education_1", value: "S1", defaultValue: "S1" },
    { key: "final_legal_education_2", value: "S2", defaultValue: "S2" },
    { key: "final_legal_education_3", value: "S3", defaultValue: "S3" },
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
  const [getLawyerOfficeJoinedArr] = useState([
    { key: "lawyer_office_joined_1", value: "N", defaultValue: "Tidak" },
    { key: "lawyer_office_joined_2", value: "Y", defaultValue: "Iya" },
  ]);
  const [getLawyerExperienceArr] = useState([
    { key: "lawyer_experience_0", value: null, defaultValue: "-" },
    { key: "lawyer_experience_1", value: "1", defaultValue: "1 Tahun" },
    { key: "lawyer_experience_2", value: "2", defaultValue: "2 Tahun" },
    { key: "lawyer_experience_3", value: "3", defaultValue: "3 Tahun" },
    { key: "lawyer_experience_4", value: "4", defaultValue: "4 Tahun" },
    { key: "lawyer_experience_5", value: "5", defaultValue: "5 Tahun" },
    { key: "lawyer_experience_6", value: "6", defaultValue: "Diatas 5 Tahun" },
  ]);
  const [getBloodTypeArr] = useState([
    { key: "gol_darah_1", value: "A", defaultValue: "A" },
    { key: "gol_darah_2", value: "B", defaultValue: "B" },
    { key: "gol_darah_3", value: "AB", defaultValue: "AB" },
    { key: "gol_darah_4", value: "O", defaultValue: "O" },
  ]);
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
    { key: "bank_42", value: "42", defaultValue: "PT. BANK MIZUHO INDONESIA" },
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
        setLawyerOfficeJoinedData(
          JSON.parse(datas.mmid_data)[0].data[0].gabung_kantor_pengacara
        );
      });
  }, [id]);

  const getDateFormatted = (prevDate) => {
    if (prevDate) {
      const date = prevDate.split("-");
      return date[2] + "-" + date[1] + "-" + date[0];
    }
  };

  const updateLawyerData = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      code: getLawyerFrontData.code,
      nokta: getLawyerFrontData.nokta,
      fullname: `${formData.get("first_name")} ${formData.get("last_name")}`,
      alamat: formData.get("address_card"),
      mobile: formData.get("phone_1"),
      mitracode: getLawyerFrontData.mitracode,
      mitraname: getLawyerFrontData.mitraname,
      levelcode: getLawyerFrontData.levelcode,
      levelname: getLawyerFrontData.levelname,
      servicecode: getLawyerFrontData.servicecode,
      servicename: getLawyerFrontData.servicename,
      email: formData.get("email"),
      mmit_suspend: getLawyerFrontData.mmit_suspend,
      mmit_status: getLawyerFrontData.mmit_status,
      mmit_date_insert: getLawyerFrontData.mmit_date_insert,
      mmid_data: {
        data: {
          nik: formData.get("nik"),
          npwp: formData.get("npwp"),
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          place_of_birth: formData.get("place_of_birth"),
          date_of_birth: getDateFormatted(formData.get("date_of_birth")),
          gender: formData.get("gender"),
          gol_darah: formData.get("gol_darah"),
          status_kawin: formData.get("status_kawin"),
          phone_1: formData.get("phone_1"),
          avphone_1: getLawyerData?.data.avphone_1,
          email: formData.get("email"),
          avemail: getLawyerData?.data.avemail,
          address_card: formData.get("address_card"),
          province: getLawyerData?.data.province,
          district: getLawyerData?.data.district,
          sub_district: getLawyerData?.data.sub_district,
          village: getLawyerData?.data.village,
          currdomisilicheck: formData.get("currdomisilicheck"),
          nama_asosiasi: formData.get("nama_asosiasi"),
          no_IndukAnggota: formData.get("no_IndukAnggota"),
          gabung_kantor_pengacara: formData.get("gabung_kantor_pengacara"),
          tahun_pelantikan_advokat: formData.get("tahun_pelantikan_advokat"),
          mention_kantor_pengacara: formData.get("mention_kantor_pengacara"),
          pengalaman_bekerja: formData.get("pengalaman_bekerja"),
          pendidikan_formal_hukum: formData.get("pendidikan_formal_hukum"),
          konsentrasi_hukum: formData.get("konsentrasi_hukum"),
          universitas: formData.get("universitas"),
          no_ijazah: formData.get("no_ijazah"),
          nama_kursus: formData.get("nama_kursus"),
          tahun_kursus: formData.get("tahun_kursus"),
          bank: formData.get("bank"),
          cabang: formData.get("cabang"),
          nomor_rekening: formData.get("nomor_rekening"),
          atas_nama: formData.get("atas_nama"),
          nama_depan_pasangan: formData.get("nama_depan_pasangan"),
          nama_belakang_pasangan: formData.get("nama_belakang_pasangan"),
          hubungan: formData.get("hubungan"),
          no_hp: formData.get("no_hp"),
        },
        fileKtp: getLawyerData?.fileKtp,
        filePhoto: getLawyerData?.filePhoto,
        fileAnother: getLawyerData?.fileAnother,
      },
      tglaktif: null,
    };

    fetch(`${process.env.REACT_APP_MITRA_TNOS_API_URL}/update-mitra-lawyer`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (JSON.parse(data).status === "success") {
          localStorage.setItem(
            "lawyerUpdateMessage",
            `Berhasil mengupdate data untuk ${formData.get(
              "first_name"
            )} ${formData.get("last_name")}`
          );
          window.location.href = "/partner/lawyer";
        } else {
          alert("Data gagal diupdate");
        }
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
          <Breadcrumb.Item active>Perbarui Data</Breadcrumb.Item>
        </Breadcrumb>

        <Form method="POST" onSubmit={updateLawyerData}>
          {/* Form 1 : Data Diri */}
          <Card
            border="light"
            className="bg-white shadow-sm mb-4"
            id="data-diri-form"
          >
            <Card.Body>
              <Row>
                <Col>
                  <h5 className="mb-4">Mitra Pengacara</h5>
                </Col>
                <Col>
                  <h6 className="mb-4 float-end text-gray">
                    Form 1 : Data Diri
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="nik">
                    <Form.Label>
                      NIK KTP <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="nik"
                      defaultValue={getLawyerData?.data.nik}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="npwp">
                    <Form.Label>NPWP</Form.Label>
                    <Form.Control
                      type="text"
                      name="npwp"
                      defaultValue={
                        getLawyerData?.data.npwp === null
                          ? "-"
                          : getLawyerData?.data.npwp
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="first_name">
                    <Form.Label>
                      Nama Depan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="first_name"
                      defaultValue={getLawyerData?.data.first_name}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="last_name">
                    <Form.Label>Nama Belakang & Gelar</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      defaultValue={
                        getLawyerData?.data.last_name === null
                          ? ""
                          : getLawyerData?.data.last_name
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="place_of_birth">
                    <Form.Label>
                      Tempat Lahir <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="place_of_birth"
                      defaultValue={getLawyerData?.data.place_of_birth}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="date_of_birth">
                    <Form.Label>
                      Tanggal Lahir <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      name="date_of_birth"
                      defaultValue={getDateFormatted(
                        getLawyerData?.data.date_of_birth
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="gender">
                    <Form.Label>
                      Jenis Kelamin <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="gender" required>
                      {getGenderArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.gender === item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="gol_darah">
                    <Form.Label>
                      Golongan Darah <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="gol_darah" required>
                      {getBloodTypeArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.gol_darah === item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="status_kawin">
                    <Form.Label>
                      Status Perkawinan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="status_kawin" required>
                      {getMarriageStatusArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.status_kawin === item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={2} className="mb-3">
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="email">
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="email"
                          name="email"
                          defaultValue={getLawyerData?.data.email}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group id="phone_1">
                        <Form.Label>
                          Nomer HP aktif <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="phone_1"
                          defaultValue={getLawyerData?.data.phone_1}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={6} className="mb-3">
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group id="address_card">
                        <Form.Label>
                          Alamat Sesuai KTP{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          as="textarea"
                          name="address_card"
                          rows={4}
                          defaultValue={getLawyerData?.data.address_card}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={4} className="mb-3">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group id="province">
                        <Form.Label>
                          Provinsi <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="province"
                          defaultValue={getLawyerData?.data.province}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="district">
                        <Form.Label>
                          Kabupaten / Kota{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="district"
                          defaultValue={getLawyerData?.data.district}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="sub_district">
                        <Form.Label>
                          Kecamatan <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="sub_district"
                          defaultValue={getLawyerData?.data.sub_district}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="village">
                        <Form.Label>
                          Kelurahan / Desa{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="village"
                          defaultValue={getLawyerData?.data.village}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={2} className="mb-3"></Col>
                {getLawyerData?.data.currdomisilicheck === "1" ? (
                  <>
                    <Col md={10}>
                      <Form.Check
                        inline
                        defaultChecked
                        type="checkbox"
                        defaultValue="1"
                        label="Berikan centang jika Alamat Tinggal saat ini sama dengan Alamat Sesuai KTP."
                        name="currdomisilicheck"
                        id="currdomisilicheck"
                      />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6} className="mb-3">
                      <Row>
                        <Col md={12} className="mb-3">
                          <Form.Group id="current_address">
                            <Form.Label>Alamat Saat Ini</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="current_address"
                              rows={5}
                              defaultValue={getLawyerData?.data.current_address}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group id="current_province_id">
                            <Form.Label>Provinsi</Form.Label>
                            <Form.Control
                              type="text"
                              name="current_province_id"
                              defaultValue={
                                getLawyerData?.data.current_province_id
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group id="current_district_id">
                            <Form.Label>Kabupaten / Kota</Form.Label>
                            <Form.Control
                              type="text"
                              name="current_district_id"
                              defaultValue={
                                getLawyerData?.data.current_district_id
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group id="current_kecamatan_id">
                            <Form.Label>Kecamatan</Form.Label>
                            <Form.Control
                              type="text"
                              name="current_kecamatan_id"
                              defaultValue={
                                getLawyerData?.data.current_kecamatan_id
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group id="current_keldesa_id">
                            <Form.Label>Kelurahan / Desa</Form.Label>
                            <Form.Control
                              type="text"
                              name="current_keldesa_id"
                              defaultValue={
                                getLawyerData?.data.current_keldesa_id
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>

          {/* Form 2 : Data Pekerjaan */}
          <Card
            border="light"
            className="bg-white shadow-sm mb-4"
            id="data-pekerjaan-form"
          >
            <Card.Body>
              <Row>
                <Col>{/* <h5 className="mb-4">Mitra Pengacara</h5> */}</Col>
                <Col>
                  <h6 className="mb-4 float-end text-gray">
                    Form 2 : Data Pekerjaan
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="nama_asosiasi">
                    <Form.Label>
                      Nama Asosiasi <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nama_asosiasi"
                      defaultValue={
                        getLawyerData?.data.nama_asosiasi === null
                          ? "-"
                          : getLawyerData?.data.nama_asosiasi
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group id="no_IndukAnggota">
                    <Form.Label>No. Induk Anggota</Form.Label>
                    <Form.Control
                      type="number"
                      name="no_IndukAnggota"
                      defaultValue={
                        getLawyerData?.data.no_IndukAnggota === null
                          ? "-"
                          : getLawyerData?.data.no_IndukAnggota
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Group id="tahun_pelantikan_advokat">
                    <Form.Label>
                      Tahun Pelantikan Advokat{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="tahun_pelantikan_advokat"
                      defaultValue={
                        getLawyerData?.data.tahun_pelantikan_advokat === null
                          ? "-"
                          : getLawyerData?.data.tahun_pelantikan_advokat
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="pengalaman_bekerja">
                    <Form.Label>Pengalaman Pengacara</Form.Label>
                    <Form.Select name="pengalaman_bekerja">
                      {getLawyerExperienceArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.pengalaman_bekerja ===
                            item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="gabung_kantor_pengacara">
                    <Form.Label>Tergabung di Kantor Pengacara</Form.Label>
                    <Form.Select name="gabung_kantor_pengacara" required>
                      {getLawyerOfficeJoinedArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.gabung_kantor_pengacara ===
                            item.value
                              ? true
                              : false
                          }
                          onClick={() => {
                            setLawyerOfficeJoinedData(item.value);
                          }}
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {getLawyerOfficeJoinedData === "Y" ? (
                  <Col className="mb-3">
                    <Form.Group id="mention_kantor_pengacara">
                      <Form.Label>Kantor Pengacara</Form.Label>
                      <Form.Control
                        type="text"
                        name="mention_kantor_pengacara"
                        defaultValue={
                          getLawyerData?.data.mention_kantor_pengacara === null
                            ? "-"
                            : getLawyerData?.data.mention_kantor_pengacara
                        }
                      />
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              <hr />
              <Row>
                <Col>
                  <small className="float-end text-gray">
                    Riwayat Pendidikan
                  </small>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="pendidikan_formal_hukum">
                    <Form.Label>
                      Pendidikan Formal Hukum Terakhir{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="pendidikan_formal_hukum" required>
                      {getFinalLegalEducationArr?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.pendidikan_formal_hukum ===
                            item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="konsentrasi_hukum">
                    <Form.Label>
                      Konsentrasi Hukum <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="konsentrasi_hukum" required>
                      {getLegalConcentration?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.konsentrasi_hukum === item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="universitas">
                    <Form.Label>
                      Universitas <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="universitas"
                      defaultValue={
                        getLawyerData?.data.universitas === null
                          ? "-"
                          : getLawyerData?.data.universitas
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="no_ijazah">
                    <Form.Label>
                      Tahun Ijazah <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="no_ijazah"
                      defaultValue={
                        getLawyerData?.data.no_ijazah === null
                          ? "-"
                          : getLawyerData?.data.no_ijazah
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <small className="float-end text-gray">
                    Kursus / Pelatihan / Sertifikasi yang Pernah Diikuti
                  </small>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="nama_kursus">
                    <Form.Label>
                      Nama Kursus / Pelatihan / Sertifikas
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nama_kursus"
                      defaultValue={
                        getLawyerData?.data.nama_kursus === null
                          ? "-"
                          : getLawyerData?.data.nama_kursus
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="tahun_kursus">
                    <Form.Label>Tahun</Form.Label>
                    <Form.Control
                      type="number"
                      name="tahun_kursus"
                      defaultValue={
                        getLawyerData?.data.tahun_kursus === null
                          ? "-"
                          : getLawyerData?.data.tahun_kursus
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Form 3 : Data Bank */}
          <Card
            border="light"
            className="bg-white shadow-sm mb-4"
            id="data-pekerjaan-form"
          >
            <Card.Body>
              <Row>
                <Col>{/* <h5 className="mb-4">Mitra Pengacara</h5> */}</Col>
                <Col>
                  <h6 className="mb-4 float-end text-gray">
                    Form 3 : Data Bank
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col md={5} className="mb-3">
                  <Form.Group id="bank">
                    <Form.Label>
                      Nama Bank <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="bank" required>
                      {getBankProvider?.map((item) => (
                        <option
                          key={item.key}
                          value={item.value}
                          selected={
                            getLawyerData?.data.bank === item.value
                              ? true
                              : false
                          }
                        >
                          {item.defaultValue}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Group id="cabang">
                    <Form.Label>Cabang</Form.Label>
                    <Form.Control
                      type="text"
                      name="cabang"
                      defaultValue={
                        getLawyerData?.data.cabang === null
                          ? "-"
                          : getLawyerData?.data.cabang
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-3">
                  <Form.Group id="nomor_rekening">
                    <Form.Label>
                      Nomor Rekening <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="nomor_rekening"
                      defaultValue={getLawyerData?.data.nomor_rekening}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="atas_nama">
                    <Form.Label>
                      Atas Nama <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="atas_nama"
                      defaultValue={getLawyerData?.data.atas_nama}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Form 4 : Orang Terdekat Tidak Serumah */}
          <Card
            border="light"
            className="bg-white shadow-sm mb-4"
            id="data-pekerjaan-form"
          >
            <Card.Body>
              <Row>
                <Col>{/* <h5 className="mb-4">Mitra Pengacara</h5> */}</Col>
                <Col>
                  <h6 className="mb-4 float-end text-gray">
                    Form 4 : Orang Terdekat Tidak Serumah
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Group id="nama_depan_pasangan">
                    <Form.Label>
                      Nama Depan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="nama_depan_pasangan"
                      defaultValue={getLawyerData?.data.nama_depan_pasangan}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="nama_belakang_pasangan">
                    <Form.Label>Nama Belakang</Form.Label>
                    <Form.Control
                      type="text"
                      name="nama_belakang_pasangan"
                      defaultValue={
                        getLawyerData?.data.nama_belakang_pasangan === null
                          ? "-"
                          : getLawyerData?.data.nama_belakang_pasangan
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="hubungan">
                    <Form.Label>
                      Hubungan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="hubungan"
                      defaultValue={getLawyerData?.data.hubungan}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="no_hp">
                    <Form.Label>
                      No. HP <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="no_hp"
                      defaultValue={getLawyerData?.data.no_hp}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Dokumen */}
          <Card
            border="light"
            className="bg-white shadow-sm mb-4"
            id="data-pekerjaan-form"
          >
            <Card.Body>
              <Row>
                <Col></Col>
                <Col>
                  <h6 className="mb-4 float-end text-gray">Dokumen</h6>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="fileKtp">
                    <Form.Label>
                      File KTP <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="fileKtp"
                      defaultValue={getLawyerData?.fileKtp}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="filePhoto">
                    <Form.Label>
                      File Photo <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="filePhoto"
                      defaultValue={getLawyerData?.filePhoto}
                    />
                  </Form.Group>
                </Col>
                <Col className="mb-3">
                  <Form.Group id="fileAnother">
                    <Form.Label>
                      File Lain <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="fileAnother"
                      defaultValue={getLawyerData?.fileAnother}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="bg-transparent p-0 border-0">
            <Card.Body>
              <Button variant="primary" type="submit" className="float-end m-0">
                Perbarui
              </Button>
            </Card.Body>
          </Card>
        </Form>
      </Row>
    </>
  );
};
