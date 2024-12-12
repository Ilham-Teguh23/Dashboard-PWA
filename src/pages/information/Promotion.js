import { Card, Form } from "@themesberg/react-bootstrap";
import axios from "axios";
import moment from "moment";
import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import guard from "../../assets/img/technologies/tnos_guard_logo_mobile.png";
import lawyer from "../../assets/img/technologies/tnos_lawyer_logo_mobile.png";

function Promotion() {
  const [id_layanan, setId_layanan] = useState("");
  const [id_sub_layanan, setId_sub_layanan] = useState("");
  const [title, setTitle] = useState("");
  const [promo_code, setPromo_code] = useState("");
  const [limit, setLimit] = useState("");
  const [reuse_limit, setReuse_limit] = useState("");
  const [start_date, setStart_date] = useState("");
  const [start_time, setStart_time] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [type_potongan, setType_potongan] = useState("");
  const [potongan, setPotongan] = useState(0);
  const [action, setAction] = useState("");
  const [desc, setDesc] = useState("");
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [dataMitra, setDataMitra] = useState([]);
  const [search, setSearch] = useState("");
  const min = 1;
  const max = 100;

  useEffect(() => {
    getDataMitra();
    setIsCheckAll(false);
    if (isCheck) {
      setIsCheck([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_layanan]);

  const getDataMitra = async () => {
    try {
      const data = {
        category: id_layanan,
      };
      await axios
        .post(`https://dev-portal-api.tnos.world/mitra/list`, data)
        .then((res) => {
          setDataMitra(res.data.data);
        })
        .catch((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(
      dataMitra.map((row) => {
        if (row.code) {
          return row.code;
        } else {
          return row.mmbr_code;
        }
      })
    );

    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  const layanan = [
    {
      id: 1,
      title: "Pengamanan",
    },
    {
      id: 2,
      title: "Pengacara",
    },
  ];

  const sub_layanan = [
    {
      id_layanan: 1,
      id: 1,
      title: "Pengamanan Peorang",
    },
    {
      id_layanan: 1,
      id: 2,
      title: "Pengamanan Usaha & Bisnis",
    },

    {
      id_layanan: 2,
      id: 1,
      title: "Konsultasi Hukum",
    },
    {
      id_layanan: 2,
      id: 2,
      title: "Pendampingan Hukum",
    },
  ];

  const onSubmitReffCode = () => {
    const data = {
      id_layanan: id_layanan,
      id_sub_layanan: id_sub_layanan,
      title: title,
      promo_code: promo_code,
      limit: limit,
      reuse_limit,
      start_date: start_date,
      start_time: start_time,
      end_date: end_date,
      end_time: end_time,
      type_potongan: type_potongan,
      potongan: potongan,
      action: action,
      desc: desc,
      mitra_available: isCheck,
      posisi: null,
      satuan: null,
      nilai: null,
      syarat_ketentuan: null,
      status: "Y",
      updated_by: localStorage.getItem("user_id"),
      updated_at: null,
      created_by: localStorage.getItem("user_id"),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    console.log(data);
  };

  const handleChangeMax = (event) => {
    let value = 0;
    if (parseInt(type_potongan) !== 1) {
      value = Math.max(min, Math.min(max, Number(event.target.value)));
    } else {
      value = event.target.value;
    }
    setPotongan(value);
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  let icon = "";
  if (id_layanan === "0") {
    icon =
      "https://demo.themesberg.com/volt-react-dashboard/static/media/profile-picture-1.4d26e151.jpg";
  } else if (id_layanan === "1") {
    icon = guard;
  } else if (id_layanan === "2") {
    icon = lawyer;
  } else {
    icon =
      "https://demo.themesberg.com/volt-react-dashboard/static/media/profile-picture-1.4d26e151.jpg";
  }
  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-12 col-xl-4">
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body
              style={{
                overflowX: "auto",
                height: "695px",
                marginBottom: "20px",
              }}
            >
              <h5 className="mb-4">Daftar Mitra</h5>
              <div className="form-group mb-3">
                <label htmlFor="search">Cari Mitra</label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="list-group-flush list my--3 list-group">
                <div className="px-0 list-group-item ">
                  <div className="align-items-center row">
                    <div className="ms--2 col text-right">
                      <h4 className="h6 mb-0">
                        <div className="">Pilih Semua</div>
                      </h4>
                    </div>
                    <div className="col-auto col">
                      <Form.Check
                        name="selectAll"
                        id="selectAll"
                        onChange={handleSelectAll}
                        checked={isCheckAll}
                      />
                    </div>
                  </div>
                </div>
                {dataMitra?.length > 0 ? (
                  dataMitra
                    .filter((row) =>
                      search
                        ? row.fullname
                            .toLowerCase()
                            .includes(search ? search.toLowerCase() : search)
                        : row.fullname
                    )
                    ?.map((row, key) => {
                      return (
                        <div className="px-0 list-group-item" key={key}>
                          <div className="align-items-center row">
                            <div className="col-auto col">
                              <div className="user-avatar">
                                <img
                                  src={icon}
                                  alt=""
                                  className="rounded circle"
                                />
                              </div>
                            </div>
                            <div className="ms--2 col">
                              <h4 className="h6 mb-0">
                                <div>
                                  {row.fullname ? row.fullname : row.mmbr_name}
                                </div>
                              </h4>
                              <span className="text-success">● </span>
                              <small>Online</small>
                            </div>
                            <div className="col-auto col">
                              <Form.Check
                                label=""
                                name={row.email ? row.email : row.mmbr_email}
                                id={row.code ? row.code : row.mmbr_code}
                                onChange={handleClick}
                                checked={isCheck.includes(
                                  row.code ? row.code : row.mmbr_code
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="px-0 list-group-item">
                    <div className="align-items-center row">
                      <div className="col-auto col">
                        <div className="user-avatar">
                          <img
                            src="https://demo.themesberg.com/volt-react-dashboard/static/media/profile-picture-1.4d26e151.jpg"
                            alt=""
                            className="rounded circle"
                          />
                        </div>
                      </div>
                      <div className="ms--2 col">
                        <h4 className="h6 mb-0">
                          <div>kosong</div>
                        </h4>
                        <span className="text-success">● </span>
                        <small>Online</small>
                      </div>
                      <div className="col-auto col">
                        <Form.Check
                          label=""
                          id="checkbox1"
                          htmlFor="checkbox1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-12 col-xl-8">
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Refferal Kode</h5>
              <div className="row">
                <div className="col-6">
                  <div className="form-group mb-4">
                    <label htmlFor="title">Judul Voucher</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group mb-4">
                    <label htmlFor="promo_code">Promo Kode</label>
                    <input
                      type="text"
                      id="promo_code"
                      name="promo_code"
                      className="form-control"
                      value={promo_code}
                      onChange={(e) => setPromo_code(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="id_layanan">Layanan</label>
                        <select
                          name="id_layanan"
                          id="id_layanan"
                          className="form-control"
                          onChange={(e) => setId_layanan(e.target.value)}
                        >
                          <option value="">Pilih</option>
                          {layanan.length > 0 ? (
                            layanan?.map((value, row) => {
                              return (
                                <option key={row} value={value.id}>
                                  {value.title}
                                </option>
                              );
                            })
                          ) : (
                            <option value="">Data Kosong</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="id_sub_layanan">Sub Layanan</label>
                        <select
                          name="id_sub_layanan"
                          id="id_sub_layanan"
                          className="form-control"
                          onChange={(e) => setId_sub_layanan(e.target.value)}
                        >
                          <option value="">Pilih</option>
                          {sub_layanan.length > 0 ? (
                            sub_layanan
                              .filter(
                                (value) =>
                                  value.id_layanan === parseInt(id_layanan)
                              )
                              .map((value, row) => {
                                return (
                                  <option key={row} value={value.id}>
                                    {value.title}
                                  </option>
                                );
                              })
                          ) : (
                            <option value="">Data Kosong</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="reuse_limit">Reuse Limit</label>
                        <input
                          type="text"
                          id="reuse_limit"
                          name="reuse_limit"
                          className="form-control"
                          value={reuse_limit}
                          onChange={(e) => setReuse_limit(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="limit">Limit</label>
                        <input
                          type="text"
                          id="limit"
                          name="limit"
                          className="form-control"
                          value={limit}
                          onChange={(e) => setLimit(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="start_date">Tanggal Mulai</label>
                        <input
                          type="date"
                          id="start_date"
                          name="start_date"
                          className="form-control"
                          value={start_date}
                          onChange={(e) => setStart_date(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="end_date">Tanggal Selesai</label>
                        <input
                          type="date"
                          id="end_date"
                          name="end_date"
                          className="form-control"
                          value={end_date}
                          onChange={(e) => setEnd_date(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="start_time">Jam Mulai</label>
                        <input
                          type="time"
                          id="start_time"
                          name="start_time"
                          className="form-control"
                          value={start_time}
                          onChange={(e) => setStart_time(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="end_time">Jam Selesai</label>
                        <input
                          type="time"
                          id="end_time"
                          name="end_time"
                          className="form-control"
                          value={end_time}
                          onChange={(e) => setEnd_time(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="type_potongan">Tipe Potongan</label>
                        <select
                          name="type_potongan"
                          className="form-control"
                          id="type_potongan"
                          onChange={(e) => {
                            setType_potongan(e.target.value);
                            setPotongan(0);
                          }}
                        >
                          <option value="">---Tipe Potongan---</option>
                          <option value="1">Rp</option>
                          <option value="2">% (persen)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group mb-4">
                        <label htmlFor="potongan">Potongan</label>
                        <input
                          type="number"
                          name="potongan"
                          id="potongan"
                          className="form-control"
                          readOnly={!type_potongan}
                          value={potongan}
                          onChange={(e) => handleChangeMax(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-xs-12">
                  <div className="form-group mb-4">
                    <label htmlFor="action">Action</label>
                    <select
                      name="action"
                      className="form-control"
                      id="action"
                      onChange={(e) => setAction(e.target.value)}
                    >
                      <option value="">---Pilih Action---</option>
                      <option value="1">manual masukin code</option>
                      <option value="2">list promo</option>
                      <option value="3">manual / list promo</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="form-group mb-4">
                    <label htmlFor="desc">Keterangan</label>
                    <ReactQuill
                      modules={modules}
                      theme="snow"
                      value={desc}
                      onChange={setDesc}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-4">
                    <button
                      onClick={() => onSubmitReffCode()}
                      className="btn btn-success btn-block"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}

export default Promotion;
