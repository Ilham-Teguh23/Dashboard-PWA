// import {
//   faAngleDown,
//   faAngleRight,
//   faBullhorn,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   Alert,
//   Button,
//   ButtonGroup,
//   Form,
//   Dropdown,
// } from "@themesberg/react-bootstrap";
// import React, { Fragment } from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import "react-quill/dist/quill.snow.css";
// import axios from "axios";
// import ReactQuill from "react-quill";

// // import Preloader from "../../components/Preloader";
// import moment from "moment";
// import DataTable from "react-data-table-component";

// function MessageBlash() {
//   const [pilihJenisNotif, setPilihJenisNotif] = useState("1");
//   const [validationError, setValidationError] = useState("");
//   const [hiddenAlerts, setHiddenAlerts] = useState([]);
//   // const [title, setTitle] = useState("");
//   const [selectedFile, setSelectedFile] = useState();
//   const [preview, setPreview] = useState();
//   const [id, setId] = useState("");
//   const [dataMessage, setDataMessage] = useState("");
//   // const [inputFieldEmail, setInputFieldEmail] = useState([]);
//   const [isCheckAll, setIsCheckAll] = useState(false);
//   const [isCheck, setIsCheck] = useState([]);
//   const [selectData, setSelectData] = useState("1");
//   const [valueContent, setValueContent] = useState("");
//   // const [loader, setLoader] = useState("1");
//   const [dataDesign, setDataDesign] = useState("");
//   const [designId, setDesignId] = useState("");
//   const [inputFieldContentMessage, setInputFieldContentMessage] = useState([]);
//   const [titlePush, setTitlePush] = useState("");
//   const [kutipPush, setKutipPush] = useState("");
//   const [imagePush, setImagePush] = useState("");
//   const [pending, setPending] = useState(true);
//   const [rows, setRows] = useState([]);

//   // const [list, setList] = useState([]);

//   useEffect(() => {
//     getDesignMail();
//     getInformationPushNotif();
//     const timeout = setTimeout(() => {
//       // setRows(data);
//       setPending(false);
//     }, 2000);
//     return () => clearTimeout(timeout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   useEffect(() => {
//     getMessage();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [designId]);

//   useEffect(() => {
//     getDataMitra();
//     setIsCheckAll(false);
//     if (isCheck) {
//       setIsCheck([]);
//     }
//     // setInputFieldEmail([]);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectData]);

//   useEffect(() => {
//     if (!selectedFile) {
//       setPreview(undefined);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(selectedFile);
//     setPreview(objectUrl);

//     // free memory when ever this component is unmounted
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [selectedFile]);

//   const onSelectFile = (e) => {
//     e.preventDefault();
//     if (!e.target.files || e.target.files.length === 0) {
//       setSelectedFile(undefined);
//       return;
//     }
//     // I've kept this example simple by using the first image instead of multiple
//     setSelectedFile(e.target.files[0]);
//   };
//   const handleOnChangeContent = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setInputFieldContentMessage((values) => ({ ...values, [name]: value }));
//   };
//   const handleOnChangeContentImages = (event) => {
//     const name = event.target.name;
//     const value = event.target.files[0];
//     setInputFieldContentMessage((values) => ({ ...values, [name]: value }));
//   };

//   const onClose = (alertId) => {
//     const hiddenAlertsUpdated = [...hiddenAlerts, alertId];
//     setHiddenAlerts(hiddenAlertsUpdated);
//   };
//   const shouldShowAlert = (alertId) => hiddenAlerts.indexOf(alertId) === -1;
//   const onSelectData = (data) => {
//     setSelectData(data);
//     console.log(data);
//   };
//   const getDataMitra = async () => {
//     try {
//       if (selectData !== "1") {
//         const data = {
//           category: selectData,
//         };
//         if (selectData === "2") {
//           data.category = "1";
//         } else {
//           data.category = "2";
//         }

//         await axios
//           .post(`https://dev-portal-api.tnos.world/mitra/list`, data)
//           .then((res) => {
//             console.log(res);
//             setDataMessage(res.data.data);
//           })
//           .catch((res) => {
//             console.log(res);
//             // eslint-disable-next-line eqeqeq
//             if (res.response.status == 500) {
//               console.log(res);
//             } else {
//               setValidationError(res.response.data.message);
//             }
//           });
//       } else {
//         await axios
//           .post(`https://dev-portal-api.tnos.world/member/list`)
//           .then((res) => {
//             // console.log(res.data.data);
//             setDataMessage(res.data.data);
//           })
//           .catch((res) => {
//             console.log(res);
//             // eslint-disable-next-line eqeqeq
//             if (res.response.status == 500) {
//               console.log(res);
//             } else {
//               setValidationError(res.response.data.message);
//             }
//           });
//       }

