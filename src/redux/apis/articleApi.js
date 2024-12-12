import axios from "axios"
const url = process.env.REACT_APP_API_TNOSWORLD_URL

export const getArticles = async (config)=>{
    try{
        // const response = await axios.get(`${url}/article/konten/all/${config.page}/${config.view}/${config.status}`);
        const response = await axios.get(`https://api.tnosworld.id/article/konten/all/1/265/Y`);
        console.log(response);
        return response;
    } catch(err){
        return err;
    }
}
export const getArticleDetail = async (config)=>{
    try{
        const response = await axios.get(`${url}/article/detail/${config.article_id}`);
        return response;
    } catch(err){
        return err;
    }
}

export const deleteArticle = async (config) => {
    try {
        const response = await axios.delete(`${url}/article/delete/${config.article_id}`)
        return response;
    } catch (err) {
        return err;
    }
}

export const addArticle = async(config)=>{
    const data = new FormData();
    data.set('image', JSON.stringify([]));
    data.set('konten', config.konten);
    data.set('title', config.title);
    data.set('id_category', config.id_category);
    data.set('id_subcategory', config.id_subcategory);
    data.set('tags', JSON.stringify(config.tags));
    data.set('admin_id', config.admin_id);
    data.set('status', config.status);
    data.set('writer_admin_id', config.writer_admin_id);
    try{
        const response = await axios.post(`${url}/article/konten/add`, config);
        return response;
    } catch(err){
        return err;
    }
}
export const updateArticle = async(config)=>{
    const data = new FormData();
    data.set('image', config.image);
    data.set('konten', config.konten);
    data.set('title', config.title);
    data.set('category_id', config.category_id);
    data.set('subcategory_id', config.subcategory_id);
    data.set('tags', config.tags);
    data.set('admin_id', config.admin_id);
    data.set('status', config.status);
    data.set('writer_name', config?.writer_name);
    try{
        const response = await axios.post(`${url}/article/konten/edit`, config);
        return response;
    } catch(err){
        return err;
    }
}