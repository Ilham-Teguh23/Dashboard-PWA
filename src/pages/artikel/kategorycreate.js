import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Breadcrumb, Card } from "@themesberg/react-bootstrap";
import { addKategoryAction } from "../../redux/slices/kategorySlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const KategoryCreate = () => {
  const [addKategory, setaddKategory] = useState({
    name: "",
    id_admin: 12,
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
    if (!addKategory.name.trim()) {
      setError("Nama Kategori tidak boleh kosong");
      return;
    }
    dispatch(addKategoryAction(addKategory))
      .then(() => {
        toast.success("Kategori Berhasil di Tambahkan");
        setaddKategory({ name: "", id_admin: 12 });
        history.push("/artikel/artikelkategory");
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
              Data Kategori
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Tambah Kategori</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
        <h5 className="mb-4">Tambah Kategori</h5>
          <Form.Label>Name</Form.Label>
          <Form.Control
            className={`border`}
            required
            type="text"
            name="name"
            placeholder="Nama Kategori"
            value={addKategory.name}
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
export default KategoryCreate;
