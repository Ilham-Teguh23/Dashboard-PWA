import axios from "axios"
const url = process.env.REACT_APP_API_TNOSWORLD_URL


export const getKategory = async (config)=>{
    try{
        const response = await axios.get(`${url}/article/category/all`);
        return response;
    } catch(err){
        return err;
    }
}

export const getSubKategory = async (config)=>{
    try{
        const response = await axios.get(`${url}/article/subcategory/all`);
        return response;
    } catch(err){
        return err;
    }
}

export const getWriterLists = async (config)=>{
    try{
        const response = await axios.get(`${url}/article/writer/list`);
        return response;
    } catch(err){
        return err;
    }
}

export const addKategory = async(config)=>{
    try{
        const response = await axios.post(`${url}/article/category/add`, config);
        return response;
    } catch(err){
        return err;
    }
}

export const addSubKategory = async(config)=>{
    try{
        const response = await axios.post(`${url}/article/subcategory/add`, config);
        return response;
    } catch(err){
        return err;
    }
}


export const tagsLists = async (config)=>{
    try{
        const response = await axios.get(`${url}/article/tag/all`);
        return response;
    } catch(err){
        return err;
    }
}

export const addTagsApi = async(config)=>{
    try{
        const response = await axios.post(`${url}/article/tag/add`, config);
        return response;
    } catch(err){
        return err;
    }
}


