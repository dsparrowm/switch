import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { setSelectedMessage } from '../features/messages/messages';

const styles = {
  iconStyles: {
    fontSize: 'large'
  }
};

function MessageList ({ category, messages }) {
  const dispatch = useDispatch();
  const selectedMsg = useSelector((state) => state.messages.selectedMessage);
  const [displayDrawer, setDisplayDrawer] = useState(true);

  const toggleDrawer = () => {
    setDisplayDrawer(!displayDrawer);
  };

  const changeActiveMessage = (message) => {
    dispatch(setSelectedMessage(message.id));
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
            {messages && (
              messages.map((message, i) => {
                return (
                  <li
                    key={i}
                    className='menu__items'
                  >
                    <button
                      onClick={() => changeActiveMessage(message)}
                      className={`menu__action${message.id === selectedMsg.id ? '--active' : ''}`}
                    >
                      {message.name}
                    </button>
                  </li>
                );
              })
            )}
            {/* <li className='menu-items'>
              <button className='menu__action menu__action--active'>Channel 2</button>
            </li>
            <li className='menu-items'>
              <button className='menu__action menu__action--active'>Channel 3</button>
            </li> */}
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

export default MessageList;
