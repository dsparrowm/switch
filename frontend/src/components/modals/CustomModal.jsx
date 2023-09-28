import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '500px',
  bgcolor: 'var(--theme-light-bg)',
  boxShadow: 24,
  outline: 0,
  p: 3,
  fontSize: 'var(--font-size-medium)',

  modalHeader: {
    position: 'relative',
    marginBottom: '1.5rem'
  },

  modalHeaderBtn: {
    position: 'absolute',
    top: '-0.5rem',
    right: '0',
    border: 'none',
    outline: 'none',
    backgroundColor: 'inherit',
    padding: '1rem'
  }
};

function CustomModal ({ children, openModal, title, onCloseModal }) {
  const handleClose = () => {
    onCloseModal();
  };

  return (
    <div>
      <Modal
        className='modal'
        open={openModal}
        onClose={onCloseModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div
            style={style.modalHeader}
            className='modal__header'
          >
            <h3>
              {title}
            </h3>
            <button
              onClick={handleClose}
              style={style.modalHeaderBtn}
            >
              <ClearOutlinedIcon sx={{ fontSize: 'large' }} />
            </button>
          </div>
          <div className='modal__body'>
            {children}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal;
