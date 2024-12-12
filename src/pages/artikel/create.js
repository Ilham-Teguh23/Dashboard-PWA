import React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Breadcrumb, Card } from "@themesberg/react-bootstrap";
import { addArticleAction } from "../../redux/slices/articleSlice";
import {
  getKategoryAction,
  getSubKategoryAction,
  getWriterListaction,
  tagsListaction,
} from "../../redux/slices/kategorySlice";
import { useEffect } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddArticle = () => {
  const [addArtikel, setAddArtikel] = useState({
    title: "",
    konten: "",
    image: [],
    id_category: "",
    id_subcategory: "",
    tags: [],
    admin_id: 12,
    writer_admin_id: "",
    status: "Y",
  });

  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const kategory = useSelector((state) => state.kategory);
  const [preview, setPreview] = useState();
  const onDrop = useCallback((acceptedFiles) => {
    setAddArtikel((prev) => ({
      ...prev,
      image: acceptedFiles[0],
    }));
    setPreview(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleEditorChange = (value) => {
    console.log(document?.getElementsByTagName("img"));
    console.log(value);
    setAddArtikel((prev) => ({ ...prev, konten: value }));
    // localStorage.setItem("webAnswer", value);
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
  function handleChange(e) {
    console.log(e);
    setAddArtikel((prev) => ({
      ...prev,
      title: e,
    }));
  }

  function handleChangeSelect(e) {
    setAddArtikel((prev) => ({
      ...prev,
      id_category: e,
    }));
  }

  function handleChangeSelectWrier(e) {
    setAddArtikel((prev) => ({
      ...prev,
      writer_admin_id: e,
    }));
  }

  function handleChangeSelectSubCategory(e) {
    setAddArtikel((prev) => ({
      ...prev,
      id_subcategory: e,
    }));
  }

  function handleAddArticle() {
    dispatch(addArticleAction(addArtikel));
  }
  function onChangeTags(e) {
    setAddArtikel((prev) => ({
      ...prev,
      tags: e.map((p) => ({ id: p.id })),
    }));
  }
  useEffect(() => {
    if (kategory?.tagsList !== undefined) {
      setTags(
        kategory?.tagsList?.map((p) => ({
          value: p?.name,
          label: p?.name,
          id: p?.id,
        }))
      );
    }
  }, [kategory]);
  useEffect(() => {
    dispatch(getKategoryAction());
    dispatch(getSubKategoryAction());
    dispatch(getWriterListaction());
    dispatch(tagsListaction());
  }, []);
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
            <Breadcrumb.Item active>Tambah Artikel</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Tambah Artikel</h5>
          <Form.Label>Judul</Form.Label>
          <Form.Control
            className={`border`}
            required
            type="text"
            name="title"
            placeholder="Masukkan Judul"
            value={addArtikel.title}
            onChange={(e) => handleChange(e.target.value)}
          />

          <Form.Label style={{ marginTop: "10px" }}>Kategori</Form.Label>
          <Form.Select
            onChange={(e) => handleChangeSelect(e.target.value)}
            aria-label="Default select example"
          >
            {kategory?.kategoryList?.map((item, index) => (
              <option value={item?.id}>{item?.name}</option>
            ))}
          </Form.Select>

          <Form.Label style={{ marginTop: "10px" }}>Sub Kategori</Form.Label>
          <Form.Select
            onChange={(e) => handleChangeSelectSubCategory(e.target.value)}
            aria-label="Default select example"
          >
            {kategory?.subCategoryList?.map((item, index) => (
              <option value={item?.id}>{item?.name}</option>
            ))}
          </Form.Select>
          <Form.Label style={{ marginTop: "10px" }}>Penulis</Form.Label>
          <Form.Select
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleChangeSelectWrier(e.target.value)}
            aria-label="Default select example"
          >
            {kategory?.writerList?.map((item, index) => (
              <option value={item?.id}>{item?.fullname}</option>
            ))}
          </Form.Select>
          <Form.Label>Tags</Form.Label>
          <Select
            isMulti
            name="colors"
            options={tags}
            className="basic-multi-select mb-3"
            classNamePrefix="select"
            onChange={(e) => onChangeTags(e)}
          />
          <div className="form-group mb-2">
            <label htmlFor="isi">Kutipan</label>
            <ReactQuill
              modules={modules}
              theme="snow"
              value={addArtikel.konten}
              onChange={(e) => handleEditorChange(e)}
            />
          </div>
          <div className="mt-3">
            <Button onClick={handleAddArticle} variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default AddArticle;
