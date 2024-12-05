import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalCreatePost.scss';
// import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import importImage from '../../../assets/importImage.png';
import importIcon from '../../../assets/importIcon.png';
import importLocation from '../../../assets/importLocation.png';
import { Avatar, Space, message, notification } from 'antd';
import { useSelector } from 'react-redux';
import { CreatePost, fetchAccount } from '../../../services/api';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const iconAvatar =
    'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg';

const ModalCreatePost = (props) => {
    const { handleClose, show, onPostCreated } = props;
    const [inputValueTitle, setInputValueTitle] = useState('');
    const [inputValueContent, setInputValueContent] = useState('');
    const [selectedValueGroup, setSelectedValueGroup] = useState(null);
    const textareaTitleRef = useRef(null);
    const textareaContentRef = useRef(null);
    const textareaHastagRef = useRef(null);
    const datauser = useSelector((state) => state.account.dataUser);
    // const navigate = useNavigate();
    const listGroups = useSelector((state) => state.listbox.listgroup);
    const [apiUser, setApiUser] = useState([]); // user khi đăng nhập thành công
    const [PostLatitude, setPostLatitude] = useState(null);
    const [PostLongitude, setPostLongitude] = useState(null);
    const [showModalImage, setShowModalImage] = useState(false);
    const [files, setFiles] = useState([]);
    const [base64Images, setBase64Images] = useState([]);
    const [isHastags, setIsHastags] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeValueGroup = (event) => {
        setSelectedValueGroup(Number(event.target.value));
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

    const handleInputHastagsChange = (e) => {
        const value = e.target.value;
        const hastagsArray = value.split(/[ ,]+/).map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
        setIsHastags(hastagsArray);
    };

    //User
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (datauser?.UserID) {
                    const response = await fetchAccount();
                    const fetchedUser = response.find((user) => user?.userid === datauser?.UserID);
                    fetchedUser && setApiUser(fetchedUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch user data',
                });
            }
        };

        fetchUserData();
    }, [datauser.UserID]);

    // lấy tọa độ người dùng
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPostLatitude(position.coords.latitude);
                    setPostLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Error fetching geolocation', error);
                },
            );
        }
    }, []);

    const handleShowModal = () => {
        setShowModalImage(true);
    };

    const handleFileImage = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const newFiles = [];
        const newBase64Images = [];

        const fileReaders = selectedFiles.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1]; // Exclude the prefix
                    newFiles.push(file);
                    newBase64Images.push(base64String);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(fileReaders).then(() => {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setBase64Images((prevBase64Images) => [...prevBase64Images, ...newBase64Images]);
            setShowModalImage(false);
        });
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        const newBase64Images = [...base64Images];
        newFiles.splice(index, 1);
        newBase64Images.splice(index, 1);
        setFiles(newFiles);
        setBase64Images(newBase64Images);
    };

    //click new post
    const handleClickNewPost = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            notification.error({
                message: 'Authentication error',
                description: 'Please log in again!',
            });
            return;
        }
        try {
            setIsLoading(true);
            const res = await CreatePost(
                22,
                inputValueTitle,
                inputValueContent,
                PostLatitude,
                PostLongitude,
                base64Images,
                isHastags,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setIsLoading(false);
            if (res.data) {
                message.success('Added new post successfully');
                handleClose();
                setInputValueTitle('');
                setInputValueContent('');
                setFiles([]);
                setBase64Images([]);
                setIsHastags('');
                setIsLoading(false);
                if (res.data.length > 0) {
                    onPostCreated(res.data[0]);
                } else {
                    message.error('No posts were created.');
                }
            } else {
                notification.error({
                    message: 'An error has occurred',
                    description: res.message,
                });
            }
        } catch (error) {
            console.error('An error has occurred', error);
            notification.error({
                message: 'An error has occurred',
                description: error.message && Array.isArray(error.message) ? error.message[0] : error.message,
                duration: 5,
            });
        }
    };

    const renderFilePreview = (file, index) => {
        if (file.type.startsWith('image/')) {
            return (
                <div key={index} className="preview-file">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="preview-image" />
                    <span className="remove-icon" onClick={() => removeFile(index)}>
                        <IoMdCloseCircleOutline />
                    </span>
                </div>
            );
        } else if (file.type.startsWith('video/')) {
            return (
                <div key={index} className="preview-file">
                    <video controls className="preview-video">
                        <source src={URL.createObjectURL(file)} type={file.type} />
                    </video>
                    <span className="remove-icon" onClick={() => removeFile(index)}>
                        <IoMdCloseCircleOutline />
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            className="modal-auth"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}
        >
            <div className="modal-auth-container">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-auth-title" style={{ textAlign: 'center', fontSize: '20px' }}>
                        Tạo bài viết
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="post-new">
                        <div className="post-new-avatar">
                            <Space>
                                <Avatar src={apiUser?.avatarLink || iconAvatar} />
                                {apiUser?.FullName || 'Tên chủ tài khoản'}
                            </Space>
                            <select
                                className="post-new-select"
                                value={selectedValueGroup}
                                onChange={handleChangeValueGroup}
                            >
                                <option value={0}>Chọn Nhóm</option>
                                {listGroups &&
                                    listGroups.map((group, index) => (
                                        <option key={`namegroup-${index}`} value={group.GroupID}>
                                            {group.GroupName}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <textarea
                                className="post-new-input"
                                placeholder="Tiêu đề..."
                                value={inputValueTitle}
                                onChange={handleInputTitleChange}
                                ref={textareaTitleRef}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 20px',
                                    margin: 'auto 0',
                                    height: '40px',
                                    border: 'solid 1px #ccc',
                                    marginBottom: '10px',
                                }}
                            ></textarea>
                            <textarea
                                className="post-new-content"
                                placeholder={`${apiUser.FullName} ơi, bạn đăng muốn viết gì `}
                                value={inputValueContent}
                                onChange={(e) => setInputValueContent(e.target.value)}
                                ref={textareaContentRef}
                            />
                            <textarea
                                className="post-hastag-input"
                                placeholder="Hastag..."
                                value={isHastags}
                                onChange={handleInputHastagsChange}
                                ref={textareaHastagRef}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px',
                                    margin: 'auto 0',
                                    height: '40px',
                                    border: 'none',
                                }}
                            ></textarea>
                            {showModalImage && (
                                <div className="post-image">
                                    <span className="icon-close" onClick={() => setShowModalImage(false)}>
                                        <IoMdCloseCircleOutline />
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileImage}
                                        style={{ display: 'none' }}
                                        id="fileInput"
                                    />
                                    <label className="add-image-post" htmlFor="fileInput">
                                        <div className="images-content">
                                            <img src={importImage} alt="icon" />
                                            <p>Thêm ảnh / Video </p>
                                            <label>hoặc kéo và thả</label>
                                        </div>
                                    </label>
                                </div>
                            )}
                            <div className="preview-files">
                                {files.map((file, index) => renderFilePreview(file, index))}
                            </div>
                        </div>
                        <div className="post-action">
                            <span>Thêm vào bài viết của bạn</span>
                            <div className="post-action-img">
                                <span className="icon-post-forums" onClick={handleShowModal}>
                                    <img src={importImage} alt="anh lỗi" />
                                </span>
                                <span className="icon-post-forums">
                                    <img src={importIcon} alt="anh lỗi" />
                                </span>
                                <span className="icon-post-forums">
                                    <img src={importLocation} alt="anh lỗi" />
                                </span>
                                <span className="icon-post-forums">
                                    {/* <LuMoreHorizontal size={30} className="more-icon" /> */}
                                    day la icon
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="btn-auth">
                    <Button className="btn-post" variant="primary" onClick={handleClickNewPost}>
                        Đăng bài
                    </Button>
                    {isLoading && (
                        <div className="loading-overlay">
                            <AiOutlineLoading3Quarters className="loading" />
                        </div>
                    )}
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ModalCreatePost;
