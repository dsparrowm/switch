import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Avatar from '@mui/material/Avatar';

function SearchBar () {
  const { officeId, conversationId } = useParams();
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Container>
      <div className='topbar'>
        <div className='topbar__left'>&nbsp;</div>
        <div className='topbar__search__container'>
          <button
            onClick={handleOpen}
            className='topbar__search'
          >
            <span className='topbar__search__icon'>
              <SearchOutlinedIcon sx={{ fontSize: '2rem' }} />
            </span>
            <span className='topbar__search__text'>
              switch
            </span>
          </button>
        </div>
        <div className='topbar__right'>
          <div className='topbar__right__avatar'>
            <Link to={`/office/${officeId}/${conversationId}/user/${user.id}`}>
              <Avatar
                variant='square'
                src='/static/images/avatar/1.jpg'
                sx={{ width: 24, height: 24 }}
                // alt={user.name}
              />
            </Link>
          </div>
        </div>
      </div>
      {open &&
        <div className='search-container'>
          <div className='search'>
            <button
              onClick={handleClose}
              className='search__close'
            >
              <CloseOutlinedIcon sx={{ fontSize: 'large' }} />
            </button>
            <div className='search__content'>
              Search Input will be here.
            </div>
          </div>
        </div>}
    </Container>
  );
}

const Container = styled.div`
button {
  border: none;
  outline: none;
  background-color: inherit;
}

.topbar {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  // background-color: var(--light-grey);
  color: var(--color-white);
  padding: 0.7rem 0;

  &__search {
    padding: 0.3rem;
    border: 1px solid var(--color-white);
    color: inherit;
    display: inline-block;
    border-radius: var(--border-redius-small-xs);
    width: 100%;

    &__icon {
      vertical-align: middle;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 1.5rem;
  }
}

.search-container {
  border-radius: var(--border-redius-small-xs);
  background-color: var(--theme-light-bg);
  font-size: var(--font-size-medium);
  position: absolute;
  top: 5rem;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  padding: 1rem;

  .search {
    position: relative;

    &__close {
      position: absolute;
      top: 5px;
      right: 2rem;
    }
  }
}
`;

export default SearchBar;
