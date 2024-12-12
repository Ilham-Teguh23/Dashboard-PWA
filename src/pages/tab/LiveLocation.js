// import { Button, Card, Col, Form, InputGroup, Nav, Row, Tab } from "@themesberg/react-bootstrap";
// import React, { useEffect, useState } from "react";
// import { TnosDataTable } from "../../components/TnosDataTable";
// import { database } from "../../config/firebase";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faThList } from "@fortawesome/free-solid-svg-icons";
// import ConvertTimestamps from "../../components/ConvertTimestamps";
// import { ref, onValue, off } from "firebase/database"
// import moment from "moment";

// export default () => {

//     const [activeTab, setActiveTab] = useState("tabLiveLocationMenunggu")

//     const handleSelectTab = (key) => {
//         setActiveTab(key);
//     };

//     const [getLiveLocation, setLiveLocation] = useState([]);
//     const [getMessageEmptyData, setMessageEmptyData] = useState(
//         "Belum ada data pada hari ini"
//     );

//     const today = moment().format("YYYY-MM-DD");
//     const [startDate, setStartDate] = useState(today);
//     const [endDate, setEndDate] = useState(today);

//     const fetchData = () => {
//         try {
//             const dbRef = ref(database, "TNSALERT/PANIC/INCIDENT");

//             onValue(dbRef, (snapshot) => {
//                 const dataResponse = snapshot.val();

//                 if (dataResponse) {
//                     const dataArray = Object.values(dataResponse);

//                     let filteredData = dataArray

//                     if (activeTab === "tabLiveLocationMenunggu") {
//                         filteredData = filteredData.filter(item => item.status === "W");
//                     } else if (activeTab === "tabLiveLocationProses") {
//                         filteredData = filteredData.filter(item => item.status === "P");
//                     } else if (activeTab === "tabLiveLocationSelesai") {
//                         filteredData = filteredData.filter(item => item.status === "D");
//                     }

//                     if (startDate && endDate) {
//                         filteredData = filteredData.filter(item => {
//                             const itemDate = moment(parseInt(item.timestamp)).format("YYYY-MM-DD");
//                             const start = moment(startDate).startOf('day');
//                             const end = moment(endDate).endOf('day');
//                             return moment(itemDate).isBetween(start, end, null, '[]');
//                         });
//                     }

//                     filteredData.sort((a, b) => b.timestamp - a.timestamp);
        
