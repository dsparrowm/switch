import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { setActiveConversation } from '../features/conversations/conversationSlice';

const styles = {
  iconStyles: {
    fontSize: 'large'
  }
};

function Conversations ({ category, conversations }) {
  const dispatch = useDispatch();
  const activeConversation = useSelector((state) => state.conversations.activeConversations);
  const [displayDrawer, setDisplayDrawer] = useState(true);

  const toggleDrawer = () => {
    setDisplayDrawer(!displayDrawer);
  };

  const changeActiveMessage = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  return (
    <Drawer>
      <section className='drawer'>
        <button
          className='drawer__toggle-btn'
          onClick={toggleDrawer}
        >
          <span className='form-field-icon'>
            {displayDrawer
              ? <ArrowDropDownOutlinedIcon sx={styles.iconStyles} />
              : <ArrowRightOutlinedIcon sx={styles.iconStyles} />}
          </span>
          {category === 'group'
            ? 'Departments'
            : 'Direct Messages'}
        </button>
        <nav className={`navbar ${displayDrawer ? '' : 'hidden'}`}>
          <ul className='drawer__menu'>
            {conversations && (
              conversations.map((conversation, i) => {
                return (
                  <li
                    key={i}
                    className='menu__items'
                  >
                    <button
                      onClick={() => changeActiveMessage(conversation)}
                      className={`menu__action${conversation.id === activeConversation.id ? '--active' : ''}`}
                    >
                      {conversation.name}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </nav>
      </section>
    </Drawer>
  );
}

const Drawer = styled.div`
button {
  border: none;
  outline: none;
  background-color: inherit;
  border-radius: var(--border-redius-small-xs);
  // color: var(--light-blue);
  color: var(--color-secondry);
  display: inline-block;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: var(--color-primary);
    // background-color: var(--light-grey);
    // background-color: var(--color-primary-light);
  }
}

.drawer {
  &__toggle-btn {
    padding: var(--padding-sm);
  }

}

.navbar {
  padding: 0 0.5rem;
}

.menu {
  padding: 0 5px;
  &__action {
    padding: 0.5rem var(--padding-sm);

    &--active {
      padding: 0.5rem var(--padding-sm);
      background-color: var(--color-primary);
      color: var(--color-secondry-light);
    }
  }
}

`;

export default Conversations;
