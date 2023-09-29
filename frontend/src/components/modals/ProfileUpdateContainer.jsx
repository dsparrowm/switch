import React, { useState } from 'react';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import image from '../../static/images/avatar/1.jpg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

function ProfileUpdater () {
  // const profileRef = useRef();
  const [fullName, setFullName] = useState('');
  const [profilePix, setProfilePix] = useState(null);

  const handleChange = (e) => {
    setFullName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUpload = (e) => {
    const imgUrl = URL.createObjectURL(e.target.files[0]);
    setProfilePix(imgUrl);
  };

  return (
    <Container>
      <div className='profile'>
        <div className='profile__avatar'>
          <img
            className='profile__avatar__img'
            src={profilePix || image}
            alt='user profile'
            loading='lazy'
          />
        </div>
        <div className='profile__file-picker'>
          <Stack
            direction='column'
            sx={{ maxWidth: 200, margin: '0 auto' }}
            spacing={1}
          >
            <Button
              component='label'
              sx={{
                fontSize: '1.2rem',
                borderColor: 'var(--border-color)',
                color: 'var(--text-grey)'
              }}
              variant='outlined'
              size='medium'
              startIcon={<CloudUploadIcon />}
            >
              Upload photo
              <VisuallyHiddenInput
                type='file'
                onChange={handleUpload}
              />
            </Button>
            <Button
              variant='text'
              size='medium'
            >
              Remove photo
            </Button>
          </Stack>
        </div>
        <form
          onSubmit={handleSubmit}
          className='profile__form'
        >
          <div className='form-group'>
            <label htmlFor='fullName'>Full Name</label>
            <input
              type='text'
              id='fullName'
              placeholder='Full Name'
              value={fullName}
              name='fullName'
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className='form-group'>
            <Stack
              direction='row'
              justifyContent='flex-end'
              spacing={2}
            >
              <Button
                className='button-cancel'
                variant='outlined'
                size='medium'
              >
                Cancel
              </Button>
              <Button
                className='button-secondry'
                variant='contained'
                size='medium'
                type='submit'
              >
                Save Changes
              </Button>
            </Stack>
          </div>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .profile {

    &__avatar {
      border-radius: var(--border-redius-small);
      position: relative;
      overflow: hidden;
      width: 200px;
      height: 200px;
      margin: 1rem auto;

      &__img {
        width: 100%;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        object-fit: cover;
      }
    }

    &__file-picker {
      margin-top: 2rem;

      button {
        font-size: 1.2rem;
      }
    }

    &__form {

      .button-secondry {
        color: var(--color-white);
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        font-size: 1.08rem;
        font-weight: var(--font-weight-bold);
      }
      
      .button-cancel {
        font-size: 1.08rem;
        border-color: var(--color-primary);
        color: var(--color-primary);
        font-weight: var(--font-weight-bold);
      }
    }
  }
 `;

export default ProfileUpdater;