//       // setIsDisabled(false);
//       //   console.log(response.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const generatePushNotif = () => {
//     try {
//       if (pilihJenisNotif === "1") {
//         const data = {
//           app_id: selectData,
//           appid: selectData,
//           sender: pilihJenisNotif,
//           title: titlePush,
//           kutip: kutipPush,
//           img: imagePush,
//           informasi: valueContent,
//           penerima: isCheck,
//           create_by: localStorage.getItem("user_id"),
//           create_at: moment().local().format("YYYY-MM-DD HH:mm:ss"),
//         };
//         console.log(data);
//         axios
//           .post(
//             `https://dev-portal-api.tnos.world/global/information/add`,
//             data
//           )
//           .then((res) => {
//             console.log(res);
//             // setLoader("1");
//             getInformationPushNotif();
//           })
//           .catch((res) => {
//             console.log(res);
//             // eslint-disable-next-line eqeqeq
//           });
//       } else {
//         const data = inputFieldContentMessage;
//         data.email = isCheck;
//         data.design_mail_id = designId;

//         axios
//           .post(`http://127.0.0.1:8000/api/message/send/mail`, data)
//           .then((res) => {
//             console.log(res);
//             // setLoader("1");
//           })
//           .catch((res) => {
//             console.log(res);
//             // eslint-disable-next-line eqeqeq
//           });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const handleSelectAll = () => {
//     setIsCheckAll(!isCheckAll);
//     setIsCheck(
//       dataMessage.map((row) => {
//         if (row.code) {
//           return row.code;
//         } else {
//           return row.mmbr_code;
//         }
//       })
//     );
//     // setInputFieldEmail(
//     //   dataMessage.map((row) => {
//     //     if (row.email) {
//     //       return row.email;
//     //     } else {
//     //       return row.mmbr_email;
//     //     }
//     //   })
//     // );
//     if (isCheckAll) {
//       setIsCheck([]);
//       // setInputFieldEmail([]);
//     }
//   };

//   const handleClick = (e) => {
//     const { id, checked } = e.target;
//     setIsCheck([...isCheck, id]);
//     // setInputFieldEmail([...inputFieldEmail, e.target.name]);
//     if (!checked) {
//       setIsCheck(isCheck.filter((item) => item !== id));
//     }
//     console.log(isCheck);
//   };

