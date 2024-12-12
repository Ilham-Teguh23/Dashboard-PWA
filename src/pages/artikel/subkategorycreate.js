import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Form,
  Button,
} from "@themesberg/react-bootstrap";
import { addSubKategoryAction } from '../../redux/slices/kategorySlice';
import { useParams } from 'react-router-dom';



const KategoryCreate = () => {
    const param = useParams()

    const [addSubKategory, setaddKategory] = useState({
        name: '',
        id_admin: 1,
        id_article_category : param?.id,
    });



    const dispatch = useDispatch();
    
    
    function handleChange(e){
        setaddKategory((prev)=>({
            ...prev,
            'name': e
        }))
    }
    function handleAddKategory(){
        dispatch(addSubKategoryAction(addSubKategory));
    }
    return(
        <div
        style={{'display':'flex','flexDirection': 'column'}}
        >
            <Form.Label>Name</Form.Label>
                <Form.Control
                      className={
                        `border`
                         
                      }
                      required
                      type="text"
                      name="name"
                      placeholder="Nama Sub Kategory"
                      value={addSubKategory.name}
                      onChange={(e)=>handleChange(e.target.value)}
                />
            
               
                <div className="mt-3">
                <Button onClick={handleAddKategory} variant="primary" type="submit">
                    Simpan
                </Button>
            </div>
        </div>
    )
}
export default KategoryCreate