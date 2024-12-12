import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faInfoCircle,
  faTrash,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Button,
  Table,
  Breadcrumb,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getArticlesAction,
} from "../../redux/slices/articleSlice";
import { deleteArticle } from "../../redux/apis/articleApi";

const ArtikelIndex = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article);
  useEffect(() => {
    dispatch(getArticlesAction({ page: 1, view: 265, status: "publish" }));
  }, []);
  const handleDelete = async (articleId) => {
    try {
      const response = await deleteArticle({ article_id: articleId });
      if (response.status === 200) {
        dispatch(getArticlesAction({ page: 1, view: 265, status: "publish" }));
      } else {
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  const TableRow = (props) => {
    return (
      <tr>
        <td>{props.index}</td>
        <th scope="row">{props.data.title}</th>
        {/* <th scope="row">{props.data.description}</th> */}
        {props.data.description.length > 50
          ? `${props.data.description.substring(0, 20)}...`
          : props.data.description}
        <th scope="row">{props.data.category}</th>
        <th scope="row">{props.data.id}</th>
        <th scope="row">
          {props.data.status === "Y"
            ? "Publish"
            : props.data.status === "N"
            ? "Unpublish"
            : "Draft"}
        </th>
        <td className="text-center">
          <Link to={`/artikel/detail/${props?.data?.id}`}>
            <Button variant="warning" size="sm" className="text-white">
              <FontAwesomeIcon icon={faInfoCircle} />
            </Button>
          </Link>
        </td>
        <td className="text-center">
          <Link to={`/artikel/update/${props?.data?.id}`}>
            <Button variant="warning" size="sm" className="text-white">
              <FontAwesomeIcon icon={faPencilAlt} />
            </Button>
          </Link>
        </td>
        <td className="text-center">
          <Button
            variant="warning"
            size="sm"
            className="text-white"
            onClick={() => handleDelete(props?.data?.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </td>
      </tr>
    );
  };

  // table row
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Data Artikel</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Table responsive className="align-items-center table-flush">
            <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Judul Artikel</th>
                <th scope="col">DESKRIPSI</th>
                <th scope="col">KATEGORI </th>
                <th scope="col">PENULIS </th>
                <th scope="col">Status</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {articles?.articleList?.konten?.map((item, index) =>
                TableRow({ data: item, index: index + 1 })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};
export default ArtikelIndex;