//   const getMessage = async () => {
//     try {
//       const data = {
//         id: designId,
//       };
//       if (data.id === "1") {
//         await axios
//           .post(`http://127.0.0.1:8000/api/get-message`, data)
//           .then((res) => {
//             setInputFieldContentMessage({
//               title_1: res.data.message.title_1 ? res.data.message.title_1 : "",
//               title_2: res.data.message.title_2 ? res.data.message.title_2 : "",
//               description_title: res.data.message.description_title
//                 ? res.data.message.description_title
//                 : "",
//               image_1: JSON.parse(res.data.message.image_1).image_name
//                 ? JSON.parse(res.data.message.image_1).image_name
//                 : "",
//               title_content_1: res.data.message.title_content_1
//                 ? res.data.message.title_content_1
//                 : "",
//               description_title_1: res.data.message.description_title_1
//                 ? res.data.message.description_title_1
//                 : "",
//               title_product_1: res.data.message.title_product_1
//                 ? res.data.message.title_product_1
//                 : "",
//               description_product_1: res.data.message.description_product_1
//                 ? res.data.message.description_product_1
//                 : "",
//               price_product_1: res.data.message.price_product_1
//                 ? res.data.message.price_product_1
//                 : "",
//               image_product_1: JSON.parse(res.data.message.image_product_1)
//                 .image_name
//                 ? JSON.parse(res.data.message.image_product_1).image_name
//                 : "",
//               title_product_2: res.data.message.title_product_2
//                 ? res.data.message.title_product_2
//                 : "",
//               description_product_2: res.data.message.description_product_2
//                 ? res.data.message.description_product_2
//                 : "",
//               price_product_2: res.data.message.price_product_2
//                 ? res.data.message.price_product_2
//                 : "",
//               image_product_2: JSON.parse(res.data.message.image_product_2)
//                 .image_name
//                 ? JSON.parse(res.data.message.image_product_2).image_name
//                 : "",
//               title_product_3: res.data.message.title_product_3
//                 ? res.data.message.title_product_3
//                 : "",
//               description_product_3: res.data.message.description_product_3
//                 ? res.data.message.description_product_3
//                 : "",
//               price_product_3: res.data.message.price_product_3
//                 ? res.data.message.price_product_3
//                 : "",
//               image_product_3: JSON.parse(res.data.message.image_product_3)
//                 .image_name
//                 ? JSON.parse(res.data.message.image_product_3).image_name
//                 : "",
//             });
//             setId(res.data.message.id);
//             let imageURL = JSON.parse(res.data.message.image_1)
//               ? JSON.parse(res.data.message.image_1)
//               : "";
//             setPreview(imageURL.image_url);
//             console.log(imageURL.image_url);
//           })
//           .catch((res) => {
//             console.log(res);
//             //  setValidationError(res.response.data.message);
//           });
//       } else if (data.id === "2") {
//         console.log("2");
//         await axios
//           .post(`http://127.0.0.1:8000/api/get-message`, data)
//           .then((res) => {
//             console.log(res);
//           })
//           .catch((res) => {
//             console.log(res);
//             //  setValidationError(res.response.data.message);
//           });
//       } else {
//         console.log("data tidak ada");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const addContentMessage = async () => {
//     try {
//       const data = inputFieldContentMessage;
//       data.image_1 = selectedFile;
//       data.message_id = id;
//       data.design_mail_id = designId;

//       console.log(data);
//       await axios
//         .post(`http://127.0.0.1:8000/api/add-message`, data, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         })
//         .then((res) => {
//           console.log(res);
//           getMessage();
//         })
//         .catch((res) => {
//           console.log(res);
//           // eslint-disable-next-line eqeqeq
//           if (res.response.status == 500) {
//             console.log(res);
//           } else {
//             setValidationError(res.response.data.message);
//           }
//         });
//       // setIsDisabled(false);
//       //   console.log(response.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const modules = {
//     toolbar: [
//       [{ font: [] }],
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ script: "sub" }, { script: "super" }],
//       ["blockquote", "code-block"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
//       ["link", "image", "video"],
//       ["clean"],
//     ],
//   };
//   const getDesignMail = async () => {
//     try {
//       await axios
//         .post(`http://127.0.0.1:8000/api/get-design-mail`)
//         .then((res) => {
//           setDataDesign(res.data.design_mail);
//           console.log(res.data.design_mail);
//         })
//         .catch((res) => {
//           console.log(res);
//           //  setValidationError(res.response.data.message);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const columns = [
//     {
//       name: "No",
//       selector: (row) => row.id,
//       sortable: true,
//     },
//     {
//       name: "app_id",
//       selector: (row) => row.app_id,
//       sortable: true,
//     },

