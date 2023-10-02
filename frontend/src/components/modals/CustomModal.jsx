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
  maxWidth: 500,
  maxHeight: '90vh',
  bgcolor: 'var(--theme-light-bg)',
  boxShadow: 24,
  outline: 0,
  p: 3,
  borderRadius: 'var(--border-redius-small)',
  fontSize: 'var(--font-size-medium)',
  display: 'flex',
  flexDirection: 'column',

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
  },

  modalBody: {
    flex: '1 1 auto',
    height: '100%',
    overflowY: 'auto',

    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: 'var(--color-white)',
      borderRadius: '3px',

      '&-thumb': {
        backgroundColor: 'var(--color-primary)',
        borderRadius: '3px'
      }
    }
  }
};

function CustomModal ({ children, size, openModal, title, onCloseModal }) {
  style.maxWidth = size || 500;
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
          <Box
            sx={style.modalBody}
            className='modal__body'
          >
            {children}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal;
