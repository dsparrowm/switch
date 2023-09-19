import React, { useEffect } from 'react';
import styled from 'styled-components';
import Message from './Message';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useSelector, useDispatch } from 'react-redux';
import TextEditor from './SWTextEditor';
import { setMessages, selectMessages } from '../features/conversations/messageSlice';
import Axios from '../utils/Axios';
import { getDirectMessagesRoute, getGroupMessagesRoute } from '../utils/APIRoutes';

function MessageContainer () {
  const dispatch = useDispatch();
  const activeConversation = useSelector((state) => state.conversations.activeConversations);
  const messages = useSelector(selectMessages);
  // const [filteredMessages, setFilteredMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const apiRouts = activeConversation.type === 'group'
      ? getGroupMessagesRoute
      : getDirectMessagesRoute
      const { data } = await Axios.get(apiRouts, {params: {departmentId: activeConversation.id}});

      if (data.isSuccess) {
        console.log(data);
        dispatch(setMessages(data.messages));
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (activeConversation.type) {
      fetchMessages();
    }
  }, [activeConversation]);

  // useEffect(() => {
  //   if (messages.length) {
  //     // const filteredMsg = messages.filter({ id } => );
  //   }
  // }, [messages]);

  return (
    <Container>
      <section className='header'>
        <h3>
          {activeConversation && activeConversation.name}
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
    margin-bottom: 10rem;

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

  .header, .footer {
    padding: 1rem;
  }
  
  .footer {
    background: none;
    position: relative;
    // border-top: var(--sw-border);
  }
 
`;

export default MessageContainer;
