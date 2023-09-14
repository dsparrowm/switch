import React from 'react';
import styled from 'styled-components';
import MessageList from './MessageList';
import { useSelector } from 'react-redux';

function LeftSideBar () {
  const messages = useSelector((state) => state.messages.messages);
  return (
    <Container>
      <section className='organisation-name'>
        <h3>
          Alx-Students
        </h3>
      </section>
      <MessageList
        category='group'
        messages={messages}
      />
      <MessageList />
    </Container>
  );
}

const Container = styled.aside`
  border-bottom: var(--sw-border);
  overflow-y: auto;
  border-right: var(--sw-border);

  .organisation-name {
    padding: 1rem;
    background-color: var(--light-grey);
    border-bottom: var(--sw-border);
  }

`;

export default LeftSideBar;
