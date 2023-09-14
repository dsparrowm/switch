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

function Message () {
  return (
    <Container>
      <div className='post'>
        <div className='post__sender'>
          <Avatar {...stringAvatar('Kent Podds')} />
          {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
        </div>
        <div className='post__body'>
          <h5 className='post__body__sender'>
            <span className='post__body__sender__name'>Kent Podds</span>
            <span className='post__body__time'>07:25</span>
          </h5>
          <article className='post__body__text'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa maiores voluptatibus repudiandae officiis nostrum voluptate fugiat explicabo quisquam possimus atque?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores eos dolores, qui harum accusantium nihil illo quis error maxime doloribus est deserunt dicta quae, reiciendis nemo et aut magni dolorum iusto dolore ex aliquam consequatur hic. Harum vitae, dolorum tempora molestias blanditiis, velit dicta consectetur laborum nisi doloribus commodi adipisci.
          </article>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div` 
  .post {
    display: flex;
    gap: 1rem;

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
