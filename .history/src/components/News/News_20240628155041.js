
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./News.scss"
import { useEffect,useRef, useState } from "react";
import { ViewlistBox, ViewlistPost } from "../../services/api";
import { useNavigate } from "react-router-dom";
import ModalCreatePost from "./createPost/ModalCreatePost";
const News = (props) => {
    const navigate = useNavigate();
    const [listViewBox, setListViewBox] = useState([])
    const [listViewPost, setListViewPost] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const textareaRef = useRef(null);
    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '40px';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    useEffect(()=>{
        getListViewBox();
        getListViewPost();
    },[])

    const handleClose = () => {
        setIsShowModalLogin(false);
    }

    const getListViewBox = async() => {
        let res = await ViewlistBox()
        if(res && res?.data) {
            setListViewBox(res.data);
        }
        console.log("res viewBox",res)
    }

    const getListViewPost = async() => {
        let res = await ViewlistPost()
        if(res && res?.data) {
            setListViewPost(res.data);
        }
        console.log("res viewPost",res)
    }
    console.log("listViewPost",listViewPost)

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectPost = (post) => {
        const slug = convertSlug(post.Title);
        navigate(`/news/${slug}?id=${post.PostID}`)
    }

    return (
        <>
            <Container className="news-container">
              <Row className="news-row">
                <Col className="news-col-left">
                    <div className="news-hot">
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16046 1.29732C9.55452 0.68838 10.4455 0.68838 10.8395 1.29732L11.7217 2.66053C11.9789 3.05794 12.4795 3.22058 12.9211 3.05024L14.4361 2.46591C15.1128 2.2049 15.8336 2.72859 15.7945 3.45285L15.7069 5.07425C15.6814 5.54692 15.9908 5.97274 16.4482 6.09452L18.0173 6.51227C18.7182 6.69888 18.9935 7.54622 18.5362 8.10917L17.5123 9.36944C17.2138 9.73683 17.2138 10.2632 17.5123 10.6306L18.5362 11.8908C18.9935 12.4538 18.7182 13.3011 18.0173 13.4877L16.4482 13.9055C15.9908 14.0273 15.6814 14.4531 15.7069 14.9257L15.7945 16.5471C15.8336 17.2714 15.1128 17.7951 14.4361 17.5341L12.9211 16.9498C12.4795 16.7794 11.9789 16.9421 11.7217 17.3395L10.8395 18.7027C10.4455 19.3116 9.55452 19.3116 9.16046 18.7027L8.27828 17.3395C8.0211 16.9421 7.52052 16.7794 7.07887 16.9498L5.56389 17.5341C4.88716 17.7951 4.16637 17.2714 4.20549 16.5471L4.29306 14.9257C4.31859 14.4531 4.00922 14.0273 3.55179 13.9055L1.98269 13.4877C1.28178 13.3011 1.00646 12.4538 1.46383 11.8908L2.48771 10.6306C2.78619 10.2632 2.78619 9.73683 2.48771 9.36944L1.46382 8.10917C1.00646 7.54622 1.28178 6.69888 1.98269 6.51227L3.55179 6.09452C4.00922 5.97274 4.31859 5.54692 4.29306 5.07425L4.20549 3.45285C4.16637 2.72859 4.88716 2.2049 5.56389 2.46591L7.07887 3.05024C7.52052 3.22058 8.0211 3.05794 8.27828 2.66053L9.16046 1.29732Z" fill="#0ECC8D"/>
                                <path d="M4.462 12V8.088H5.368L6.388 10.032L6.772 10.896H6.796C6.78 10.688 6.758 10.456 6.73 10.2C6.702 9.944 6.688 9.7 6.688 9.468V8.088H7.528V12H6.622L5.602 10.05L5.218 9.198H5.194C5.214 9.414 5.236 9.646 5.26 9.894C5.288 10.142 5.302 10.382 5.302 10.614V12H4.462ZM9.71223 12.072C9.42823 12.072 9.17223 12.01 8.94423 11.886C8.71623 11.762 8.53623 11.584 8.40423 11.352C8.27223 11.12 8.20623 10.84 8.20623 10.512C8.20623 10.188 8.27223 9.91 8.40423 9.678C8.54023 9.446 8.71623 9.268 8.93223 9.144C9.14823 9.016 9.37423 8.952 9.61023 8.952C9.89423 8.952 10.1282 9.016 10.3122 9.144C10.5002 9.268 10.6402 9.438 10.7322 9.654C10.8282 9.866 10.8762 10.108 10.8762 10.38C10.8762 10.456 10.8722 10.532 10.8642 10.608C10.8562 10.68 10.8482 10.734 10.8402 10.77H9.05823C9.09823 10.986 9.18823 11.146 9.32823 11.25C9.46823 11.35 9.63623 11.4 9.83223 11.4C10.0442 11.4 10.2582 11.334 10.4742 11.202L10.7682 11.736C10.6162 11.84 10.4462 11.922 10.2582 11.982C10.0702 12.042 9.88823 12.072 9.71223 12.072ZM9.05223 10.188H10.1262C10.1262 10.024 10.0862 9.89 10.0062 9.786C9.93023 9.678 9.80423 9.624 9.62823 9.624C9.49223 9.624 9.37023 9.672 9.26223 9.768C9.15423 9.86 9.08423 10 9.05223 10.188ZM11.9485 12L11.2045 9.024H12.0805L12.3685 10.404C12.3925 10.552 12.4145 10.698 12.4345 10.842C12.4545 10.986 12.4765 11.134 12.5005 11.286H12.5245C12.5525 11.134 12.5785 10.984 12.6025 10.836C12.6305 10.688 12.6625 10.544 12.6985 10.404L13.0285 9.024H13.7905L14.1265 10.404C14.1625 10.552 14.1945 10.698 14.2225 10.842C14.2545 10.986 14.2845 11.134 14.3125 11.286H14.3365C14.3645 11.134 14.3865 10.986 14.4025 10.842C14.4225 10.698 14.4465 10.552 14.4745 10.404L14.7565 9.024H15.5725L14.8585 12H13.8265L13.5565 10.812C13.5285 10.672 13.5005 10.532 13.4725 10.392C13.4485 10.252 13.4225 10.102 13.3945 9.942H13.3705C13.3425 10.102 13.3165 10.252 13.2925 10.392C13.2725 10.532 13.2485 10.672 13.2205 10.812L12.9565 12H11.9485Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">Tin mới nhất</h2>
                                <p className="news-hot-desc">Find the latest update</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.72134 11.4503L9 13.8905C9.22611 14.1259 9.64018 13.9547 9.64018 13.6338V11.4718L11.4491 11.4717C12.4357 11.4717 13.2373 10.6372 13.2373 9.6102L13.2375 1.86147C13.2375 0.834468 12.4358 0 11.4492 0H1.78827C0.801653 0 0 0.834468 0 1.86147V9.58881C0 10.6158 0.801653 11.4503 1.78827 11.4503L6.72134 11.4503ZM4.11094 4.42909L5.71424 4.30073L6.33093 2.73882C6.45424 2.43927 6.84481 2.43927 6.94763 2.73882L7.56432 4.30073L9.16763 4.42909C9.4759 4.45043 9.59936 4.83566 9.35259 5.04951L8.1192 6.1407L8.50979 7.76681C8.59195 8.06635 8.26317 8.32308 7.99591 8.15187L6.61871 7.27457L5.24151 8.15187C4.97425 8.32306 4.66597 8.06635 4.72763 7.76681L5.11822 6.1407L3.88483 5.04951C3.67922 4.85698 3.80252 4.45056 4.11094 4.42909ZM15.5602 3.10254C15.108 3.10254 14.7381 2.71747 14.7381 2.24675C14.7381 1.77602 15.108 1.39096 15.5602 1.39096H19.1779C19.6301 1.39096 20 1.77602 20 2.24675C20 2.71747 19.6301 3.10254 19.1779 3.10254H15.5602ZM14.7585 5.64877C14.7585 5.17805 15.1285 4.79298 15.5807 4.79298H18.2529C18.7051 4.79298 19.075 5.17805 19.075 5.64877C19.075 6.1195 18.7051 6.50456 18.2529 6.50456H15.5602C15.108 6.50456 14.7585 6.1195 14.7585 5.64877ZM14.7585 9.0508C14.7585 8.58007 15.1285 8.19501 15.5807 8.19501H17.2046C17.6568 8.19501 18.0267 8.58007 18.0267 9.0508C18.0267 9.52152 17.6568 9.90658 17.2046 9.90658H15.5601C15.1079 9.90658 14.7585 9.52152 14.7585 9.0508Z" fill="#EEA956"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">Tin hot trong ngày</h2>
                                <p className="news-hot-desc">Shots featured today by curators</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 5C13 2.79066 11.2089 1 9 1C6.79109 1 5 2.79066 5 5C5 7.20934 6.79109 9 9 9C11.2089 9 13 7.20934 13 5Z" fill="#FF6934"/>
                            <path d="M12 9C11.2357 9.5784 10.0266 10 9 10C7.95345 10 6.7718 9.59874 6 9C1.10197 10.179 0.910523 14.2341 1.0085 17.979C1.0247 18.5984 1.3724 19.0001 2 19.0001L11 19V16.0001C11 14.9814 11.307 14.0001 13 14.0001L16.5 14C16.5 11 14.5 9 12 9Z" fill="#FF6934"/>
                            <path d="M13 17H19M19 17L17.5 15.5M19 17L17.5 18.5" stroke="#FF6934" strokeLinecap="round" stroke-linejoin="round"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">Người theo dõi</h2>
                                <p className="news-hot-desc">Explore from your favorite person</p>
                            </div>
                        </div>
                    </div>
    
                    <div className="tag-oustanding">
                        <h2 className="tags-title">Tags nổi bật</h2>
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16046 1.29732C9.55452 0.68838 10.4455 0.68838 10.8395 1.29732L11.7217 2.66053C11.9789 3.05794 12.4795 3.22058 12.9211 3.05024L14.4361 2.46591C15.1128 2.2049 15.8336 2.72859 15.7945 3.45285L15.7069 5.07425C15.6814 5.54692 15.9908 5.97274 16.4482 6.09452L18.0173 6.51227C18.7182 6.69888 18.9935 7.54622 18.5362 8.10917L17.5123 9.36944C17.2138 9.73683 17.2138 10.2632 17.5123 10.6306L18.5362 11.8908C18.9935 12.4538 18.7182 13.3011 18.0173 13.4877L16.4482 13.9055C15.9908 14.0273 15.6814 14.4531 15.7069 14.9257L15.7945 16.5471C15.8336 17.2714 15.1128 17.7951 14.4361 17.5341L12.9211 16.9498C12.4795 16.7794 11.9789 16.9421 11.7217 17.3395L10.8395 18.7027C10.4455 19.3116 9.55452 19.3116 9.16046 18.7027L8.27828 17.3395C8.0211 16.9421 7.52052 16.7794 7.07887 16.9498L5.56389 17.5341C4.88716 17.7951 4.16637 17.2714 4.20549 16.5471L4.29306 14.9257C4.31859 14.4531 4.00922 14.0273 3.55179 13.9055L1.98269 13.4877C1.28178 13.3011 1.00646 12.4538 1.46383 11.8908L2.48771 10.6306C2.78619 10.2632 2.78619 9.73683 2.48771 9.36944L1.46382 8.10917C1.00646 7.54622 1.28178 6.69888 1.98269 6.51227L3.55179 6.09452C4.00922 5.97274 4.31859 5.54692 4.29306 5.07425L4.20549 3.45285C4.16637 2.72859 4.88716 2.2049 5.56389 2.46591L7.07887 3.05024C7.52052 3.22058 8.0211 3.05794 8.27828 2.66053L9.16046 1.29732Z" fill="#0ECC8D"/>
                                <path d="M4.462 12V8.088H5.368L6.388 10.032L6.772 10.896H6.796C6.78 10.688 6.758 10.456 6.73 10.2C6.702 9.944 6.688 9.7 6.688 9.468V8.088H7.528V12H6.622L5.602 10.05L5.218 9.198H5.194C5.214 9.414 5.236 9.646 5.26 9.894C5.288 10.142 5.302 10.382 5.302 10.614V12H4.462ZM9.71223 12.072C9.42823 12.072 9.17223 12.01 8.94423 11.886C8.71623 11.762 8.53623 11.584 8.40423 11.352C8.27223 11.12 8.20623 10.84 8.20623 10.512C8.20623 10.188 8.27223 9.91 8.40423 9.678C8.54023 9.446 8.71623 9.268 8.93223 9.144C9.14823 9.016 9.37423 8.952 9.61023 8.952C9.89423 8.952 10.1282 9.016 10.3122 9.144C10.5002 9.268 10.6402 9.438 10.7322 9.654C10.8282 9.866 10.8762 10.108 10.8762 10.38C10.8762 10.456 10.8722 10.532 10.8642 10.608C10.8562 10.68 10.8482 10.734 10.8402 10.77H9.05823C9.09823 10.986 9.18823 11.146 9.32823 11.25C9.46823 11.35 9.63623 11.4 9.83223 11.4C10.0442 11.4 10.2582 11.334 10.4742 11.202L10.7682 11.736C10.6162 11.84 10.4462 11.922 10.2582 11.982C10.0702 12.042 9.88823 12.072 9.71223 12.072ZM9.05223 10.188H10.1262C10.1262 10.024 10.0862 9.89 10.0062 9.786C9.93023 9.678 9.80423 9.624 9.62823 9.624C9.49223 9.624 9.37023 9.672 9.26223 9.768C9.15423 9.86 9.08423 10 9.05223 10.188ZM11.9485 12L11.2045 9.024H12.0805L12.3685 10.404C12.3925 10.552 12.4145 10.698 12.4345 10.842C12.4545 10.986 12.4765 11.134 12.5005 11.286H12.5245C12.5525 11.134 12.5785 10.984 12.6025 10.836C12.6305 10.688 12.6625 10.544 12.6985 10.404L13.0285 9.024H13.7905L14.1265 10.404C14.1625 10.552 14.1945 10.698 14.2225 10.842C14.2545 10.986 14.2845 11.134 14.3125 11.286H14.3365C14.3645 11.134 14.3865 10.986 14.4025 10.842C14.4225 10.698 14.4465 10.552 14.4745 10.404L14.7565 9.024H15.5725L14.8585 12H13.8265L13.5565 10.812C13.5285 10.672 13.5005 10.532 13.4725 10.392C13.4485 10.252 13.4225 10.102 13.3945 9.942H13.3705C13.3425 10.102 13.3165 10.252 13.2925 10.392C13.2725 10.532 13.2485 10.672 13.2205 10.812L12.9565 12H11.9485Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#HaNoi</h2>
                                <p className="news-hot-desc">82,645 Bài đăng từ tag</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.72134 11.4503L9 13.8905C9.22611 14.1259 9.64018 13.9547 9.64018 13.6338V11.4718L11.4491 11.4717C12.4357 11.4717 13.2373 10.6372 13.2373 9.6102L13.2375 1.86147C13.2375 0.834468 12.4358 0 11.4492 0H1.78827C0.801653 0 0 0.834468 0 1.86147V9.58881C0 10.6158 0.801653 11.4503 1.78827 11.4503L6.72134 11.4503ZM4.11094 4.42909L5.71424 4.30073L6.33093 2.73882C6.45424 2.43927 6.84481 2.43927 6.94763 2.73882L7.56432 4.30073L9.16763 4.42909C9.4759 4.45043 9.59936 4.83566 9.35259 5.04951L8.1192 6.1407L8.50979 7.76681C8.59195 8.06635 8.26317 8.32308 7.99591 8.15187L6.61871 7.27457L5.24151 8.15187C4.97425 8.32306 4.66597 8.06635 4.72763 7.76681L5.11822 6.1407L3.88483 5.04951C3.67922 4.85698 3.80252 4.45056 4.11094 4.42909ZM15.5602 3.10254C15.108 3.10254 14.7381 2.71747 14.7381 2.24675C14.7381 1.77602 15.108 1.39096 15.5602 1.39096H19.1779C19.6301 1.39096 20 1.77602 20 2.24675C20 2.71747 19.6301 3.10254 19.1779 3.10254H15.5602ZM14.7585 5.64877C14.7585 5.17805 15.1285 4.79298 15.5807 4.79298H18.2529C18.7051 4.79298 19.075 5.17805 19.075 5.64877C19.075 6.1195 18.7051 6.50456 18.2529 6.50456H15.5602C15.108 6.50456 14.7585 6.1195 14.7585 5.64877ZM14.7585 9.0508C14.7585 8.58007 15.1285 8.19501 15.5807 8.19501H17.2046C17.6568 8.19501 18.0267 8.58007 18.0267 9.0508C18.0267 9.52152 17.6568 9.90658 17.2046 9.90658H15.5601C15.1079 9.90658 14.7585 9.52152 14.7585 9.0508Z" fill="#EEA956"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#HCM</h2>
                                <p className="news-hot-desc">65,523 Bài đăng từ tag</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 5C13 2.79066 11.2089 1 9 1C6.79109 1 5 2.79066 5 5C5 7.20934 6.79109 9 9 9C11.2089 9 13 7.20934 13 5Z" fill="#FF6934"/>
                            <path d="M12 9C11.2357 9.5784 10.0266 10 9 10C7.95345 10 6.7718 9.59874 6 9C1.10197 10.179 0.910523 14.2341 1.0085 17.979C1.0247 18.5984 1.3724 19.0001 2 19.0001L11 19V16.0001C11 14.9814 11.307 14.0001 13 14.0001L16.5 14C16.5 11 14.5 9 12 9Z" fill="#FF6934"/>
                            <path d="M13 17H19M19 17L17.5 15.5M19 17L17.5 18.5" stroke="#FF6934" strokeLinecap="round" stroke-linejoin="round"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#Daugia</h2>
                                <p className="news-hot-desc">85,523 Bài đăng từ tag</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16046 1.29732C9.55452 0.68838 10.4455 0.68838 10.8395 1.29732L11.7217 2.66053C11.9789 3.05794 12.4795 3.22058 12.9211 3.05024L14.4361 2.46591C15.1128 2.2049 15.8336 2.72859 15.7945 3.45285L15.7069 5.07425C15.6814 5.54692 15.9908 5.97274 16.4482 6.09452L18.0173 6.51227C18.7182 6.69888 18.9935 7.54622 18.5362 8.10917L17.5123 9.36944C17.2138 9.73683 17.2138 10.2632 17.5123 10.6306L18.5362 11.8908C18.9935 12.4538 18.7182 13.3011 18.0173 13.4877L16.4482 13.9055C15.9908 14.0273 15.6814 14.4531 15.7069 14.9257L15.7945 16.5471C15.8336 17.2714 15.1128 17.7951 14.4361 17.5341L12.9211 16.9498C12.4795 16.7794 11.9789 16.9421 11.7217 17.3395L10.8395 18.7027C10.4455 19.3116 9.55452 19.3116 9.16046 18.7027L8.27828 17.3395C8.0211 16.9421 7.52052 16.7794 7.07887 16.9498L5.56389 17.5341C4.88716 17.7951 4.16637 17.2714 4.20549 16.5471L4.29306 14.9257C4.31859 14.4531 4.00922 14.0273 3.55179 13.9055L1.98269 13.4877C1.28178 13.3011 1.00646 12.4538 1.46383 11.8908L2.48771 10.6306C2.78619 10.2632 2.78619 9.73683 2.48771 9.36944L1.46382 8.10917C1.00646 7.54622 1.28178 6.69888 1.98269 6.51227L3.55179 6.09452C4.00922 5.97274 4.31859 5.54692 4.29306 5.07425L4.20549 3.45285C4.16637 2.72859 4.88716 2.2049 5.56389 2.46591L7.07887 3.05024C7.52052 3.22058 8.0211 3.05794 8.27828 2.66053L9.16046 1.29732Z" fill="#0ECC8D"/>
                                <path d="M4.462 12V8.088H5.368L6.388 10.032L6.772 10.896H6.796C6.78 10.688 6.758 10.456 6.73 10.2C6.702 9.944 6.688 9.7 6.688 9.468V8.088H7.528V12H6.622L5.602 10.05L5.218 9.198H5.194C5.214 9.414 5.236 9.646 5.26 9.894C5.288 10.142 5.302 10.382 5.302 10.614V12H4.462ZM9.71223 12.072C9.42823 12.072 9.17223 12.01 8.94423 11.886C8.71623 11.762 8.53623 11.584 8.40423 11.352C8.27223 11.12 8.20623 10.84 8.20623 10.512C8.20623 10.188 8.27223 9.91 8.40423 9.678C8.54023 9.446 8.71623 9.268 8.93223 9.144C9.14823 9.016 9.37423 8.952 9.61023 8.952C9.89423 8.952 10.1282 9.016 10.3122 9.144C10.5002 9.268 10.6402 9.438 10.7322 9.654C10.8282 9.866 10.8762 10.108 10.8762 10.38C10.8762 10.456 10.8722 10.532 10.8642 10.608C10.8562 10.68 10.8482 10.734 10.8402 10.77H9.05823C9.09823 10.986 9.18823 11.146 9.32823 11.25C9.46823 11.35 9.63623 11.4 9.83223 11.4C10.0442 11.4 10.2582 11.334 10.4742 11.202L10.7682 11.736C10.6162 11.84 10.4462 11.922 10.2582 11.982C10.0702 12.042 9.88823 12.072 9.71223 12.072ZM9.05223 10.188H10.1262C10.1262 10.024 10.0862 9.89 10.0062 9.786C9.93023 9.678 9.80423 9.624 9.62823 9.624C9.49223 9.624 9.37023 9.672 9.26223 9.768C9.15423 9.86 9.08423 10 9.05223 10.188ZM11.9485 12L11.2045 9.024H12.0805L12.3685 10.404C12.3925 10.552 12.4145 10.698 12.4345 10.842C12.4545 10.986 12.4765 11.134 12.5005 11.286H12.5245C12.5525 11.134 12.5785 10.984 12.6025 10.836C12.6305 10.688 12.6625 10.544 12.6985 10.404L13.0285 9.024H13.7905L14.1265 10.404C14.1625 10.552 14.1945 10.698 14.2225 10.842C14.2545 10.986 14.2845 11.134 14.3125 11.286H14.3365C14.3645 11.134 14.3865 10.986 14.4025 10.842C14.4225 10.698 14.4465 10.552 14.4745 10.404L14.7565 9.024H15.5725L14.8585 12H13.8265L13.5565 10.812C13.5285 10.672 13.5005 10.532 13.4725 10.392C13.4485 10.252 13.4225 10.102 13.3945 9.942H13.3705C13.3425 10.102 13.3165 10.252 13.2925 10.392C13.2725 10.532 13.2485 10.672 13.2205 10.812L12.9565 12H11.9485Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#HaNoi</h2>
                                <p className="news-hot-desc">82,645 Bài đăng từ tag</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.72134 11.4503L9 13.8905C9.22611 14.1259 9.64018 13.9547 9.64018 13.6338V11.4718L11.4491 11.4717C12.4357 11.4717 13.2373 10.6372 13.2373 9.6102L13.2375 1.86147C13.2375 0.834468 12.4358 0 11.4492 0H1.78827C0.801653 0 0 0.834468 0 1.86147V9.58881C0 10.6158 0.801653 11.4503 1.78827 11.4503L6.72134 11.4503ZM4.11094 4.42909L5.71424 4.30073L6.33093 2.73882C6.45424 2.43927 6.84481 2.43927 6.94763 2.73882L7.56432 4.30073L9.16763 4.42909C9.4759 4.45043 9.59936 4.83566 9.35259 5.04951L8.1192 6.1407L8.50979 7.76681C8.59195 8.06635 8.26317 8.32308 7.99591 8.15187L6.61871 7.27457L5.24151 8.15187C4.97425 8.32306 4.66597 8.06635 4.72763 7.76681L5.11822 6.1407L3.88483 5.04951C3.67922 4.85698 3.80252 4.45056 4.11094 4.42909ZM15.5602 3.10254C15.108 3.10254 14.7381 2.71747 14.7381 2.24675C14.7381 1.77602 15.108 1.39096 15.5602 1.39096H19.1779C19.6301 1.39096 20 1.77602 20 2.24675C20 2.71747 19.6301 3.10254 19.1779 3.10254H15.5602ZM14.7585 5.64877C14.7585 5.17805 15.1285 4.79298 15.5807 4.79298H18.2529C18.7051 4.79298 19.075 5.17805 19.075 5.64877C19.075 6.1195 18.7051 6.50456 18.2529 6.50456H15.5602C15.108 6.50456 14.7585 6.1195 14.7585 5.64877ZM14.7585 9.0508C14.7585 8.58007 15.1285 8.19501 15.5807 8.19501H17.2046C17.6568 8.19501 18.0267 8.58007 18.0267 9.0508C18.0267 9.52152 17.6568 9.90658 17.2046 9.90658H15.5601C15.1079 9.90658 14.7585 9.52152 14.7585 9.0508Z" fill="#EEA956"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#HCM</h2>
                                <p className="news-hot-desc">65,523 Bài đăng từ tag</p>
                            </div>
                        </div>
    
                        <div className="news-hot-item">
                            <div className="news-hot-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 5C13 2.79066 11.2089 1 9 1C6.79109 1 5 2.79066 5 5C5 7.20934 6.79109 9 9 9C11.2089 9 13 7.20934 13 5Z" fill="#FF6934"/>
                            <path d="M12 9C11.2357 9.5784 10.0266 10 9 10C7.95345 10 6.7718 9.59874 6 9C1.10197 10.179 0.910523 14.2341 1.0085 17.979C1.0247 18.5984 1.3724 19.0001 2 19.0001L11 19V16.0001C11 14.9814 11.307 14.0001 13 14.0001L16.5 14C16.5 11 14.5 9 12 9Z" fill="#FF6934"/>
                            <path d="M13 17H19M19 17L17.5 15.5M19 17L17.5 18.5" stroke="#FF6934" strokeLinecap="round" stroke-linejoin="round"/>
                            </svg>
    
                            </div>
                            <div className="news-hot-content">
                                <h2 className="news-hot-title">#Daugia</h2>
                                <p className="news-hot-desc">85,523 Bài đăng từ tag</p>
                            </div>
                        </div>
                    </div>
    
    
                    <div className="tag-oustanding">
                        <h2 className="tags-title">List Box</h2>
    
                        {
                            listViewBox && listViewBox.length > 0 && listViewBox.map((item, index) => {
                                return (
                                    <div className="news-hot-item" key={`listbox-${index}`}>
                                        <div className="news-hot-icon">
                                            <img className="news-hot-icon-img" src={item.avatarLink}/>
                                        </div>
                                        <div className="news-hot-content">
                                            <h2 className="news-hot-title">{item.BoxName}</h2>
                                            <p className="news-hot-desc">{item.Description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                                
                    </div>
                    
                </Col>
                <Col className="content-center" xs={6}>
                    <div className="post-new">
                        <div className="post-new-avatar">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 5C13 2.79066 11.2089 1 9 1C6.79109 1 5 2.79066 5 5C5 7.20934 6.79109 9 9 9C11.2089 9 13 7.20934 13 5Z" fill="#FF6934"/>
                                <path d="M12 9C11.2357 9.5784 10.0266 10 9 10C7.95345 10 6.7718 9.59874 6 9C1.10197 10.179 0.910523 14.2341 1.0085 17.979C1.0247 18.5984 1.3724 19.0001 2 19.0001L11 19V16.0001C11 14.9814 11.307 14.0001 13 14.0001L16.5 14C16.5 11 14.5 9 12 9Z" fill="#FF6934"/>
                                <path d="M13 17H19M19 17L17.5 15.5M19 17L17.5 18.5" stroke="#FF6934" strokeLinecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <textarea
                            className="post-new-input"
                            placeholder="Bạn đang nghĩ gì?"
                            value={inputValue}
                            onChange={handleInputChange}
                            ref={textareaRef}
                            onClick={(e)=>{
                                event.preventDefault()
                                setIsShowModalLogin(true)
                            }}
                            style={{cursor:'pointer'}}
                        ></textarea>
                        <button onClick={()=>setIsShowModalLogin(true)} className="post-new-btn">Đăng bài</button>
                    </div>
    
                    {listViewPost && listViewPost.length > 0 && 
                        listViewPost.map((post, index)=>{
                            return (
                                <div className="post-item" style={{cursor:'pointer'}}  onClick={() => handleRedirectPost(post)}>
                                    <div className="avatar-post">
                                    </div>
                                    <div className="content-post">
                                        <div className="title-post">
                                            <h2>{`[${post.Title}] ${post.Content}`}</h2>
                                            <div className="like-post">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.28472 1.28635C0.582052 2.41945 -0.738149 6.24881 0.391497 9.59912C2.20862 14.9716 10.0014 19 10.0014 19C10.0014 19 17.8521 14.9096 19.6102 9.59912C20.7388 6.24881 19.4102 2.41945 15.7075 1.28635C13.762 0.693293 11.5332 1.07333 10.0014 2.19843C8.38219 1.04133 6.23239 0.689293 4.28472 1.28635ZM13.7574 4.27342C13.3561 4.17072 12.9476 4.41276 12.8448 4.81404C12.7421 5.21532 12.9842 5.62388 13.3855 5.72658C14.768 6.08042 15.5877 7.00903 15.6825 7.93366C15.7247 8.34572 16.093 8.64549 16.5051 8.60323C16.9171 8.56097 17.2169 8.19267 17.1747 7.78062C16.9982 6.06045 15.5644 4.73591 13.7574 4.27342Z" fill="#C5D0E6"/>
                                            </svg>
    
                                            </div>
                                        </div>
                                        <div className="hagtags-post">
                                            <div className="hagtags-pos-item">#hieuche</div>
                                            <div className="hagtags-pos-item">#dinhdung</div>
                                            <div className="hagtags-pos-item">#chesun</div>
                                        </div>
                                        <div className="user-post">
                                            <div className="info-user-post">
                                                <div className="avatar-user">
                                                </div>
                                                <div className="info-user">
                                                    <h4>Mai Ngo</h4>
                                                    <p>3 days ago</p>
                                                </div>
                                            </div>
                                            <div className="react-post">
                                                <p>651,324 Views</p>
                                                <p>51,324 Likes</p>
                                                <p>65 Comments</p>
                                            </div>
    
                                        </div>
    
                                    </div>
                                </div>
                            )
                        })
                    }
                </Col>
                <Col className="content-right">
                    <div className="old-post-right">
                        <div className="old-post-title">
                            <h2>Bài đăng khác/cũ</h2>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                        <div className="old-post-item">
                            <div className="old-post-avatar">
    
                            </div>
    
                            <div className="old-post-content">
                                <div className="old-post-content-title">
                                    <h2>Chia sẻ những kinh nghiệm xây nhà</h2>
                                </div>
                                <p>by Nguyen Van A</p>
                            </div>
                        </div>
                    </div>
                </Col>
              </Row>
            </Container>
            <ModalCreatePost 
                show={isShowModalLogin}
                handleClose={handleClose}
                getListViewPost={getListViewPost}
            />
        </>
        
    );
}

export default News;