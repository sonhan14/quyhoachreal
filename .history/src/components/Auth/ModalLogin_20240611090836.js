import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalLogin = (props) => {
    const {handleClose, show} = props
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Thông Báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn phải là thành viên mới có thể thêm quy hoạch. Hãy đăng kí hoặc đăng nhập nếu bạn đã có tài khoản!</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
      );
}

export default ModalLogin;