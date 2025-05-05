// components/ModalComponent.jsx
import React from 'react';
import { Modal } from 'antd';

const ConfirmModalComponent  = ({ visible, title, content, onConfirm, onCancel }) => {
  return (
    <Modal
      open={visible}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
    >
      {content}
    </Modal>
  );
};

export default ConfirmModalComponent ;
