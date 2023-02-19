import React                         from 'react';
import { Button, Modal, Typography } from 'antd';

const { Title } = Typography

const DeleteAlert = ({ onCancel, onConfirm, isOpen }) => (
  <Modal title="Delete Book" footer={ null } open={isOpen}>
    <Title level={ 4 }>Are you sure to delete this book?</Title>

    <div style={ { marginTop: "10px", display: 'flex', justifyContent: 'end' } }>
      <Button type="primary" onClick={ () => onCancel() } style={ { marginRight: "10px" } }>
        Cancel
      </Button>

      <Button type="primary" danger onClick={ () => onConfirm() }>
        Delete
      </Button>
    </div>
  </Modal>
);
export default DeleteAlert;