//     {
//       name: "title",
//       selector: (row) => row.title,
//       sortable: true,
//     },
//     {
//       name: "kutip",
//       selector: (row) => row.kutip,
//       sortable: true,
//     },
//     {
//       name: "img",
//       selector: (row) => row.img,
//       sortable: true,
//     },
//     {
//       name: "penerima",
//       selector: (row) => (
//         <button className="btn btn-sm btn-success">Detail</button>
//       ),
//       sortable: true,
//     },
//     {
//       name: "create_at",
//       selector: (row) => row.create_at,
//       sortable: true,
//     },
//   ];
//   const getInformationPushNotif = async () => {
//     try {
//       const data = {
//         appid: selectData,
//       };
//       await axios
//         .post(`https://dev-portal-api.tnos.world/global/information`, data)
//         .then((res) => {
//           console.log(res);
//           setRows(res.data.data);
//         })
//         .catch((res) => {
//           console.log(res);
//           //  setValidationError(res.response.data.message);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Fragment>
//       {/* <Preloader show={loader ? false : true} /> */}
//       <div className="row">
//         {/* <Iframe
//           url="http://127.0.0.1:8000/push-notif"
//           width="640px"
//           height="320px"
//           id=""
//           className=""
//           display="block"
//           position="relative"
//         /> */}
//         <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 col-xl-4">
//           <div
//             className="shadow-sm card border-light"
//             style={{ maxHeight: "600px" }}
//           >
//             <div className=" border-light d-flex justify-content-between align-items-center card-header">
//               <h5 className="mb-0">Pilih Mitra atau User</h5>
//               <Dropdown
//                 drop={faAngleRight}
//                 as={ButtonGroup}
//                 className="me-2 mb-2"
//               >
//                 <Dropdown.Toggle size="sm" split variant="tertiary">
//                   <FontAwesomeIcon
//                     icon={faAngleDown}
//                     className="dropdown-arrow"
//                     size="sm"
//                   />
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => onSelectData("1")}>
//                     User
//                   </Dropdown.Item>
//                   <Dropdown.Item onClick={() => onSelectData("2")}>
//                     Pengamanan
//                   </Dropdown.Item>
//                   <Dropdown.Item onClick={() => onSelectData("3")}>
//                     Pendamping Hukum
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             <div className="card-body" style={{ overflowX: "auto" }}>
//               <div className="list-group-flush list my--3 list-group">
//                 <div className="px-0 list-group-item ">
//                   <div className="align-items-center row">
//                     <div className="ms--2 col text-right">
//                       <h4 className="h6 mb-0">
//                         <div className="">Pilih Semua</div>
//                       </h4>
//                     </div>
//                     <div className="col-auto col">
//                       <Form.Check
//                         name="selectAll"
//                         id="selectAll"
//                         onChange={handleSelectAll}
//                         checked={isCheckAll}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {dataMessage?.length > 0 ? (
//                   dataMessage?.map((row, key) => {
//                     return (
//                       <div className="px-0 list-group-item" key={key}>
//                         <div className="align-items-center row">
//                           <div className="col-auto col">
//                             <div className="user-avatar">
//                               <img
//                                 src="https://demo.themesberg.com/volt-react-dashboard/static/media/profile-picture-1.4d26e151.jpg"
//                                 alt=""
//                                 className="rounded circle"
//                               />
//                             </div>
//                           </div>
//                           <div className="ms--2 col">
//                             <h4 className="h6 mb-0">
//                               <div>
//                                 {row.fullname ? row.fullname : row.mmbr_name}
//                               </div>
//                             </h4>
//                             <span className="text-success">● </span>
//                             <small>Online</small>
//                           </div>
//                           <div className="col-auto col">
//                             <Form.Check
//                               label=""
//                               name={row.email ? row.email : row.mmbr_email}
//                               id={row.code ? row.code : row.mmbr_code}
//                               onChange={handleClick}
//                               checked={isCheck.includes(
//                                 row.code ? row.code : row.mmbr_code
//                               )}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="px-0 list-group-item">
//                     <div className="align-items-center row">
//                       <div className="col-auto col">
//                         <div className="user-avatar">
//                           <img
//                             src="https://demo.themesberg.com/volt-react-dashboard/static/media/profile-picture-1.4d26e151.jpg"
//                             alt=""
//                             className="rounded circle"
//                           />
//                         </div>
//                       </div>
//                       <div className="ms--2 col">
//                         <h4 className="h6 mb-0">
//                           <div>kosong</div>
//                         </h4>
//                         <span className="text-success">● </span>
//                         <small>Online</small>
//                       </div>
//                       <div className="col-auto col">
//                         <Form.Check
//                           label=""
//                           id="checkbox1"
//                           htmlFor="checkbox1"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="card-footer">
//               {!titlePush || !kutipPush || !valueContent ? (
//                 <p className="text-danger">
//                   Silahkan isi form push notif terlebih dahulu
//                 </p>
//               ) : (
//                 <button
//                   onClick={() => generatePushNotif()}
//                   className="btn btn-primary"
//                 >
//                   Push Notif
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 col-xl-8">
//           {Object.keys(validationError).length > 0 && (
//             <Alert
//               variant="danger"
//               show={shouldShowAlert("danger")}
//               onClose={() => onClose("danger")}
//             >
//               <div className="d-flex justify-content-between">
//                 <div>
//                   <FontAwesomeIcon icon={faBullhorn} className="me-1" />
//                   <strong>Ada yang salah!</strong>
//                   {Object.entries(validationError).map(([key, value]) => (
//                     <div key={key}>{value}</div>
//                   ))}
//                 </div>
//                 <Button
//                   variant="close"
//                   size="xs"
//                   onClick={() => onClose("danger")}
//                 />
//               </div>
//             </Alert>
//           )}
//           <div className="shadow-sm card border-light">
//             <div className=" border-light d-flex justify-content-between card-header">
//               <h5 className="mb-0">Pilih Jenis Notifikasi</h5>
//               <div className="btn-group">
//                 <button
//                   type="button"
//                   onClick={() => setPilihJenisNotif("1")}
//                   className={`btn btn-outline-success btn-sm ${
//                     pilihJenisNotif === "1" ? "active" : ""
//                   }`}
//                 >
//                   Notif
//                 </button>
//                 <button
//                   onClick={() => setPilihJenisNotif("2")}
//                   type="button"
//                   className={`btn btn-outline-danger btn-sm ${
//                     pilihJenisNotif === "2" ? "active" : ""
//                   }`}
//                 >
//                   Email
//                 </button>
//               </div>
//             </div>
//             <div
//               className="card-body"
//               style={
//                 pilihJenisNotif === "1"
//                   ? { display: "unset" }
//                   : { display: "none" }
//               }
//             >
//               <div className="form-group mb-2">
//                 <label htmlFor="title">Judul</label>
//                 <input
//                   type="text"
//                   name="title"
//                   id="title"
//                   className="form-control"
//                   value={titlePush}
//                   onChange={(e) => setTitlePush(e.target.value)}
//                 />
//               </div>
//               <div className="form-group mb-2">
//                 <label htmlFor="kutip">Kutipan</label>
//                 <textarea
//                   name="kutip"
//                   id="kutip"
//                   cols="5"
//                   rows="5"
//                   className="form-control"
//                   value={kutipPush}
//                   onChange={(e) => setKutipPush(e.target.value)}
//                 ></textarea>
//               </div>
//               <div className="form-group mb-3">
//                 <label htmlFor="image" className="mb-2">
//                   Pilih Gambar (optional)
//                 </label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   placeholder="Image"
//                   name="image"
//                   accept="image/*"
//                   onChange={(e) => setImagePush(e.target.files[0])}
//                 />
//               </div>
//               <div className="form-group mb-2">
//                 <label htmlFor="isi">Isi</label>
//                 <ReactQuill
//                   modules={modules}
//                   theme="snow"
//                   value={valueContent}
//                   onChange={setValueContent}
//                 />
//               </div>
//             </div>

