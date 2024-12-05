import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalLogin.scss'
const ModalLogin = (props) => {
    const {handleClose, show} = props
    return (
        <Modal className='modal-auth' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Thông Báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn phải là thành viên mới có thể thêm quy hoạch. Hãy đăng kí hoặc đăng nhập nếu bạn đã có tài khoản!</Modal.Body>
            <Modal.Footer>
            <Button className='btn-register' variant="secondary" onClick={handleClose}>
                Đăng ký
            </Button>
            <Button className='btn-login' variant="primary" onClick={handleClose}>
                Đăng nhập
            </Button>
            </Modal.Footer>
        </Modal>
      );
}

export default ModalLogin;