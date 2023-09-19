import React from 'react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function RightSide({ children, title }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Container>
      <section className='header'>
        <h3>
          {title}
        </h3>
        <button
          onClick={handleClose}
        >
          <ClearOutlinedIcon sx={{ fontSize: '2.8rem' }} />
        </button>
      </section>
      <section className='body'>
        {children}
      </section>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;

.header {
  position: relative;
  padding: 1rem;
  background-color: var(--light-grey);
  border-bottom: var(--sw-border);

  button {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    outline: none;
    background: none;
    padding: 1rem;
  }
}

.body {
  flex-grow: 1;
  overflow-y: auto;
  height: calc(100vh - 91.17px);
  padding: 2rem 1rem;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: var(--color-white);

    &-track {

    }

    &-thumb {
      background-color: var(--theme-light-fg);
      border-radius: 3px;
    }
  }
}

`;

export default RightSide;