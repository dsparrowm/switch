import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const styles = {
  iconStyles: {
    fontSize: 'large'
  }
};

function MessageList ({ category }) {
  const [displayDrawer, setDisplayDrawer] = useState(true);

  const toggleDrawer = () => {
    setDisplayDrawer(!displayDrawer);
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
          {category === 'group' ? 'Departments' : 'Direct Messages'}
        </button>
        <nav className={`navbar ${displayDrawer ? '' : 'hidden'}`}>
          <ul className='drawer__menu'>
            <li className='menu__items'>
              <button
                className='menu__action menu__action--active'
              >
                Channel 1
              </button>
            </li>
            <li className='menu-items'>
              <button className='menu__action menu__action--active'>Channel 2</button>
            </li>
            <li className='menu-items'>
              <button className='menu__action menu__action--active'>Channel 3</button>
            </li>
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
    // background-color: var(--light-grey);
    background-color: var(--color-primary);
    // background-color: var(--color-primary-light);
  }
}

.drawer {
  &__toggle-btn {
    padding: var(--padding-sm);
  }

  &__toggle-btn--active,
  &__action--active {
    background-color: var(--light-grey);
    color: var(--color-secondry-light);
  }
}

.navbar {
  padding: 0 0.5rem;
}

.menu {
  padding: 0 5px;
  &__action {
    padding: 0.5rem var(--padding-sm);
  }
}

`;

export default MessageList;
