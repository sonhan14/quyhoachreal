import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalCreatePost.scss'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
const ModalCreatePost = (props) => {
    const {handleClose, show} = props
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);
    const navigate = useNavigate();
    const handleClickLogin = () => {
        handleClose()
        navigate('/login')
    }
    const handleClickRegister = () => {
        handleClose()
        navigate('/register')
    }
    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '40px';
            textarea.style.height = `${textarea.scrollHeight}px`;

            if (textarea.scrollHeight > 380) {
                textarea.style.height = '380px';
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    return (
        <Modal className='modal-auth ' aria-labelledby="contained-modal-title-vcenter"
        centered show={show} onHide={handleClose}>
            <div className='modal-auth-container'>
                <Modal.Header closeButton>
                <Modal.Title className='modal-auth-title' style={{textAlign:'center', fontSize:'20px'}}>Tạo bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
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
                            style={{cursor:'pointer'}}
                        ></textarea>
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
}

export default ModalCreatePost;