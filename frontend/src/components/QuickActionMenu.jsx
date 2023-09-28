import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

function QuickActionMenu () {
  return (
    <Container>
      <div className='quick-actions'>
        <nav className='quick-actions__menu'>
          <ul className='quick-actions__menu__items'>
            <li className='quick-actions__menu__items__item'>
              <Button
                className='quick-actions__menu__items__item__btn'
                href='#contained-buttons'
              >
                <span className='form-field-icon'><ListAltOutlinedIcon /></span>
                <span>Tasks</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </Container>
  );
}

const Container = styled.section`
  margin-top: 1rem; 
  .quick-actions {
    &__menu {
      &__items {
        &__item {
          &__btn {
            color: inherit;
            display: inline-block;
            // font-size: var(--font-size-medium);
            font-size: 100%;
            font-weight: var(--font-weight-bold);
            padding: var(--padding-sm);
            text-transform: none;
            text-align: left;
            width: 100%;

            &:hover {
              background-color: var(--color-white);
              color: var(--color-primary);
            }
          }
        }
      }
    }
  }
`;

export default QuickActionMenu;
