import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { callFetchPostById } from "../../services/api";
import PostDetail from "./PostDetail";

const PostPage = () => {
    const [dataPost, setDataPost] = useState([])
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');
    console.log("id raw :",id);



    useEffect(()=>{
        fetchPost(id);
    },[id])

    const fetchPost = async(id) => {
        const res = await callFetchPostById(id);
        if(res) {
            console.log("raw:",res);
            setDataPost(res);

            // setTimeout(()=> {
            //     setDataPost(raw);

            // },3000)
        }
    }

    const getImages = (raw) => {
        const images = [];
        if(raw.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                }
            )
        }
        if(raw.slider) {
            raw.slider?.map((item)=>{
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: 'original-image',
                        thumbnailClass: 'thumbnail-image',
                    }
                )
            })
        }
        return images;
    }
    console.log('dataPost',dataPost)
    return(
        <>
            <PostDetail dataPost={dataPost}/>
        </>
    )
}

export default PostPage;