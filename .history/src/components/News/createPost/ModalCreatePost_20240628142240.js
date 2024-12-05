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
    const [inputValue, setInputValue] = useState('');
    const [showSecondTextarea, setShowSecondTextarea] = useState(false);
    const textareaRef = useRef(null);
    const navigate = useNavigate();
    const user = useSelector(state => state.account.Users);

    const handleClickLogin = () => {
        handleClose();
        navigate('/login');
    };

    const handleClickRegister = () => {
        handleClose();
        navigate('/register');
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
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

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
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
                        </div>
                        <div>
                            <textarea
                                className="post-new-input"
                                placeholder="Tiểu đề?"
                                value={inputValue}
                                onChange={handleInputChange}
                                onClick={handleTextareaClick}
                                ref={textareaRef}
                                style={{ cursor: 'pointer', lineHeight: '40px' }}
                            ></textarea>
                            <textarea
                                className="post-new-input"
                                placeholder="Nội dung?"
                                style={{ cursor: 'pointer', lineHeight: '40px' }}
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
