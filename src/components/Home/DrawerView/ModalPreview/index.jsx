import { Modal } from 'antd'
import React from 'react'

const ModalPreview = ({open, handleClose}) => {
  return (
    <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        title={"hello"}
    >
        <div className=""></div>
    </Modal>
  )
}

export default ModalPreview