//             <div
//               className="card-body"
//               style={
//                 pilihJenisNotif === "2"
//                   ? { display: "unset" }
//                   : { display: "none" }
//               }
//             >
//               <div className="form-group mb-3">
//                 <label htmlFor="judul" className="mb-2">
//                   Pilih Design Template
//                 </label>
//                 <select
//                   name="design_mail_id"
//                   id="design_mail_id"
//                   className="form-control"
//                   value={designId}
//                   onChange={(e) => {
//                     setDesignId(e.target.value);
//                     setInputFieldContentMessage([]);
//                   }}
//                 >
//                   <option value="">--Pilih--</option>
//                   {dataDesign?.length > 0 ? (
//                     dataDesign?.map((row, key) => {
//                       return (
//                         <option key={key} value={row.id}>
//                           {row.name}
//                         </option>
//                       );
//                     })
//                   ) : (
//                     <option value="">--kosong--</option>
//                   )}
//                 </select>
//               </div>
//               <div
//                 style={
//                   designId === "1" ? { display: "unset" } : { display: "none" }
//                 }
//               >
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_1" className="mb-2">
//                     Title 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_1"
//                     name="title_1"
//                     value={inputFieldContentMessage.title_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_2" className="mb-2">
//                     Title 2
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_2"
//                     name="title_2"
//                     value={inputFieldContentMessage.title_2}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>

//                 <div className="form-group mb-3">
//                   <label htmlFor="description_title" className="mb-2">
//                     Description Title
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_title"
//                     name="description_title"
//                     value={inputFieldContentMessage.description_title}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="image" className="mb-2">
//                     Pilih Gambar (optional)
//                   </label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     placeholder="Image"
//                     name="image"
//                     onChange={(e) => onSelectFile(e)}
//                     accept="image/*"
//                   />

