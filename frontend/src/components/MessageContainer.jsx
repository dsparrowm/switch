import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

import Message from './Message';
import TextEditor from './SWTextEditor';
import CustomModal from './modals/CustomModal';
import AddToDepartment from './modals/AddToDepartment';
import { setMessages, selectMessages } from '../features/conversations/messageSlice';
import {
  // selectActiveConversation,
  // addNewPrivateConversation,
  // setActiveConversation,
  selectPrivateConversation
} from '../features/conversations/conversationSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import { selectOrganizationStaffs } from '../features/organization/staffSlice';
import {
  getGroupMessagesRoute,
  getPrivateMessagesRoute
} from '../utils/APIRoutes';

import getRequests from '../utils/APIRequest/getRequest';
import {
  groupByDate,
  getLocalTime,
  stringAvatar
} from '../utils/helpers';
import { socket } from '../utils/socket';
import {
  selectActiveTab,
  // setActiveTab
} from '../features/ui/uiSlice';

const theme = createTheme({
  typography: {
    body1: {
      fontSize: 'var(--font-size-medium)'
    }
  }
});

function MessageContainer () {
  const dispatch = useDispatch();
  const [searchInputValue, setSearchInputValue] = useState('');
  const staffList = useSelector(selectOrganizationStaffs);
  const user = useSelector(selectCurrentUser);
  const activeConversation = useSelector(selectActiveTab);
  const privateConversation = useSelector(selectPrivateConversation);
  const messages = useSelector(selectMessages);
  const [groupedMessages, setGroupedMessages] = useState(null);
  const [DMList, setDMList] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchMessages = async () => {
    let apiRouts = null;
    let param = null;

    if (activeConversation.type === 'group') {
      apiRouts = getGroupMessagesRoute;
      param = { departmentId: activeConversation.id };
    } else if (activeConversation.type === 'private') {
      apiRouts = getPrivateMessagesRoute;
      param = { userId: user.id };
    }

    if (apiRouts) {
      //  API Request
      getRequests(apiRouts, param)
        .then(res => {
          if (res?.data) {
            const { data } = res;
            if (data?.isSuccess) {
              dispatch(setMessages(data.messages));
            }
          }
        })
        .catch(err => console.error(err));
    }
  };

  const changeOption = (newValue) => {
    console.log(newValue);
    // dispatch(setActiveTab(newValue));
    // dispatch(addNewPrivateConversation({ ...newValue, type: 'private' }));
  };

  useEffect(() => {
    let cleaner = false;

    if (!cleaner) {
      fetchMessages();
      if (activeConversation.type === 'group') {
        socket.emit('join-department', activeConversation.id);
      } else {
        setDMList(groupByDate(privateConversation, 'createdAt'));
        // dispatch(setMessages([]));
        // socket.emit('join-private', activeConversation.id);
      }
    }

    return () => {
      cleaner = true;
    };
    // eslint-disable-next-line
  }, [activeConversation]);

  useEffect(() => {
    if (messages.length) {
      const groupedMsg = groupByDate(messages, 'createdAt');
      setGroupedMessages(groupedMsg);
    } else {
      setGroupedMessages(null);
    }
  }, [messages]);

  useEffect(() => {
    if (user) {
      function onConnect () {
        console.log('Socket Connection succeeded');
      }
      function onDisconnect () {
        console.log('Socket Disconnection succeeded');
      }

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      };
    }
  }, [user]);

  return (
    <Container>
      <section className='header'>
        <h3 className='header__heading'>
          <div className='header__heading__wrap'>
            <div className='header__heading__wrap__name'>
              {activeConversation && activeConversation.name}
            </div>
            <div className='header__heading__wrap__more'>
              {/* {activeConversation.type === 'group' &&
                <Button
                  variant='text'
                  onClick={() => setShowAdd(true)}
                >
                  <GroupAddOutlinedIcon sx={{ width: 24, height: 24 }} />
                </Button>} */}
              <Button
                variant='text'
                onClick={() => setShowAdd(true)}
              >
                <GroupAddOutlinedIcon sx={{ width: 24, height: 24 }} />
              </Button>
            </div>
          </div>
        </h3>
        {activeConversation.type === 'DMs' && (
          <div className='dms__search'>
            <span>To: </span>
            <ThemeProvider theme={theme}>
              <Autocomplete
                disabled={!staffList}
                disablePortal
                onChange={(event, newValue) => changeOption(newValue)}
                inputValue={searchInputValue}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                className='dms__search__container'
                getOptionLabel={(option) => option?.user?.name}
                options={staffList}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Search Users'
                    variant='standard'
                  />)}
              />
            </ThemeProvider>
          </div>)}
      </section>
      <section className={`body ${activeConversation.type === 'DMs' ? '' : 'mb-10'}`}>
        {(groupedMessages && activeConversation.type !== 'DMs') && (
          <>
            {Object.keys(groupedMessages).map((date, i) => {
              return (
                <Fragment
                  key={i}
                >
                  <Divider
                    textAlign='left'
                    sx={{ margin: '2rem 0' }}
                  >
                    <Chip
                      sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}
                      label={`${getLocalTime(date).format('dddd Do, MMMM')}`}
                      variant='outlined'
                    />
                  </Divider>
                  {groupedMessages[date].map((message, j) => {
                    return (
                      <Message
                        key={j}
                        message={message}
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </>)}

        {(DMList && activeConversation.type === 'DMs') && (
          <>
            <section className='dms'>
              <div className='dms__contents'>
                {Object.keys(DMList).map((date, i) => {
                  return (
                    <Fragment
                      key={i}
                    >
                      <span className='dms__contents__date'>{getLocalTime(date).format('dddd Do, MMMM')}</span>
                      {DMList[date].map((dm, j) => {
                        return (
                          <Button
                            key={j}
                            variant='text'
                            className='dms__contents__dm'
                          >
                            <div className='wrapper'>
                              <div className='dms__contents__dm__left'>
                                <Avatar {...stringAvatar(dm.name)} />
                              </div>
                              <div className='dms__contents__dm__right'>
                                <h5 className='dms__contents__dm__right__sender'>
                                  <span className='dms__contents__dm__right__sender__name'>
                                    {dm.name}
                                  </span>
                                  <span className='dms__contents__dm__right__sender__time'>
                                    {getLocalTime(dm?.createdAt).format('hh:mm')}
                                  </span>
                                </h5>
                                <article className='dms__contents__dm__right__content'>
                                  <span>
                                    {dm?.isLoginUser ? 'You' : dm.name.split(' ')[0]}:
                                  </span>
                                  <span>
                                    {dm?.content.length > 200 ? ` ${dm?.content.substring(0, 200)}...` : ` ${dm.content}`}
                                  </span>
                                </article>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </div>
            </section>
          </>)}

      </section>
      <section className='footer'>
        {activeConversation.type !== 'DMs' && <TextEditor />}
      </section>
      <CustomModal
        title='Add Members to this Department'
        openModal={showAdd}
        onCloseModal={() => setShowAdd(false)}
      >
        <AddToDepartment />
      </CustomModal>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  border-right: var(--sw-border);

  .body {
    overflow-y: auto;
    height: calc(100vh - 130px);
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

  .mb-10 {
    margin-bottom: 10rem;
    height: calc(100vh - 250.47px);
  }

  .header {
    &__heading {
      padding: 1rem;
      background-color: var(--light-grey);
      border-bottom: var(--sw-border);

      &__wrap {
        display: flex;
        justify-content: space-between;

        &__more {
          button {
            padding: 0 0.5rem;
            color: var(--dull-text-color);
          }
        }
      }
    }

    .dms__search {
      color: var(--dull-text-color);
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: var(--sw-border);

      &__container {
        width: 100%;
        
        input {
          border: none;
          color: var(--text-color);
  
          &:before {
            border: none;
          }
        }

        .css-yq9shg-MuiInputBase-root-MuiInput-root:before {
          border: none;
        }
      }
    }
  }

  .dms {
    &__contents {
      padding: 0 1.5rem;

      &__date {
        display: block;
        // margin-top: 2rem;
      }

      &__dm {
        display: block;
        border-radius: 5px;
        border: var(--sw-border);
        color: inherit;
        font-weight: var(--font-weight-bold);
        font-family: inherit;
        line-height: 1;
        font-size: var(--font-size-medium);
        padding: 1rem;
        margin-bottom: 1.5rem;
        margin-top: 1rem;
        text-transform: none;
        text-align: left;
        width: 100%;

        &:hover {
          cursor: pointer;
        }

        .wrapper {
          display: flex;
          gap: 1rem;
        }

        &__left {
          border-radius: 4px;
        }
        
        &__right {
          width: 100%;
          
          &__sender {
            font-weight: var(--font-weight-bold);
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.5rem;
  
            &__time {
              color: var(--dull-text-color);
            }
          }

          &__content {
            color: var(--dull-text-color);
          }
        }
      }
    }
  }
  
  .footer {
    background: none;
    position: relative;
    padding: 1rem;
  }

  ::placeholder {
    font-style: italic;
    font-size: var(--font-size-medium);
    font-weight: var(--font-weight-regular);
  }
 
`;

export default MessageContainer;
