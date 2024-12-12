import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { Form, Button, Breadcrumb, Card } from "@themesberg/react-bootstrap";
import { addTagsAction } from "../../redux/slices/kategorySlice";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const TagsCreate = () => {
  const [addSubKategory, setaddKategory] = useState({
    name: "",
    id_admin: 1,
  });

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  function handleChange(e) {
    setaddKategory((prev) => ({
      ...prev,
      name: e,
    }));

    setError("");
  }
  function handleAddKategory() {
    if (!addSubKategory.name.trim()) {
      setError("Nama tags tidak boleh kosong");
      return;
    }
    dispatch(addTagsAction(addSubKategory))
      .then(() => {
        toast.success("Tag Berhasil di Tambahkan");
        setaddKategory({ name: "", id_admin: 1 });
        history.push("/artikel/tags");
      })
      .catch((err) => {
        toast.error(err);
      });
  }
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
            <Breadcrumb.Item href="/artikel/artikelkategory">
              Kategori
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/artikel/tags">Tags</Breadcrumb.Item>
            <Breadcrumb.Item active>Tambah Tags</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Tambah Tags</h5>
          <Form.Label>Name</Form.Label>
          <Form.Control
            className={`border`}
            required
            type="text"
            name="name"
            placeholder="Nama Tags"
            value={addSubKategory.name}
            onChange={(e) => handleChange(e.target.value)}
          />
          {error && (
            <Form.Text className="text-danger small">{error}</Form.Text>
          )}

          <div className="mt-3">
            <Button onClick={handleAddKategory} variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default TagsCreate;
