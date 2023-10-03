import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Stack } from '@mui/material';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { useLocation, Link, useParams } from 'react-router-dom';

const ICON_SMALL = 24;

function QuickActionMenu () {
  const { officeId } = useParams();
  const location = useLocation();
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    let ignore = false;
    if (location.pathname && !ignore) {
      const subPath = location.pathname
        .split('/')
        .slice(-1)[0];

      setActivePage(subPath);
    }

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  return (
    <Container>
      <div className='quick-actions'>
        <nav className='quick-actions__menu'>
          <ul className='quick-actions__menu__items'>
            <li className='quick-actions__menu__items__item'>
              <Link
                className={`quick-actions__menu__items__item__btn quick-actions__menu__items__item__btn${activePage === 'tasks' ? '--active' : ''}`}
                to={`/office/${officeId}/tasks`}
              >
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={1}
                >
                  <ListAltOutlinedIcon
                    className='quick-actions__menu__items__item__btn__icon'
                    sx={{ width: ICON_SMALL, height: ICON_SMALL }}
                  />
                  <span>Tasks</span>
                </Stack>
              </Link>
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
            border-radius: var(--border-redius-small-xs);
            color: inherit;
            display: inline-block;
            font-size: 90%;
            font-weight: var(--font-weight-bold);
            // padding: var(--padding-sm);
            padding: 6px 8px;
            text-transform: none;
            text-decoration: none;
            text-align: left;
            width: 100%;

            &:hover {
              background-color: var(--color-white);
              color: var(--color-primary);
            }

            &--active {
              background-color: var(--color-white);
              color: var(--color-primary);
            }

            &:hover .quick-actions__menu__items__item__btn__icon {
              background-color: var(--color-primary);
              color: var(--color-white);
              border-radius: var(--border-redius-small-xs);
            }
          }
        }
      }
    }
  }
`;

export default QuickActionMenu;
