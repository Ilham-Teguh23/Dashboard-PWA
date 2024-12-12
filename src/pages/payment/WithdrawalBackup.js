import React, { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Card,
  Row,
  Button,
  Form,
  InputGroup,
  Badge,
  Modal,
  Alert,
} from "@themesberg/react-bootstrap";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { TnosDataTable } from "../../components/TnosDataTable";
import FlashMessage from "react-flash-message";

export default () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [getIsReload, setIsReload] = useState(true);
  const [getWithdrawalData, setWithdrawalData] = useState();
  const [getWithdrawalId, setWithdrawalId] = useState();
  const [getAllWithdrawalData, setAllWithdrawalData] = useState();
  const [getAllStatusWithdrawalData, setAllStatusWithdrawalData] = useState();
  const [getMessageEmptyData, setMessageEmptyData] = useState(
    "Belum ada data pada status ini"
  );
  const [getPendingData, setPendingData] = useState();
  const [getOnProgressData, setOnProgressData] = useState();
  const [getDoneData, setDoneData] = useState();
  const [getPartnerData, setPartnerData] = useState();
  const [getActiveStatus, setActiveStatus] = useState(0);
  const [getFlashMesage, setFlashMessage] = useState({
    status: false,
    message: "",
    color: "",
  });

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const withdrawalBank = (code) => {
    let bankCode = parseInt(code);
    let bank = "";

    if (bankCode === 1) {
      bank = "PT. BANK RAKYAT INDONESIA (PERSERO), Tbk -- BRI";
    } else if (bankCode === 2) {
      bank = "PT. BANK MANDIRI (PERSERO), Tbk";
    } else if (bankCode === 3) {
      bank = "PT. BANK NEGARA INDONESIA (PERSERO), Tbk -- BNI";
    } else if (bankCode === 4) {
      bank = "PT. BANK TABUNGAN NEGARA (PERSERO), Tbk -- BTN";
    } else if (bankCode === 5) {
      bank = "PT. BANK DANAMON INDONESIA, Tbk";
    } else if (bankCode === 6) {
      bank = "PT. BANK PERMATA, Tbk";
    } else if (bankCode === 7) {
      bank = "PT. BANK CENTRAL ASIA, Tbk -- BCA";
    } else if (bankCode === 8) {
      bank = "PT. BANK MAYBANK  INDONESIA, Tbk";
    } else if (bankCode === 9) {
      bank = "PT. PAN INDONESIA BANK, Tbk";
    } else if (bankCode === 10) {
      bank = "PT. BANK CIMB NIAGA, Tbk";
    } else if (bankCode === 11) {
      bank = "PT. BANK UOB INDONESIA";
    } else if (bankCode === 12) {
      bank = "PT. BANK OCBC NISP, Tbk";
    } else if (bankCode === 13) {
      bank = "PT. BANK ARTHA GRAHA INTERNASIONAL, Tbk";
    } else if (bankCode === 14) {
      bank = "PT. BANK BUMI ARTA, Tbk";
    } else if (bankCode === 15) {
      bank = "PT. BANK HSBC INDONESIA";
    } else if (bankCode === 16) {
      bank = "PT. BANK JTRUST INDONESIA, Tbk";
    } else if (bankCode === 17) {
      bank = "PT. BANK MAYAPADA INTERNATIONAL, Tbk";
    } else if (bankCode === 18) {
      bank = "PT. BANK OF INDIA INDONESIA, Tbk";
    } else if (bankCode === 19) {
      bank = "PT. BANK MUAMALAT INDONESIA, Tbk";
    } else if (bankCode === 20) {
      bank = "PT. BANK MESTIKA DHARMA, Tbk";
    } else if (bankCode === 21) {
      bank = "PT. BANK SHINHAN INDONESIA";
    } else if (bankCode === 22) {
      bank = "PT. BANK SINARMAS, Tbk";
    } else if (bankCode === 23) {
      bank = "PT. BANK MASPION INDONESIA, Tbk";
    } else if (bankCode === 24) {
      bank = "PT. BANK GANESHA, Tbk";
    } else if (bankCode === 25) {
      bank = "PT. BANK ICBC INDONESIA";
    } else if (bankCode === 26) {
      bank = "PT. BANK QNB INDONESIA, Tbk";
    } else if (bankCode === 27) {
      bank = "PT. BANK WOORI SAUDARA INDONESIA 1906, Tbk";
    } else if (bankCode === 28) {
      bank = "PT. BANK MEGA, Tbk";
    } else if (bankCode === 29) {
      bank = "PT. BANK BNI SYARIAH";
    } else if (bankCode === 30) {
      bank = "PT. BANK BUKOPIN, Tbk";
    } else if (bankCode === 31) {
      bank = "PT. BANK SYARIAH MANDIRI -- MANDIRI SYARIAH";
    } else if (bankCode === 32) {
      bank = "PT. BANK KEB HANA INDONESIA";
    } else if (bankCode === 33) {
      bank = "PT. BANK MNC INTERNASIONAL, Tbk";
    } else if (bankCode === 34) {
      bank = "PT. BANK RAKYAT INDONESIA AGRONIAGA, Tbk -- BRI AGRONIAGA";
    } else if (bankCode === 35) {
      bank = "PT. BANK SBI INDONESIA";
    } else if (bankCode === 36) {
      bank = "PT. BANK MEGA SYARIAH";
    } else if (bankCode === 37) {
      bank = "PT. BANK INDEX SELINDO";
    } else if (bankCode === 38) {
      bank = "PT. BANK MAYORA";
    } else if (bankCode === 39) {
      bank = "PT. BANK CHINA CONSTRUCTION BANK INDONESIA, Tbk";
    } else if (bankCode === 40) {
      bank = "PT. BANK DBS INDONESIA";
    } else if (bankCode === 41) {
      bank = "PT. BANK RESONA PERDANIA";
    } else if (bankCode === 41) {
      bank = "PT. BANK MIZUHO INDONESIA";
    } else if (bankCode === 43) {
      bank = "PT. BANK CAPITAL INDONESIA, Tbk";
    } else if (bankCode === 44) {
      bank = "PT. BANK BNP PARIBAS INDONESIA";
    } else if (bankCode === 45) {
      bank = "PT. BANK ANZ INDONESIA";
    } else if (bankCode === 46) {
      bank = "PT. BANK RABOBANK INTERNATIONAL INDONESIA";
    } else if (bankCode === 47) {
      bank = "PT. BANK IBK INDONESIA, Tbk";
    } else if (bankCode === 48) {
      bank = "PT. BANK NET INDONESIA SYARIAH";
    } else if (bankCode === 49) {
      bank = "PT. BANK CTBC INDONESIA";
    } else if (bankCode === 50) {
      bank = "PT. BANK COMMONWEALTH";
    } else if (bankCode === 51) {
      bank = "PT. BANK BTPN, Tbk";
    } else if (bankCode === 52) {
      bank = "PT. BANK VICTORIA SYARIAH";
    } else if (bankCode === 53) {
      bank = "PT. BANK BRI SYARIAH, Tbk";
    } else if (bankCode === 54) {
      bank = "PT. BANK JABAR BANTEN SYARIAH";
    } else if (bankCode === 55) {
      bank = "PT. BANK BISNIS INTERNASIONAL";
    } else if (bankCode === 56) {
      bank = "PT. BANK JASA JAKARTA";
    } else if (bankCode === 57) {
      bank = "PT. BANK YUDHA BHAKTI, Tbk";
    } else if (bankCode === 58) {
      bank = "PT. BANK MITRANIAGA, Tbk";
    } else if (bankCode === 59) {
      bank = "PT. BANK ROYAL INDONESIA";
    } else if (bankCode === 60) {
      bank = "PT. BANK NATIONAL NOBU, Tbk";
    } else if (bankCode === 61) {
      bank = "PT. BANK INA PERDANA, Tbk";
    } else if (bankCode === 62) {
      bank = "PT. BANK PANIN DUBAI SYARIAH, Tbk";
    } else if (bankCode === 63) {
      bank = "PT. PRIMA MASTER BANK";
    } else if (bankCode === 64) {
      bank = "PT. BANK SYARIAH BUKOPIN";
    } else if (bankCode === 65) {
      bank = "PT. BANK SAHABAT SAMPOERNA";
    } else if (bankCode === 66) {
      bank = "PT. BANK DINAR INDONESIA, Tbk";
    } else if (bankCode === 67) {
      bank = "PT. BANK AMAR INDONESIA";
    } else if (bankCode === 68) {
      bank = "PT. BANK KESEJAHTERAAN EKONOMI";
    } else if (bankCode === 69) {
      bank = "PT. BANK BCA SYARIAH";
    } else if (bankCode === 70) {
      bank = "PT. BANK ARTOS INDONESIA";
    } else if (bankCode === 71) {
      bank =
        "PT. BANK TABUNGAN PENSIUNAN NASIONAL SYARIAH, Tbk -- BTPN SYARIAH";
    } else if (bankCode === 72) {
      bank = "PT. BANK MULTIARTA SENTOSA";
    } else if (bankCode === 73) {
      bank = "PT. BANK FAMA INTERNASIONAL";
    } else if (bankCode === 74) {
      bank = "PT. BANK MANDIRI TASPEN";
    } else if (bankCode === 75) {
      bank = "PT. BANK VICTORIA INTERNATIONAL, Tbk";
    } else if (bankCode === 76) {
      bank = "PT. BANK HARDA INTERNASIONAL";
    } else if (bankCode === 77) {
      bank = "PT. BPD JAWA BARAT DAN BANTEN, Tbk";
    } else if (bankCode === 78) {
      bank = "PT. BPD DKI";
    } else if (bankCode === 79) {
      bank = "PT. BPD DAERAH ISTIMEWA YOGYAKARTA";
    } else if (bankCode === 80) {
      bank = "PT. BPD JAWA TENGAH";
    } else if (bankCode === 81) {
      bank = "PT. BPD JAWA TIMUR, Tbk";
    } else if (bankCode === 82) {
      bank = "PT. BPD JAMBI";
    } else if (bankCode === 83) {
      bank = "PT. BANK ACEH SYARIAH";
    } else if (bankCode === 84) {
      bank = "PT. BPD SUMATERA UTARA";
    } else if (bankCode === 85) {
      bank = "PT. BPD SUMATERA BARAT";
    } else if (bankCode === 86) {
      bank = "PT. BPD RIAU KEPRI";
    } else if (bankCode === 87) {
      bank = "PT. BPD SUMATERA SELATAN DAN BANGKA BELITUNG";
    } else if (bankCode === 88) {
      bank = "PT. BPD LAMPUNG";
    } else if (bankCode === 89) {
      bank = "PT. BPD KALIMANTAN SELATAN";
    } else if (bankCode === 90) {
      bank = "PT. BPD KALIMANTAN BARAT";
    } else if (bankCode === 91) {
      bank = "PT. BPD KALIMANTAN TIMUR DAN KALIMANTAN UTARA";
    } else if (bankCode === 92) {
      bank = "PT. BPD KALIMANTAN TENGAH";
    } else if (bankCode === 93) {
      bank = "PT. BPD SULAWESI SELATAN DAN SULAWESI BARAT";
    } else if (bankCode === 94) {
      bank = "PT. BPD SULAWESI UTARA DAN  GORONTALO";
    } else if (bankCode === 95) {
      bank = "PT. BANK NTB SYARIAH";
    } else if (bankCode === 96) {
      bank = "PT. BPD BALI";
    } else if (bankCode === 97) {
      bank = "PT. BPD NUSA TENGGARA TIMUR";
    } else if (bankCode === 98) {
      bank = "PT. BPD MALUKU DAN MALUKU UTARA";
    } else if (bankCode === 99) {
      bank = "PT. BPD PAPUA";
    } else if (bankCode === 100) {
      bank = "PT. BPD BENGKULU";
    } else if (bankCode === 101) {
      bank = "PT. BPD SULAWESI TENGAH";
    } else if (bankCode === 102) {
      bank = "PT. BPD SULAWESI TENGGARA";
    } else if (bankCode === 103) {
      bank = "PT. BPD BANTEN, Tbk";
    } else if (bankCode === 104) {
      bank = "CITIBANK, N.A.";
    } else if (bankCode === 105) {
      bank = "JP MORGAN CHASE BANK, NA";
    } else if (bankCode === 106) {
      bank = "BANK OF AMERICA, N.A";
    } else if (bankCode === 107) {
      bank = "BANGKOK BANK PCL";
    } else if (bankCode === 108) {
      bank = "MUFG BANK, LTD";
    } else if (bankCode === 109) {
      bank = "STANDARD CHARTERED BANK";
    } else if (bankCode === 110) {
      bank = "DEUTSCHE BANK AG";
    } else if (bankCode === 111) {
      bank = "BANK OF CHINA (HONG KONG) LIMITED";
    } else if (bankCode === 112) {
      bank = "PT. BANK NUSANTARA PARAHYANGAN Tbk *)";
    } else if (bankCode === 113) {
      bank = "PT. BANK OKE INDONESIA **)";
    } else if (bankCode === 114) {
      bank = "BANK Anda";
    } else if (bankCode === 115) {
      bank = "BANK Andara";
    } else if (bankCode === 116) {
      bank = "BANK BPD Aceh";
    } else if (bankCode === 117) {
      bank = "BANK BRI Agroniaga";
    } else if (bankCode === 118) {
      bank = "BANK BTN Syariah";
    } else if (bankCode === 119) {
      bank = "BANK Danamon Syariah";
    } else if (bankCode === 120) {
      bank = "BANK DKI Syariah";
    } else if (bankCode === 121) {
      bank = "BANK Ekonomi Raharja";
    } else if (bankCode === 122) {
      bank = "BANK Kalbar Syariah";
    } else if (bankCode === 123) {
      bank = "BANK Kalsel Syariah";
    } else if (bankCode === 124) {
      bank = "BANK Kaltim Syariah";
    } else if (bankCode === 125) {
      bank = "BANK Nagari";
    } else if (bankCode === 126) {
      bank = "BANK Nagari Syariah";
    } else if (bankCode === 127) {
      bank = "BANK NTB";
    } else if (bankCode === 128) {
      bank = "BANK Permata Syariah";
    } else if (bankCode === 129) {
      bank = "BANK Pundi Indonesia";
    } else if (bankCode === 130) {
      bank = "BANK Riau Kepri Syariah";
    } else if (bankCode === 131) {
      bank = "BANK Sumitomo Mitsui Indonesia";
    } else if (bankCode === 132) {
      bank = "BANK Sumsel Babel Syariah";
    } else if (bankCode === 133) {
      bank = "BANK Sumut Syariah";
    } else if (bankCode === 134) {
      bank = "BANK Windu Kentjana International";
    } else if (bankCode === 135) {
      bank = "BII Syariah";
    } else if (bankCode === 136) {
      bank = "CIMB Niaga Syariah";
    } else if (bankCode === 137) {
      bank = "OCBC NISP Syariah";
    } else if (bankCode === 138) {
      bank = "Panin Bank Syariah";
    } else if (bankCode === 139) {
      bank = "The Bank of Tokyo-Mitsubishi UFJ";
    }

    return bank;
  };

  const onDoneSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/withdraw/complete`, {
      method: "POST",
      body: JSON.stringify({
        id: getWithdrawalId.toString(),
        noref: formData.get("reference_num"),
        bank: formData.get("reference_bank"),
        note: formData.get("reference_note"),
        adminid: localStorage.getItem("user_id"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFlashMessage({
            status: true,
            message: `Berhasil mengubah status penarikan dengan id ${getWithdrawalId} dari Proses ke Selesai`,
            color: "success",
          });
          localStorage.setItem("activeWithdrawStatus", 2);
          window.location.reload();
        } else {
          setFlashMessage({
            status: true,
            message: `Gagal mengubah status`,
            color: "danger",
          });
        }
      });
  };

  const updateStatus = (id) => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/payment/withdraw/proses`, {
      method: "POST",
      body: JSON.stringify({
        id: id.toString(),
        adminid: localStorage.getItem("user_id"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFlashMessage({
            status: true,
            message: `Berhasil mengubah status penarikan dengan id ${id} dari Menunggu ke Proses`,
            color: "success",
          });
          localStorage.setItem("activeWithdrawStatus", 1);
          window.location.reload();
        } else {
          setFlashMessage({
            status: true,
            message: `Gagal mengubah status`,
            color: "danger",
          });
        }
      });
  };

  const TableRow = (props) => {
    const {
      id,
      tarik_dana,
      bank_name,
      bank_norek,
      atasnama,
      tgl_pengajuan,
      jam_pengajuan,
      saldo_terakhir,
      status,
      create_by,
    } = props;

    return (
      <tr>
        <td>{props.num}</td>
        <td>{id}</td>
        <td>{"IDR " + parseInt(saldo_terakhir).toLocaleString("id-ID", {})}</td>
        <td>{"IDR " + parseInt(tarik_dana).toLocaleString("id-ID", {})}</td>
        <td>{withdrawalBank(bank_name)}</td>
        <td>{bank_norek}</td>
        <td>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              let clickedPartner = getPartnerData.filter(
                (item) => item.code === create_by
              );

              window.open(
                `/partner/${
                  clickedPartner[0].type === "Guard" ? "guard" : "lawyer"
                }/profile/${create_by}`,
                "_blank"
              );
            }}
          >
            {atasnama}
          </span>
        </td>
        <td>{getWithdrawDateTime(tgl_pengajuan, jam_pengajuan, false)}</td>
        <td>
          <Badge
            bg={
              status === 0
                ? "danger"
                : status === 1
                ? "warning"
                : status === 2
                ? "success"
                : ""
            }
            className="badge-lg"
          >
            {status === 0
              ? "Menunggu"
              : status === 1
              ? "Sedang Diproses"
              : status === 2
              ? "Selesai"
              : ""}
          </Badge>
        </td>
        {getActiveStatus !== 2 && (
          <td>
            <Badge
              bg={status === 0 ? "warning" : status === 1 ? "primary" : ""}
              className="badge-lg"
              style={{ cursor: "pointer" }}
            >
              {status === 0 ? (
                <span onClick={() => updateStatus(id)}>Proses</span>
              ) : status === 1 ? (
                <>
                  <span
                    onClick={() => {
                      setShow(true);
                      setWithdrawalId(id);
                    }}
                  >
                    Masukkan No. Referensi
                  </span>
                  <Modal show={show} onHide={handleClose} centered size="sm">
                    <Modal.Body>
                      <Form onSubmit={onDoneSubmit} method="POST">
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Bank <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="reference_bank"
                            placeholder="cth : BCA"
                            autoFocus
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            No. Referensi <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="reference_num"
                            placeholder="cth : 2346278"
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Catatan</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows="6"
                            name="reference_note"
                          />
                        </Form.Group>
                        <Row>
                          <Col>
                            {" "}
                            <Button
                              variant="secondary"
                              onClick={handleClose}
                              className="btn btn-sm w-100"
                            >
                              Tutup
                            </Button>
                          </Col>
                          <Col>
                            {" "}
                            <Button
                              type="submit"
                              variant="primary"
                              className="btn btn-sm w-100"
                            >
                              Kirim
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                ""
              )}
            </Badge>
          </td>
        )}
      </tr>
    );
  };

  const getWithdrawDateTime = (tglPengajuanBefore, jamPengajuan, split) => {
    let tglPengajuan = split
      ? tglPengajuanBefore.split("-").reverse()
      : tglPengajuanBefore;
    return jamPengajuan + " " + tglPengajuan;
  };

  const getTnosDateConvert = (date) => {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let yyyy = date.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const getDateBefore = (date) => {
    let today = new Date();
    today.setMonth(today.getMonth() - date);
    return getTnosDateConvert(today);
  };

  const getTodayDate = () => {
    let today = new Date();
    return getTnosDateConvert(today);
  };

  const getDataBetweenDate = (datas, startDate, endDate) => {
    return JSON.parse(datas).filter(
      (item) =>
        new Date(
          getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
        ).getTime() >= new Date(startDate).getTime() &&
        new Date(
          getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
        ).getTime() <= new Date(endDate).getTime()
    );
  };

  useEffect(() => {
    localStorage.setItem(
      "getStartDateWithdrawal",
      getDateBefore(1) + " 00:00:00"
    );
    localStorage.setItem("getEndDateWithdrawal", getTodayDate() + " 23:59:59");
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/withdraw/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let datas = data.data;
        setAllStatusWithdrawalData(datas);
        setAllWithdrawalData(datas);

        const monthTransaction = getDataBetweenDate(
          JSON.stringify(datas),
          getDateBefore(1) + "T00:00:00",
          getTodayDate() + "T23:59:59"
        );
        monthTransaction.sort(
          (a, b) =>
            new Date(
              getWithdrawDateTime(b.tgl_pengajuan, b.jam_pengajuan, true)
            ) -
            new Date(
              getWithdrawDateTime(a.tgl_pengajuan, a.jam_pengajuan, true)
            )
        );

        setWithdrawalData(monthTransaction.filter((item) => item.status === 0));
        setPendingData(monthTransaction.filter((item) => item.status === 0));
        setOnProgressData(monthTransaction.filter((item) => item.status === 1));
        setDoneData(monthTransaction.filter((item) => item.status === 2));
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
      method: "POST",
      body: JSON.stringify({ category: "1" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((guardData) => {
        fetch(`${process.env.REACT_APP_PORTAL_API_URL}/mitra/list`, {
          method: "POST",
          body: JSON.stringify({ category: "2" }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((lawyerData) => {
            let partnerData = [];
            [guardData, lawyerData].forEach((item) => {
              item.data.map((itemData) =>
                partnerData.push({
                  type: itemData.mitraname,
                  code: itemData.code,
                })
              );
            });
            setPartnerData(partnerData);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const getMitraDetailUrl = (datas, code) => {
  //   let clickedPartner = datas.filter((item) => item.code === code);

  //   return `/partner/${
  //     clickedPartner[0].type === "Guard" ? "guard" : "lawyer"
  //   }/profile/${code}`;
  // };

  const updateWithdrawalDate = (e) => {
    e.preventDefault();

    setActiveStatus(0);
    setIsReload(false);
    const formData = new FormData(e.target);
    const splitDate = (date) => {
      let str = date.split("");
      str[10] = " ";
      str = str.join("");
      return str;
    };
    localStorage.setItem(
      "getStartDateWithdrawal",
      splitDate(formData.get("start_date_time"))
    );
    localStorage.setItem(
      "getEndDateWithdrawal",
      splitDate(formData.get("end_date_time"))
    );
    let getUpdatedWithdrawalData = getDataBetweenDate(
      JSON.stringify(
        getAllWithdrawalData.sort(
          (a, b) => new Date(b.transaction_time) - new Date(a.transaction_time)
        )
      ),
      formData.get("start_date_time"),
      formData.get("end_date_time")
    );
    setWithdrawalData(getUpdatedWithdrawalData);
    setAllStatusWithdrawalData(getUpdatedWithdrawalData);
    setPendingData(
      getUpdatedWithdrawalData.filter((item) => item.status === 0)
    );
    setOnProgressData(
      getUpdatedWithdrawalData.filter((item) => item.status === 1)
    );
    setDoneData(getUpdatedWithdrawalData.filter((item) => item.status === 2));
    let totalAmountBetween = 0;
    getAllWithdrawalData
      .filter(
        (item) =>
          new Date(
            getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
          ).getTime() >= new Date(formData.get("start_date_time")).getTime() &&
          new Date(
            getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
          ).getTime() <= new Date(formData.get("end_date_time")).getTime()
      )
      .forEach((item) => {
        totalAmountBetween = totalAmountBetween + parseInt(item.tarik_dana);
      });
    getAllWithdrawalData.filter(
      (item) =>
        new Date(
          getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
        ).getTime() >= new Date(formData.get("start_date_time")).getTime() &&
        new Date(
          getWithdrawDateTime(item.tgl_pengajuan, item.jam_pengajuan, true)
        ).getTime() <= new Date(formData.get("end_date_time")).getTime()
    ).length === 0 &&
      setMessageEmptyData("Tidak ada penarikan diantara tanggal ini");
  };
  return (
    <>
      <Col xl={12} className="mt-2">
        <Card border="light">
          <Card.Body>
            <Form method="POST" onSubmit={updateWithdrawalDate}>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Label>Waktu Pengajuan</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="datetime-local"
                      name="start_date_time"
                      step="1"
                      defaultValue={getDateBefore(1) + "T00:00:00"}
                      required
                    />
                    <InputGroup.Text>&#x2192;</InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      name="end_date_time"
                      step="1"
                      defaultValue={getTodayDate() + "T23:59:59"}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <Form.Label>&nbsp;</Form.Label>
                  <Form.Control
                    className="btn btn-primary"
                    type="submit"
                    name="btn_search_withdrawal"
                    value="Cari Pengajuan"
                  />
                </Col>
              </Row>
            </Form>
            <TnosDataTable
              alert={
                getFlashMesage?.status === true && (
                  <FlashMessage duration={3000} persistOnHover={true}>
                    <Alert variant={getFlashMesage.color}>
                      <div className="d-flex justify-content-between">
                        <div>{getFlashMesage.message}</div>
                      </div>
                    </Alert>
                  </FlashMessage>
                )
              }
              title={[
                {
                  variant: "blue",
                  status: "Semua Status",
                  value: 3,
                  length: getAllStatusWithdrawalData?.length,
                },
                {
                  variant: "danger",
                  status: "Menunggu",
                  value: 0,
                  length: getPendingData?.length,
                },
                {
                  variant: "warning",
                  status: "Sedang Diproses",
                  value: 1,
                  length: getOnProgressData?.length,
                },
                {
                  variant: "success",
                  status: "Selesai",
                  value: 2,
                  length: getDoneData?.length,
                },
              ].map((item) => {
                return (
                  <Button
                    variant={item.variant}
                    className="btn btn-sm me-2 mb-2 text-white"
                    style={
                      getActiveStatus === item.value
                        ? {
                            boxShadow: "0px 5px 5px #888888",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                    onClick={() => {
                      setActiveStatus(item.value);
                      localStorage.setItem("activeWithdrawStatus", item.value);
                      setWithdrawalData(
                        item.value === 0
                          ? getPendingData
                          : item.value === 1
                          ? getOnProgressData
                          : item.value === 2
                          ? getDoneData
                          : getAllStatusWithdrawalData
                      );
                      setMessageEmptyData("Belum ada data pada status ini");
                    }}
                  >
                    {item.status} &nbsp;
                    <Badge bg="dark">{item.length}</Badge>
                  </Button>
                );
              })}
              subtitle={
                getIsReload &&
                "Menampilkan data dari satu bulan yang lalu sampai hari ini"
              }
              data={
                <>
                  <thead className="thead-light">
                    <tr>
                      <th className="border-0">No.</th>
                      <th className="border-0">Id</th>
                      <th className="border-0">Saldo</th>
                      <th className="border-0">Jumlah Penarikan</th>
                      <th className="border-0">Bank</th>
                      <th className="border-0">No. Rekening</th>
                      <th className="border-0">Atas Nama</th>
                      <th className="border-0">Waktu Pengajuan</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">
                        <ExcelFile
                          element={
                            <Badge
                              bg="primary"
                              className="badge-lg"
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon icon={faFileExcel} /> Export
                              Excel
                            </Badge>
                          }
                          filename={`withdrawal_${
                            getActiveStatus === 0
                              ? "waiting"
                              : getActiveStatus === 1
                              ? "on_progress"
                              : getActiveStatus === 2
                              ? "done"
                              : "all"
                          }_( ${localStorage.getItem(
                            "getStartDateWithdrawal"
                          )} - ${localStorage.getItem(
                            "getEndDateWithdrawal"
                          )} )`}
                        >
                          <ExcelSheet
                            data={getWithdrawalData}
                            name="Data Penarikan"
                          >
                            <ExcelColumn label="Atas Nama" value="atasnama" />
                            <ExcelColumn
                              label="Saldo"
                              value={(col) =>
                                "IDR " +
                                parseInt(col.saldo_terakhir).toLocaleString(
                                  "id-ID",
                                  {}
                                )
                              }
                            />
                            <ExcelColumn
                              label="Jumlah Penarikan"
                              value={(col) =>
                                "IDR " +
                                parseInt(col.tarik_dana).toLocaleString(
                                  "id-ID",
                                  {}
                                )
                              }
                            />
                            <ExcelColumn
                              label="Bank"
                              value={(col) => withdrawalBank(col.bank_name)}
                            />
                            <ExcelColumn
                              label="No. Rekening"
                              value="bank_norek"
                            />
                            <ExcelColumn
                              label="Waktu Pengajuan"
                              value={(col) =>
                                getWithdrawDateTime(
                                  col.tgl_pengajuan,
                                  col.jam_pengajuan,
                                  false
                                )
                              }
                            />
                            <ExcelColumn
                              label="Status"
                              value={(col) =>
                                col.status === 0
                                  ? "Menunggu"
                                  : col.status === 1
                                  ? "Sedang Diproses"
                                  : col.status === 2
                                  ? "Selesai"
                                  : ""
                              }
                            />
                          </ExcelSheet>
                          {/* If you want to add sheet just copy ExcelSheet */}
                        </ExcelFile>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getWithdrawalData?.length > 0 ? (
                      getWithdrawalData?.map((pw, index) => (
                        <TableRow
                          key={`payment-withdraw-${pw.id}`}
                          {...pw}
                          num={index + 1}
                        />
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colspan={9}>{getMessageEmptyData}</td>
                      </tr>
                    )}
                  </tbody>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
