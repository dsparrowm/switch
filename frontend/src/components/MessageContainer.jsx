import React from 'react';
import styled from 'styled-components';
import MessageInput from './MessageInput';
import Message from './Message';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

function MessageContainer () {
  return (
    <Container>
      <div className='message'>
        <section className='message__header'>
          <h3>
            Active Chart
          </h3>
        </section>
        <section className='message__body'>
          <Message />
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
        <section className='message__footer'>
          <MessageInput />
        </section>
      </div>
    </Container>
  );
}

const Container = styled.section`
.message {
  // border-: var(--sw-border);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  &__header {
    border-bottom: var(--sw-border);
    padding: 1rem 2rem;
  }

  &__footer {
    border-top: var(--sw-border);
  }

  &__header, &__footer {
    background-color: var(--light-grey);
  }

  &__body {
    padding: 2rem 1rem;
    overflow-y: auto;
  } 
}
`;

export default MessageContainer;
