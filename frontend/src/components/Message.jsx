import React from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';

function stringToColor (string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar (name) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    variant: 'square',
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

function Message ({ message }) {
  return (
    <Container>
      {message && (
        <div className='post'>
          <div className='post__sender'>
            <Avatar {...stringAvatar(message.sender)} />
            {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
          </div>
          <div className='post__body'>
            <h5 className='post__body__sender'>
              <span className='post__body__sender__name'>
                {message.sender}
              </span>
              <span className='post__body__time'>07:25</span>
            </h5>
            <article
              dangerouslySetInnerHTML={{__html: message.content}}
              className='post__body__text'
            />
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div` 
  .post {
    display: flex;
    gap: 1rem;
    padding: 2rem;

    &:hover {
      background-color: var(--light-grey);
    }

    &__body {

      &__sender {
        font-size: var(--font-size-large);
      }

      &__time {
        display: inline-block;
        margin-left: 1rem;
        font-size: var(--font-size-small);
      }

    }
  }
`;

export default Message;
