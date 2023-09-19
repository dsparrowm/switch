import React from 'react';
import styled from 'styled-components';
import Message from './Message';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useSelector } from 'react-redux';
import TextEditor from './SWTextEditor';

function MessageContainer () {
  const activeConversations = useSelector((state) => state.conversations.activeConversations);
  const messages = useSelector((state) => state.messages);
  // const [messages, setMessages] = useState('');

  // useEffect(() => {
  //   if (activeConversations && messages) {
  //     const filteredMessages = messages.filter(({id} === ))
  //   }
  // }, [messages]);

  return (
    <Container>
      <section className='header'>
        <h3>
          {activeConversations.name}
        </h3>
      </section>
      <section className='body'>
        {messages && (
          <>
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
            {messages.map((message, i) => {
              return <Message
                key={i}
                message={message}
              />
            })}
          </>)}
        <Message />
      </section>
      <section className='footer'>
        <TextEditor />
      </section>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  border-right: var(--sw-border);

  .body {
    flex-grow: 1;
    overflow-y: auto;
    height: calc(100vh - 259.47px);
    padding: 2rem 0;

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