//                   {selectedFile ? (
//                     <img
//                       src={
//                         preview
//                           ? preview
//                           : localStorage.getItem("preview_image")
//                       }
//                       alt="img"
//                       className="img-fluid mt-3"
//                     />
//                   ) : (
//                     <img src={preview} alt="img" className="img-fluid mt-3" />
//                   )}
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_content_1" className="mb-2">
//                     Title Content 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_content_1"
//                     name="title_content_1"
//                     value={inputFieldContentMessage.title_content_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="description_title_1" className="mb-2">
//                     Description Title 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_title_1"
//                     name="description_title_1"
//                     value={inputFieldContentMessage.description_title_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <hr />
//                 <h5>Product 1</h5>
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_product_1" className="mb-2">
//                     Title Product 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_product_1"
//                     name="title_product_1"
//                     value={inputFieldContentMessage.title_product_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="description_product_1" className="mb-2">
//                     Description Product 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_product_1"
//                     name="description_product_1"
//                     value={inputFieldContentMessage.description_product_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="price_product_1" className="mb-2">
//                     price_product_1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="price_product_1"
//                     name="price_product_1"
//                     value={inputFieldContentMessage.price_product_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="image_product_1" className="mb-2">
//                     Pilih Gambar (optional)
//                   </label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     placeholder="Image"
//                     accept="image/*"
//                     name="image_product_1"
//                     onChange={(event) => handleOnChangeContentImages(event)}
//                   />
//                 </div>
//                 <hr />
//                 <h5>Product 2</h5>
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_product_2" className="mb-2">
//                     Title Product 2
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_product_2"
//                     name="title_product_2"
//                     value={inputFieldContentMessage.title_product_2}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="description_product_2" className="mb-2">
//                     Description Product 2
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_product_2"
//                     name="description_product_2"
//                     value={inputFieldContentMessage.description_product_2}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="price_product_2" className="mb-2">
//                     price_product_2
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="price_product_2"
//                     name="price_product_2"
//                     value={inputFieldContentMessage.price_product_2}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="image_product_2" className="mb-2">
//                     image_product_2
//                   </label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     placeholder="Image"
//                     accept="image/*"
//                     name="image_product_2"
//                     onChange={(event) => handleOnChangeContentImages(event)}
//                   />
//                 </div>
//                 <hr />
//                 <h5>Product 3</h5>
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_product_3" className="mb-2">
//                     Title Product 3
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_product_3"
//                     name="title_product_3"
//                     value={inputFieldContentMessage.title_product_3}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="description_product_3" className="mb-2">
//                     Description Product 3
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_product_3"
//                     name="description_product_3"
//                     value={inputFieldContentMessage.description_product_3}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="price_product_3" className="mb-2">
//                     price_product_3
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="price_product_3"
//                     name="price_product_3"
//                     value={inputFieldContentMessage.price_product_3}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="image_product_3" className="mb-2">
//                     image_product_3
//                   </label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     placeholder="Image"
//                     accept="image/*"
//                     name="image_product_3"
//                     onChange={(event) => handleOnChangeContentImages(event)}
//                   />
//                 </div>

//                 <button
//                   onClick={() => addContentMessage()}
//                   className="btn btn-primary"
//                 >
//                   Simpan
//                 </button>
//               </div>
//               <div
//                 style={
//                   designId === "2" ? { display: "unset" } : { display: "none" }
//                 }
//               >
//                 <div className="form-group mb-3">
//                   <label htmlFor="title_1" className="mb-2">
//                     Title 1
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="title_1"
//                     name="title_1"
//                     value={inputFieldContentMessage.title_1}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>
//                 <div className="form-group mb-3">
//                   <label htmlFor="description_title" className="mb-2">
//                     Description Title
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="description_title"
//                     name="description_title"
//                     value={inputFieldContentMessage.description_title}
//                     onChange={(event) => handleOnChangeContent(event)}
//                   />
//                 </div>

//                 <button
//                   onClick={() => addContentMessage()}
//                   className="btn btn-primary"
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="shadow-sm card border-light">
//         <div className=" border-light d-flex justify-content-between card-header">
//           {/* <h5 className="mb-0">Pilih Jenis Notifikasi</h5> */}
//         </div>
//         <div className="card-body">
//           <DataTable
//             title="Push Notif"
//             columns={columns}
//             data={rows}
//             progressPending={pending}
//             pagination
//             responsive
//           />
//         </div>
//       </div>
//     </Fragment>
//   );
// }

// export default MessageBlash;
