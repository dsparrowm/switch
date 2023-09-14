import React from 'react';
import styled from 'styled-components';
import MessageInput from './MessageInput';
import Message from './Message';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useSelector } from 'react-redux';

function MessageContainer () {
  const selectedMsg = useSelector((state) => state.messages.selectedMessage);

  return (
    <Container>
      <section className='header'>
        <h3>
          Active Chart
        </h3>
      </section>
      <section className='body'>
        <Message message={selectedMsg} />
        <Divider
          textAlign='left'
          sx={{ margin: '2rem 0' }}
        >
          <Chip
            sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}
            label='Wednesday, & September'
            variant='outlined'
          />
        </Divider>
        <Message />
      </section>
      <section className='footer'>
        <MessageInput />
      </section>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;

  .body {
    flex-grow: 1;
    overflow-y: auto;
    height: calc(100vh - 259.47px);
    padding: 2rem;

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

  .header {
    background-color: var(--light-grey);
    border-bottom: var(--sw-border);
  }
  
  .footer {
    background-color: var(--light-grey);
    border-top: var(--sw-border);
  }

  .header, .footer {
    padding: 1rem;
  }
 
`;

export default MessageContainer;
