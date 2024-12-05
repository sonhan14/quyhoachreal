

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import ViewDetail from "./ViewDetail";
import { callFetchBookById } from "../../services/api";

const tableGroup = () => {
    // const [dataBook, setDataBook] = useState()
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    // useEffect(()=>{
    //     fetchBook(id);
    // },[id])

    // const fetchBook = async(id) => {
    //     const res = await callFetchBookById(id);
    //     if(res && res.data) {
    //         let raw = res.data;
    //         raw.items = getImages(raw);

    //         setDataBook(raw);

    //         // setTimeout(()=> {
    //         //     setDataBook(raw);

    //         // },3000)
    //     }
    // }

    console.log('databook',dataBook)
    return(
        <>
            <ViewDetail dataBook={dataBook}/>
        </>
    )
}

export default tableGroup;