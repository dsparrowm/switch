import React from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import styled from 'styled-components';

function HandleFormInputError({msg, state}) {
  return (
    <Container>
      <article className={`form-help ${state ? 'valid' : 'hidden'}`}>
        <span className='form-field-icon'>
          <CancelOutlinedIcon sx={{fontSize: 'medium'}} />
        </span>
        <span>
          {msg}
        </span>
      </article>
    </Container>
  )
};

const Container = styled.div`
  .form-help {
    color: var(--error-color);
  }
`;

export default HandleFormInputError;