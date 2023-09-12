import React from 'react';
import styled from 'styled-components';
import MessageList from './MessageList';

function LeftSideBar() {
  return (
    <Container>
      <section className='organisation-name'>
        <h3>
          Alx-Students
        </h3>
      </section>
      <MessageList category="group" />
      <MessageList />
    </Container>
  );
}

const Container = styled.aside`
  border-right: var(--sw-border);

`;

export default LeftSideBar;