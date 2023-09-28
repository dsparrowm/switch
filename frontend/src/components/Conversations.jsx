import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Avatar from '@mui/material/Avatar';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';

import {
  setActiveConversation,
  setDepartmentConversation
} from '../features/conversations/conversationSlice';
import { setOrganization } from '../features/organization/organizationSlice';
import { setOrgStaffs } from '../features/organization/staffSlice';

import CustomModal from './modals/CustomModal';
import HandleFormInputError from '../components/HandleFormInputError';
import Toast from '../components/Alert';

import {
  createNewDepartmentRoute,
  getOrganizationByIdRoute,
  getUsersByOrganizationIdRoute
} from '../utils/APIRoutes';
import getRequests from '../utils/APIRequest/getRequest';
import Axios from '../utils/Axios';
import { stringAvatarSmall } from '../utils/helpers';

const styles = {
  iconStyles: {
    fontSize: 'large'
  }
};

const ICON_SMALL = 24;

function Conversations ({ category, conversations }) {
  const dispatch = useDispatch();
  const activeConversation = useSelector((state) => state.conversations.activeConversations);
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.organization);
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formErrorMsgs, setFormErrorMsgs] = useState('');
  const [inValidField, setInValidField] = useState(false);
  const [formDate, setSetFromData] = useState({
    name: '',
    type: 'Public'
  });
  const [apiResponse, setApiResponse] = useState('');

  const handleChange = (e) => {
    setSetFromData({ ...formDate, [e.target.name]: e.target.value });
  };

  const handleOpenModal = () => {
    if (category === 'group') {
      setOpenCreateModal(true);
    } else {
      const setDMsObj = {
        type: 'DMs',
        name: 'Direct Messages'
      };
      dispatch(setActiveConversation(setDMsObj));
      // Get all users in current organization
      getRequests(getUsersByOrganizationIdRoute, {
        id: 3 // organization.id
      })
        .then(res => {
          const { data } = res;
          if (data.isSuccess) {
            dispatch(setOrgStaffs(data.users));
          }
        })
        .catch(err => console.error(err));
    }
  };

  // const handleCloseModal = () => {
  //   setOpenCreateModal(!openCreateModal);
  // };

  const getOrganization = async () => {
    try {
      const { data } = await Axios.get(getOrganizationByIdRoute, {
        params: { id: organization.id }
      });

      if (data.isSuccess) {
        const { departments } = data.getOrg;
        dispatch(setOrganization(data.getOrg));
        dispatch(setDepartmentConversation(departments));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse('');
    if (handleValidation()) {
      const { name } = formDate;
      const formatedName = name
        .toLocaleLowerCase()
        .replaceAll(' ', '-');

      try {
        const { data } = await Axios.post(createNewDepartmentRoute, {
          userId: user.id,
          departmentName: formatedName,
          orgId: organization.id
        });
        if (data.isSuccess) {
          getOrganization();
        } else {
          setApiResponse(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleValidation = () => {
    if (!formDate.name || formDate.name < 3) {
      setInValidField(true);
      if (!formDate.name) {
        setFormErrorMsgs('Required field - Please enter a name for your new department.');
      } else {
        setFormErrorMsgs('Invalid! name can not be less than 3-characters');
      }
      return false;
    }

    setInValidField(false);
    setFormErrorMsgs('');
    return true;
  };

  const toggleDrawer = () => {
    setDisplayDrawer(!displayDrawer);
  };

  const changeActiveMessage = (conversation) => {
    const convoType = category === 'group' ? category : 'private';
    dispatch(setActiveConversation({ ...conversation, type: convoType }));
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
                      className={`menu__action menu__action${conversation.id === activeConversation.id ? '--active' : ''}`}
                    >
                      <span>
                        {category === 'group'
                          ? (<TagOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />)
                          : (
                              conversation?.img
                                ? <Avatar sx={{ width: ICON_SMALL, height: ICON_SMALL }} src={conversation.img} />
                                : <Avatar {...stringAvatarSmall(conversation.name, ICON_SMALL)} />)}
                      </span>
                      <span>
                        {conversation.name}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </nav>
      </section>
      <section className='add-conversation'>
        <button
          onClick={handleOpenModal}
          className='add-conversation__btn'
        >
          <span className='add-conversation__btn__icon'>
            <AddOutlinedIcon />
          </span>
          Add
          {category === 'group'
            ? ' Department'
            : ' DM'}
        </button>

        <CustomModal
          openModal={openCreateModal}
          onCloseModal={() => setOpenCreateModal(false)}
          title='Create A New Department'
        >
          {apiResponse && (
            <Toast
              type='error'
              isOpen={apiResponse.length}
              msg={apiResponse}
            />)}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='departmentName'>Enter Department Name:</label>
              <input
                type='text'
                placeholder='Type name'
                name='name'
                id='departmentName'
                className={`${inValidField ? 'invalid' : formDate.name && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidField}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <button
                className='submit-button button-primary button'
                type='submit'
              >
                Submit
              </button>
            </div>
          </form>
        </CustomModal>
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
  color: var(--color-white);
  display: inline-block;
  text-align: left;
  width: 100%;
  font-weight: var(--font-weight-bold);

  &:hover {
    background-color: var(--color-white);
    color: var(--color-primary);
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
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem var(--padding-sm);

    &--active {
      background-color: var(--color-white);
      color: var(--color-primary);
    }
  }
}

.add-conversation {
  &__btn {
    display: flex;
    align-items: center;
    padding: var(--padding-sm);
    color: var(--theme-light-bg);
    background-color: inherit;

    &__icon {
      background-color: var(--color-white);
      border-radius: var(--border-redius-small-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
      margin-right: 1rem;
      padding: 0.3rem;
      
    }
    
    &:hover .add-conversation__btn__icon {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
  }
}
`;

export default Conversations;
