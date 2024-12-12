import { Badge } from "@themesberg/react-bootstrap";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getArticleDetailAction } from '../../redux/slices/articleSlice';
import parse from 'html-react-parser'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faComment,
    faHeart
  } from "@fortawesome/free-solid-svg-icons";
const ArticleDetail = () => {
    const param = useParams();
    const dispatch = useDispatch();
    const articles = useSelector((state)=>state.article);
    const tags = [{name: 'tag1'}, {name: 'tag2'}, {name: 'tag3'}]
    console.log(articles?.articleDetail?.tags?.length)
    useEffect(()=>{
        dispatch(getArticleDetailAction({article_id: param.id}))
    }, [])
    return articles?.articleDetail !==undefined && !articles?.articleDetailLoading &&(
        <div
            style={{ 
                'display': 'flex',
                'flexDirection':'column'
             }}
        >
            <div
                style={{ 
                    'display': 'flex',
                    'flexDirection':'column'
                }}
            >
                <p style={{ 
                    'marginBottom':'0px', 
                    'fontSize':'42px', 
                    'fontWeight':'bold'
                }}>
                    {articles?.articleDetail?.detail?.title}
                </p>
                <div 
                    style={{ 
                        'display': 'flex',
                        'alignItems':'center',
                        'fontSize':'12px',
                        'marginTop':'8px',
                        'gap':'4px',
                        'marginBottom':'16px'
                    }}
                >
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{articles?.articleDetail?.detail?.created_at.substr(0, 10)}</span>
                    <FontAwesomeIcon icon={faComment} />
                    <span>0</span>
                    <FontAwesomeIcon icon={faHeart} />
                    <span>0</span>
                </div>
            </div>
            <div style={{ 
                'display': 'flex',
                'flexDirection':'column'
            }}>
                {articles?.articleDetail?.detail?.description !== undefined && 
                    <p style={{ 'marginTop':'0px' }}>{parse(articles?.articleDetail?.detail?.description)}</p>
                }
            </div>
            <div>
                <div style={{ 'display': 'flex', 'flexDirection': 'row' }} >
                    {articles?.articleDetail?.tags !== undefined && articles?.articleDetail?.tags?.length > 0?
                        <>
                            {articles?.articleDetail?.tags?.map((items, index)=>
                                <Badge 
                                    key={index}
                                    pill 
                                    bg={'warning'} 
                                >
                                    {items.name}
                                </Badge>
                            )}
                        </> :
                        <>
                            {tags?.map((items, index)=>
                                <Badge 
                                    key={index}
                                    pill
                                    bg={'warning'} 
                                    style={{ 'marginRight':'4px', 'padding':'4px 6px' }}
                                >
                                    {items.name}
                                </Badge>
                            )}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticleDetail;