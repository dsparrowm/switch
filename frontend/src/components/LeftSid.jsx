import React from 'react';
import styled from 'styled-components';
import Conversations from './Conversations';
import { useSelector } from 'react-redux';

function LeftSide () {
  const departments = useSelector((state) => state.conversations.departments);
  const privates = useSelector((state) => state.conversations.privates);
  const organization = useSelector((state) => state.organization);

  return (
    <Container>
      <section className='organisation-name'>
        <h3>
          {organization && organization.name}
        </h3>
      </section>
      <Conversations
        category='group'
        conversations={departments}
      />
      {privates.length > 0 &&
        <Conversations conversations={privates} />}
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

export default LeftSide;