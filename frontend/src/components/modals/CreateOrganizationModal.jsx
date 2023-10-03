import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HandleFormInputError from '../HandleFormInputError';
import { createNewOrganizationRoute } from '../../utils/APIRoutes';
import { postRequest } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

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
    fontWeight: 'var(--font-weight-bold)'
  },

  buttonStyles: {
    marginTop: '1rem',
    padding: 'var(--button-padding)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--font-size-medium)'
  }
};

export default function CreateOranisationModal ({ onOpen, onClose }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [companyName, setConpanyName] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [isInValidCompanyName, setIsInValidCompanyName] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();

    setLoading(true);
    if (handleValidation()) {
      postRequest(createNewOrganizationRoute, {
        userId: user.id,
        name: companyName
      })
        .then(res => {
          if (res?.data?.isSuccess) {
            navigate('/office/' + res?.data?.org.id);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
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
      setCompanyNameError('Organization name can not be less than 4-characters.');
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
      <Modal
        open={onOpen}
        onClose={onClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h2' component='h2'
            sx={{ textAlign: 'center' }}
          >
            Almost done!
          </Typography>
          <Box>
            <Typography variant='h4' id='modal-modal-description' sx={{ mt: 2 }}>
              <span className='help-text'>
                Give your workspace a name.
                Note, this will be the name people see on the dashboard header.
              </span>
            </Typography>
            <form
              onSubmit={(e) => handleCreate(e)}
              className='create-org'
            >
              <div className='form-group'>
                <label sx={style.label} htmlFor='organization'>
                  What is your organization called?
                </label>
                <input
                  id='organization'
                  type='text'
                  className={`${isInValidCompanyName ? 'invalid' : companyName && 'valid'}`}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter the name of your organization'
                />
                <HandleFormInputError
                  state={isInValidCompanyName}
                  msg={companyNameError}
                />
              </div>
              <div className='form-group'>
                <Button
                  sx={style.buttonStyles}
                  variant='contained'
                  className='create-button submit-button button-secondry button'
                  type='submit'
                >
                  {loading
                    ? <CircularProgress size={25} />
                    : 'Create'}
                </Button>
                <Button
                  sx={style.buttonStyles}
                  variant='outlined'
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
