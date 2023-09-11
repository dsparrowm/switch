import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';

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

  label: {
    fontWeight: 'var(--font-weight-bold)',
  },

  formHelp: {
    color: 'var(--error-color)'
  },

  buttonStyles: {
    marginTop: '1rem',
    padding: 'var(--button-padding)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--font-size-medium)'
  } 
};

export default function CreateOranisationModal({ isOpen }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [companyName, setConpanyName] = React.useState('');
  const [companyNameError, setCompanyNameError] = React.useState('');
  const [isInValidCompanyName, setIsInValidCompanyName] = React.useState(false);

  const handleCreate = (event) => {
    event.preventDefault();

    if (handleValidation()) {
      
    }
  };

  const handleValidation = () => {
    if (!companyName.length) {
      setIsInValidCompanyName(true);
      setCompanyNameError('Required field - Please enter something.');
      return false;
    }
  
    if (companyName.length < 4) {
      setIsInValidCompanyName(true);
      setCompanyNameError('Organisation name can not be less than 4-characters.');
      return false;
    }

    setIsInValidCompanyName(false);
    setCompanyNameError('');
    return true;
  };

  const handleChange = (event) => {
    setConpanyName(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h2" component="h2"
            sx={{ textAlign: 'center' }}
          >
            Almost done!
          </Typography>
          <Box>
            <Typography variant="h4" id="modal-modal-description" sx={{ mt: 2 }}>
              <span className="help-text">
                Give your workspace a name.
                Note, this will be the name people see on the dashboard header.
              </span>
            </Typography>
            <form
            onSubmit={(e) => handleCreate(e)}
            className='create-org'>
              <div className="form-group">
                <label sx={style.label} htmlFor="organisation">
                  What is your organisation called?
                </label>
                <input
                  id='organisation'
                  type="text"
                  className={`${isInValidCompanyName ? 'invalid' : companyName && 'valid'}`}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter the name of your organization'
                />
                <p
                  style={style.formHelp}
                  className={`form-help ${isInValidCompanyName ? '' : 'hidden'}`}>
                  <span className='form-field-icon'>i</span>
                  {companyNameError}
                </p>
              </div>
              <div className="form-group">
                <Button
                  sx={style.buttonStyles}
                  variant="contained"
                  className='create-button submit-button button-secondry button'
                  type='submit'
                >
                  Create
                </Button>
                <Button
                  sx={style.buttonStyles}
                  variant="outlined"
                  onClick={() => navigate('/')}
                  className='cancel-button submit-button button-secondry button'
                >
                  Another Time
                </Button>
              </div>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}