import React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
import {
    Form,
    Button,
} from "@themesberg/react-bootstrap";
import EditorRte from "../../components/EditorRte";
import { editArticleAction, getArticleDetailAction } from '../../redux/slices/articleSlice';
import { getKategoryAction, getSubKategoryAction, getWriterListaction } from '../../redux/slices/kategorySlice';

const ArtikelUpdate = () => {
    const param = useParams();
    const [addArtikel, setAddArtikel] = useState({
        id_konten: param?.id,
        title: '',
        konten: '',
        image: [],
        id_category: '',
        id_subcategory: '',
        tags: [],
        admin_id: 12,
        writer_admin_id: '',
        status: 'Y'
    });
    const dispatch = useDispatch();
    const kategory = useSelector((state) => state.kategory);
    const articles = useSelector((state) => state.article);
    const [preview, setPreview] = useState();
    const onDrop = useCallback(acceptedFiles => {
        setAddArtikel((prev) => ({
            ...prev,
            // image: acceptedFiles[0]
        }))
        setPreview(acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    const handleEditorChange = (value) => {
        setAddArtikel((prev) => ({
            ...prev,
            'konten': value
        }))
    };
    const parseHTML = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
      };
    function handleChange(e) {

        setAddArtikel((prev) => ({
            ...prev,
            'title': e
        }))
    }

    function handleChangeSelect(e) {
        setAddArtikel((prev) => ({
            ...prev,
            'id_category': e
        }))
    }

    function handleChangeSelectWrier(e) {
        setAddArtikel((prev) => ({
            ...prev,
            'writer_admin_id': e
        }))
    }

    function handleChangeSelectSubCategory(e) {
        setAddArtikel((prev) => ({
            ...prev,
            'id_subcategory': e
        }))
    }

    function handleAddArticle() {
        dispatch(editArticleAction(addArtikel));
    }
    useEffect(() => {
        if (articles?.articleDetail?.detail !== undefined) {
            const kontenFromDatabase = articles.articleDetail.detail.konten;
            console.log("kontenFromDatabase:", kontenFromDatabase);

            setAddArtikel((prev) => ({
                ...prev,
                konten: kontenFromDatabase,
            }));
        }
    }, [articles]);

    useEffect(() => {
        if (articles?.articleDetail?.detail !== undefined) {
            setAddArtikel((prev) => ({
                ...prev,
                title: articles?.articleDetail?.detail?.title,
                konten: articles?.articleDetail?.detail?.description.toString()
            }))
        }
    }, [articles])
    useEffect(() => {
        dispatch(getArticleDetailAction({ article_id: param.id }))
        dispatch(getKategoryAction());
        dispatch(getSubKategoryAction());
        dispatch(getWriterListaction());
    }, [])
    return (
        <div
            style={{ 'display': 'flex', 'flexDirection': 'column' }}
        >
            <Form.Label>Judul</Form.Label>
            <Form.Control
                className={
                    `border`
                }
                required
                type="text"
                name="title"
                placeholder="Masukkan Judul"
                value={addArtikel.title}
                onChange={(e) => handleChange(e.target.value)}
            />
            <Form.Label class="mt-2">Kategori</Form.Label>
            <Form.Select onChange={(e) => handleChangeSelect(e.target.value)} aria-label="Default select example">
                {kategory?.kategoryList?.map((item, index) =>
                    <option value={item?.id}>{item?.name}</option>
                )}
            </Form.Select>
            <Form.Label class="mt-2">Sub Kategory</Form.Label>
            <Form.Select class="mt-2" onChange={(e) => handleChangeSelectSubCategory(e.target.value)} aria-label="Default select example">
                {kategory?.subCategoryList?.map((item, index) =>
                    <option value={item?.id}>{item?.name}</option>
                )}
            </Form.Select>
            <Form.Select style={{ marginTop: '20px' }} onChange={(e) => handleChangeSelectWrier(e.target.value)} aria-label="Default select example">
                {/* ngambil state di slice */}
                {kategory?.writerList?.map((item, index) =>
                    <option value={item?.id}>{item?.fullname}</option>
                )}
            </Form.Select>
            <Form.Group className="mb-3">
                <Form.Label>Kutipan</Form.Label>
                {articles?.articleDetail?.detail?.description !== undefined && (
                    <>
                        <EditorRte
                            defaultValue={articles?.articleDetail?.detail?.description}
                            onChange={(value) => handleEditorChange(value)}
                        />
                    </>
                )}
            </Form.Group>

            <p>Pilih Gambar (Optional)</p>
            <div display={'inline-flex'} flexDirection={'row'} w={'100%'}>
                <div {...getRootProps()} style={{ 'borderColor': 'rgb(226, 232, 240)', 'color': '#C9C9C9', 'borderWidth': '1px', 'padding': '6px', 'cursor': 'pointer', 'height': '40px', 'width': '10%', 'borderRadius': '5px', 'borderBottomRightRadius': '0px', 'borderTopRightRadius': '0px' }}>
                    <input {...getInputProps()} />
                    {
                        <p>Choose File</p>
                    }
                </div>
                <input _disabled={{ 'opacity': 1, 'cursor': 'default' }} objectFit={'fill'} disabled type='image' alt="" src={preview !== undefined ? preview[0]?.preview : ''} placeholder='No File Chosen' borderTopLeftRadius={'0px'} borderBottomLeftRadius={'0px'} w={'65%'} height={preview !== undefined && '400px'} p={0} />
            </div>
            <div className="mt-3">
                <Button onClick={handleAddArticle} variant="primary" type="submit">
                    Simpan
                </Button>
            </div>
        </div>
    )
}
export default ArtikelUpdate