//                     setLiveLocation(filteredData);
//                 } else {
//                     setLiveLocation([])
//                 }
//             });

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleSearchByDate = (e) => {
//         e.preventDefault();
//         filterByDate();
//     };

//     const filterByDate = () => {
//         const originalData = [...getLiveLocation];

//         let filteredData = originalData.filter(item => {
//             const itemDate = moment(parseInt(item.timestamp)).format("YYYY-MM-DD");
//             const start = moment(startDate).startOf('day');
//             const end = moment(endDate).endOf('day');

//             return moment(itemDate).isBetween(start, end, null, '[]');
//         });

//         setLiveLocation(filteredData);
//     };

//     useEffect(() => {
//         const listener = fetchData();

//         return () => {
//             const dbRef = ref(database, "TNSALERT/PANIC/INCIDENT");
//             off(dbRef)
//         };
//     }, [activeTab, startDate, endDate]);

//     const TableRow = ({ num, name, phone, timestamp, idpaket }) => (
//         <tr>
//             <td className="text-center">{num}.</td>
//             <td className="text-center">
//                 <Link to={`/tab/live-location/${timestamp}/detail`}>
//                     <Button variant="primary" size="sm" className="text-white">
//                         <FontAwesomeIcon icon={faThList} />
//                     </Button>
//                 </Link>
//             </td>
//             <td>{name}</td>
//             <td className="text-center">{phone}</td>
//             <td className="text-center">
//                 <ConvertTimestamps timestamp={timestamp} />
//             </td>
//         </tr>
//     );

//     return (
//         <>
//             <Col xl={12} className="mt-2">
//                 <Tab.Container activeKey={activeTab} onSelect={handleSelectTab}>
//                     <Row>
//                         <Col lg={12}>
//                             <Nav className="nav-tabs">
//                                 <Nav.Item>
//                                     <Nav.Link eventKey="tabLiveLocationMenunggu">Menunggu</Nav.Link>
//                                 </Nav.Item>
//                                 <Nav.Item>
//                                     <Nav.Link eventKey="tabLiveLocationProses">Proses</Nav.Link>
//                                 </Nav.Item>
//                                 <Nav.Item>
//                                     <Nav.Link eventKey="tabLiveLocationSelesai">Selesai</Nav.Link>
//                                 </Nav.Item>
//                             </Nav>
//                         </Col>
//                         <Col lg={12}>
//                             <Tab.Content>
//                                 <Tab.Pane eventKey="tabLiveLocationMenunggu">
//                                     <Card border="light">
//                                         <Card.Body>
//                                             <Row className="mb-3">
//                                                 <Col md={4}>
//                                                     <Form onSubmit={handleSearchByDate}>
//                                                         <Form.Group id="topbarSearch">
//                                                             <Form.Label>Tanggal Insiden</Form.Label>
//                                                             <InputGroup>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="start_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={startDate}
//                                                                     onChange={(e) => setStartDate(e.target.value)}
//                                                                 />
//                                                                 <InputGroup.Text>&#x2192;</InputGroup.Text>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="end_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={endDate}
//                                                                     onChange={(e) => setEndDate(e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Form>
//                                                 </Col>

//                                                 {/* <Col md={5}>
//                                                     <Form>
//                                                         <Form.Group id="topbarSearch">
//                                                             <Form.Label>Cari Transaksi</Form.Label>
//                                                             <InputGroup className="input-group-merge search-bar">
//                                                                 <InputGroup.Text>
//                                                                     <FontAwesomeIcon icon={faSearch} />
//                                                                 </InputGroup.Text>
//                                                                 <Form.Control
//                                                                     type="text"
//                                                                     placeholder="Cari Transaksi"
//                                                                     id="all_search"
//                                                                     ref={searchInputRef}
//                                                                 />
//                                                                 <Button variant="primary" onClick={handleSearch}>
//                                                                     Search
//                                                                 </Button>
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Form>
//                                                 </Col>

//                                                 <Col md={2}>
//                                                     <Form.Group id="transaction_status">
//                                                         <Form.Label>Status</Form.Label>
//                                                         <Form.Select
//                                                             name="transaction_status"
//                                                             value={selectedStatus}
//                                                             onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
//                                                         >
//                                                             {getPaymentStatusArr?.map((item) => (
//                                                                 <option key={item.key} value={item.value}>
//                                                                     {item.defaultValue}
//                                                                 </option>
//                                                             ))}
//                                                         </Form.Select>
//                                                     </Form.Group>
//                                                 </Col>

//                                                 <Col>
//                                                     <Form.Group id="filter_test">
//                                                         <Form.Label>Filter</Form.Label>
//                                                         <Form.Select
//                                                             name="transaction_status"
//                                                             value={selectedFilter}
//                                                             onChange={(e) => setSelectedFilter(parseInt(e.target.value))}
//                                                             required
//                                                         >
//                                                             {getFilterTest?.map((item) => (
//                                                                 <option key={item.key} value={item.value}>
//                                                                     {item.defaultValue}
//                                                                 </option>
//                                                             ))}
//                                                         </Form.Select>
//                                                     </Form.Group>
//                                                 </Col> */}
//                                             </Row>
//                                             <TnosDataTable
//                                                 data={
//                                                     <>
//                                                         <thead className="thead-light">
//                                                             <tr>
//                                                                 <th className="border-0 text-center">No.</th>
//                                                                 <th className="border-0 text-center">Detail</th>
//                                                                 <th className="border-0">Nama</th>
//                                                                 <th className="border-0 text-center">No. Handphone</th>
//                                                                 <th className="border-0 text-center">Tanggal Insiden</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {getLiveLocation.length > 0 ? (
//                                                                 getLiveLocation.map((td, index) => (
//                                                                     <TableRow
//                                                                         key={`order-success-${td.id}`}
//                                                                         num={index + 1}
//                                                                         {...td}
//                                                                     />
//                                                                 ))
//                                                             ) : (
//                                                                 <tr className="text-center">
//                                                                     <td colSpan={8}>{getMessageEmptyData}</td>
//                                                                 </tr>
//                                                             )}
//                                                         </tbody>
//                                                     </>
//                                                 }
//                                             />
//                                         </Card.Body>
//                                     </Card>
//                                 </Tab.Pane>
//                                 <Tab.Pane eventKey="tabLiveLocationProses">
//                                     <Card border="light">
//                                         <Card.Body>
//                                             <Row className="mb-3">
//                                                 <Col md={4}>
//                                                     <Form onSubmit={handleSearchByDate}>
//                                                         <Form.Group id="topbarSearch">
//                                                             <Form.Label>Tanggal Insiden</Form.Label>
//                                                             <InputGroup>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="start_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={startDate}
//                                                                     onChange={(e) => setStartDate(e.target.value)}
//                                                                 />
//                                                                 <InputGroup.Text>&#x2192;</InputGroup.Text>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="end_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={endDate}
//                                                                     onChange={(e) => setEndDate(e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Form>
//                                                 </Col>
//                                             </Row>
//                                             <TnosDataTable
//                                                 tabLiveLocation="tabLiveLocationProses"
//                                                 data={
//                                                     <>
//                                                         <thead className="thead-light">
//                                                             <tr>
//                                                                 <th className="border-0 text-center">No.</th>
//                                                                 <th className="border-0 text-center">Detail</th>
//                                                                 <th className="border-0">Nama</th>
//                                                                 <th className="border-0 text-center">No. Handphone</th>
//                                                                 <th className="border-0 text-center">Tanggal Insiden</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {getLiveLocation.length > 0 ? (
//                                                                 getLiveLocation.map((td, index) => (
//                                                                     <TableRow
//                                                                         key={`order-success-${td.id}`}
//                                                                         num={index + 1}
//                                                                         {...td}
//                                                                     />
//                                                                 ))
//                                                             ) : (
//                                                                 <tr className="text-center">
//                                                                     <td colSpan={8}>{getMessageEmptyData}</td>
//                                                                 </tr>
//                                                             )}
//                                                         </tbody>
//                                                     </>
//                                                 }
//                                             />
//                                         </Card.Body>
//                                     </Card>
//                                 </Tab.Pane>
//                                 <Tab.Pane eventKey="tabLiveLocationSelesai">
//                                     <Card border="light">
//                                         <Card.Body>
//                                             <Row className="mb-3">
//                                                 <Col md={4}>
//                                                     <Form onSubmit={handleSearchByDate}>
//                                                         <Form.Group id="topbarSearch">
//                                                             <Form.Label>Tanggal Insiden</Form.Label>
//                                                             <InputGroup>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="start_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={startDate}
//                                                                     onChange={(e) => setStartDate(e.target.value)}
//                                                                 />
//                                                                 <InputGroup.Text>&#x2192;</InputGroup.Text>
//                                                                 <Form.Control
//                                                                     type="date"
//                                                                     name="end_date_time"
//                                                                     step="1"
//                                                                     required
//                                                                     value={endDate}
//                                                                     onChange={(e) => setEndDate(e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Form>
//                                                 </Col>
//                                             </Row>
//                                             <TnosDataTable
//                                                 tabLiveLocation="tabLiveLocationProses"
//                                                 data={
//                                                     <>
//                                                         <thead className="thead-light">
//                                                             <tr>
//                                                                 <th className="border-0 text-center">No.</th>
//                                                                 <th className="border-0 text-center">Detail</th>
//                                                                 <th className="border-0">Nama</th>
//                                                                 <th className="border-0 text-center">No. Handphone</th>
//                                                                 <th className="border-0 text-center">Tanggal Insiden</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {getLiveLocation.length > 0 ? (
//                                                                 getLiveLocation.map((td, index) => (
//                                                                     <TableRow
//                                                                         key={`order-success-${td.id}`}
//                                                                         num={index + 1}
//                                                                         {...td}
//                                                                     />
//                                                                 ))
//                                                             ) : (
//                                                                 <tr className="text-center">
//                                                                     <td colSpan={8}>{getMessageEmptyData}</td>
//                                                                 </tr>
//                                                             )}
//                                                         </tbody>
//                                                     </>
//                                                 }
//                                             />
//                                         </Card.Body>
//                                     </Card>
//                                 </Tab.Pane>
//                             </Tab.Content>
//                         </Col>
//                     </Row>
//                 </Tab.Container>
//             </Col>
//         </>
//     );
// };
