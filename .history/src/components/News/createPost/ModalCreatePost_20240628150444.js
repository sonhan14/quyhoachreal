import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalCreatePost.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import importImage from '../../../assets/importImage.png';
import importIcon from '../../../assets/importIcon.png';
import importLocation from '../../../assets/importLocation.png';
import importTag from '../../../assets/importTag.png';
import { LuMoreHorizontal } from "react-icons/lu";
import { Avatar, Space } from 'antd';
import { useSelector } from 'react-redux';

const ModalCreatePost = (props) => {
    const { handleClose, show } = props;
    const [inputValueTitle, setInputValueTitle] = useState('');
    const [inputValueContent, setInputValueContent] = useState('');
    const [selectedValueGroup, setSelectedValueGroup] = useState('');
    const [showSecondTextarea, setShowSecondTextarea] = useState(false);
    const textareaTitleRef = useRef(null);
    const textareaContentRef = useRef(null);
    const navigate = useNavigate();
    const user = useSelector(state => state.account.Users);
    const listGroups = useSelector((state) => state.listbox.listgroup);
    console.log("listGroups post: ", listGroups)


    const handleChangeValueGroup = (event) => {
        setSelectedValueGroup(event.target.value);
      };
    const handleClickLogin = () => {
        handleClose();
        navigate('/login');
    };

    const handleClickRegister = () => {
        handleClose();
        navigate('/register');
    };

    useEffect(() => {
        adjustTextareaHeightTitle();
    }, [inputValueTitle]);

    const adjustTextareaHeightTitle = () => {
        const textarea = textareaTitleRef.current;
        if (textarea) {
            textarea.style.height = '40px';
            textarea.style.height = `${textarea.scrollHeight}px`;

            if (textarea.scrollHeight > 300) {
                textarea.style.height = '300px';
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }
    };

    useEffect(() => {
        adjustTextareaHeightContent();
    }, [inputValueContent]);

    const adjustTextareaHeightContent = () => {
        const textarea = textareaContentRef.current;
        if (textarea) {
            textarea.style.height = '40px';
            textarea.style.height = `${textarea.scrollHeight}px`;

            if (textarea.scrollHeight > 300) {
                textarea.style.height = '300px';
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }
    };
    const handleInputTitleChange = (e) => {
        setInputValueTitle(e.target.value);
    };
    const handleInputContentChange = (e) => {
        setInputValueContent(e.target.value);
    };
    const handleTextareaClick = () => {
        setShowSecondTextarea(true);
    };

    return (
        <Modal className='modal-auth' aria-labelledby="contained-modal-title-vcenter"
            centered show={show} onHide={handleClose}>
            <div className='modal-auth-container'>
                <Modal.Header closeButton>
                    <Modal.Title className='modal-auth-title' style={{ textAlign: 'center', fontSize: '20px' }}>Tạo bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="post-new">
                        <div className="post-new-avatar">
                            <Space>
                                <Avatar src={user?.avatarLink} />
                                {user?.Username}
                            </Space>
                                {listGroups && 
                                    listGroups.map((group, index)=> {
                                        <select key={`namegroup-${index}`} className='post-new-select' value={selectedValueGroup} onChange={handleChangeValueGroup}>
                                            <option value="option3">{group.GroupName}</option>
                                        </select>
                                    })
                                }
                        </div>
                        <div>
                            <textarea
                                className="post-new-input"
                                placeholder="Tiêu đề..."
                                value={inputValueTitle}
                                onChange={handleInputTitleChange}
                                ref={textareaTitleRef}
                                style={{ cursor: 'pointer', padding:'8px 20px', margin:'auto 0' , height:'40px', border:'solid 1px #ccc' }}
                            ></textarea>
                            <textarea
                                className="post-new-input"
                                onChange={handleInputContentChange}
                                ref={textareaContentRef}
                                value={inputValueContent}
                                placeholder="Nội dung..."
                                style={{ cursor: 'pointer',padding:'8px 20px', margin:'auto 0' , height:'40px', border:'solid 1px #ccc',marginTop:'20px' }}
                            ></textarea>
                        </div>
                        
                        <div className="post-action">
                            <span>Thêm vào bài viết của bạn</span>
                            <div className='post-action-img'>
                                <img src={importImage} alt='anh lỗi' />
                                <img src={importIcon} alt='anh lỗi' />
                                <img src={importTag} alt='anh lỗi' />
                                <img src={importLocation} alt='anh lỗi' />
                                <LuMoreHorizontal size={30} className='more-icon' />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='btn-auth'>
                    <Button className='btn-post' variant="primary" onClick={handleClickLogin}>
                        Đăng bài
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ModalCreatePost;
