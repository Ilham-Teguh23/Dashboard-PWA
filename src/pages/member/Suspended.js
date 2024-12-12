import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faThList,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Card,
  // Button,
  Form,
  InputGroup,
} from "@themesberg/react-bootstrap";
// import { Link } from "react-router-dom";

import { TnosDataTable } from "../../components/TnosDataTable";

export default () => {
  // const [getMemberData, setMemberData] = useState();
  // const [getAllMemberData, setAllMemberData] = useState();
  const [getMessageEmptyData] = useState("Tidak ada mitra yang ditangguhkan");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_PORTAL_API_URL}/member/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // let datas = data.data;
        // setMemberData(datas.filter((subItem) => subItem.mmbr_suspend === "no"));
        // setAllMemberData(
        //   datas.filter((subItem) => subItem.mmbr_suspend === "no")
        // );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const TableRow = (props) => {
  //   const { mmbr_code, mmbr_name, mmbr_phone, mmbr_email } = props;

  //   return (
  //     <tr>
  // <td>{props.num}</td>
  //       <td>{mmbr_name}</td>
  //       <td>{mmbr_phone}</td>
  //       <td>{mmbr_email}</td>
  //       <td>
  //         <Link to={`/member/profile/${mmbr_code}`}>
  //           <Button variant="primary" size="sm" className="text-white">
  //             <FontAwesomeIcon icon={faThList} />
  //           </Button>
  //         </Link>
  //       </td>
  //     </tr>
  //   );
  // };

  const filterData = (e) => {
    if (e.target.id === "all_search") {
      // setMemberData(
      //   getAllMemberData.filter(
      //     (item) =>
      //       item.mmbr_name
      //         .toLowerCase()
      //         .includes(e.target.value.toLowerCase()) ||
      //       item.mmbr_phone.includes(e.target.value) ||
      //       item.mmbr_email.toLowerCase().includes(e.target.value.toLowerCase())
      //   )
      // );
    }
  };

  return (
    <>
      <Col xl={12} className="mt-2">
        <Card border="light">
          <Card.Body>
            <Form className="navbar-search mb-3">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Cari Pengguna yang Ditangguhkan..."
                    id="all_search"
                    onKeyUp={filterData}
                  />
                </InputGroup>
              </Form.Group>
            </Form>
            <TnosDataTable
              title={"Daftar Pengguna"}
              subtitle={"Daftar Pengguna Ditangguhkan"}
              data={
                <>
                  <thead className="thead-light">
                    <tr>
                      <th className="border-0">No.</th>
                      <th className="border-0">Nama</th>
                      <th className="border-0">Kode Member</th>
                      <th className="border-0">Tanggal Mendaftar</th>
                      <th className="border-0">No. Hp</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {getMemberData?.length > 0 ? (
                      getMemberData?.map((m, index) => (
                        <TableRow key={`member-${m.mmbr_code}`} {...m} num={index + 1} />
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colspan={4}>{getMessageEmptyData}</td>
                      </tr>
                    )} */}
                    <tr className="text-center">
                      <td colspan={7}>{getMessageEmptyData}</td>
                    </tr>
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
