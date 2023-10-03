import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Avatar from '@mui/material/Avatar';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {
  setDepartmentConversation
} from '../features/conversations/conversationSlice';
import { setOrganization } from '../features/organization/organizationSlice';
import { setOrgStaffs } from '../features/organization/staffSlice';
import {
  setActiveTab,
} from '../features/ui/uiSlice';

import CustomModal from './modals/CustomModal';
import HandleFormInputError from '../components/HandleFormInputError';
import Toast from '../components/Alert';

import {
  createNewDepartmentRoute,
  getOrganizationByIdRoute,
  getUsersByOrganizationIdRoute
} from '../utils/APIRoutes';
import { stringAvatarSmall } from '../utils/helpers';
import { getRequest, postRequest } from '../utils/api';

const ICON_SMALL = 24;

function Conversations ({ category, conversations }) {
  const { officeId, conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [addingNewDept, setAddingNewDept] = useState(false);
  const [activeChartId, setActiveChartId] = useState(null);

  useEffect(() => {
    let ignore = false;
    if (location.pathname && !ignore) {
      setActiveChartId(parseInt(conversationId));
    }

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  const handleChange = (e) => {
    setSetFromData({ ...formDate, [e.target.name]: e.target.value });
  };

  const closeCreateModal = () => setOpenCreateModal(false);

  const handleOpenModal = () => {
    if (category === 'group') {
      setOpenCreateModal(true);
    } else {
      const setDMsObj = {
        type: 'DMs',
        name: 'Direct Messages'
      };
      dispatch(setActiveTab(setDMsObj));
      // Get all users in current organization
      getRequest(getUsersByOrganizationIdRoute, {
        id: organization.id
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

  const getOrganization = async () => {
    try {
      getRequest(getOrganizationByIdRoute, {
        orgId: organization.id
      })
        .then(res => {
          if (res?.data?.isSuccess) {
            const { org } = res?.data;
            const { departments } = org;
            dispatch(setOrganization(org));
            dispatch(setDepartmentConversation(departments));
          }
          closeCreateModal();
        })
        .catch(err => console.error(err));

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse('');
    if (handleValidation()) {
      setAddingNewDept(true)
      const { name } = formDate;
      const formatedName = name
        .toLocaleLowerCase()
        .replaceAll(' ', '-');

      postRequest(createNewDepartmentRoute, {
        userId: user.id,
        departmentName: formatedName,
        orgId: organization.id
      })
        .then(res => {
          console.log(res);
          if (res?.data?.isSuccess) {
            getOrganization();
          } else {
            setApiResponse(res?.data?.message);
          }
          setAddingNewDept(false)
        })
        .catch(err => {
          setAddingNewDept(false);
          setApiResponse(err.response.data.message);
          console.error(err);
        });
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
    console.log(conversation);
    dispatch(setActiveTab({ ...conversation, type: convoType }));
    navigate(`/office/${officeId}/${conversation.id}`);
  };

  return (
    <Drawer>
      <section className='drawer'>
        <Button
          className='drawer__toggle-btn'
          onClick={toggleDrawer}
        >
          <Stack
            direction='row'
            alignItems='center'
            spacing={1}
          >
            {displayDrawer
              ? (
                <ArrowDropDownOutlinedIcon
                  className='drawer__toggle-btn__icon'
                  sx={{ width: ICON_SMALL, height: ICON_SMALL }}
                />)
              : (
                <ArrowRightOutlinedIcon
                  className='drawer__toggle-btn__icon'
                  sx={{ width: ICON_SMALL, height: ICON_SMALL }}
                />)}
            <span>
              {category === 'group'
                ? 'Departments'
                : 'Direct Messages'}
            </span>
          </Stack>
        </Button>
        <div className={`navbar ${displayDrawer ? '' : 'hidden'}`}>
          <nav>
            <ul className='drawer__menu'>
              {conversations && (
                conversations.map((conversation, i) => {
                  return (
                    <li
                      key={i}
                      className='menu__items'
                    >
                      {conversation.id}
                      <Button
                        onClick={() => changeActiveMessage(conversation)}
                        className={`menu__action menu__action${conversation.id === activeChartId ? '--active' : ''}`}
                      >
                        <Stack
                          direction='row'
                          alignItems='center'
                          spacing={1}
                        >
                        {category === 'group'
                          ? (<TagOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />)
                          : (
                              conversation?.img
                                ? <Avatar sx={{ width: ICON_SMALL, height: ICON_SMALL }} src={conversation.img} />
                                : <Avatar {...stringAvatarSmall(conversation.name, ICON_SMALL)} />)}
                          <span>
                            {conversation.name}
                          </span>
                        </Stack>
                      </Button>
                    </li>
                  );
                })
              )}
            </ul>
          </nav>
          <div>
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
          </div>
        </div>
      </section>
      <section className='add-conversation'>
        <CustomModal
          openModal={openCreateModal}
          onCloseModal={closeCreateModal}
          title='Create New Department'
        >
          {apiResponse && (
            <Toast
              type='error'
              isOpen={apiResponse.length > 0}
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
                {addingNewDept
                ? <CircularProgress size={25} />
                : 'Submit'}
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
  // display: inline-block;
  justify-content: start;
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
    font-size: 90%;
    text-transform: none;
    text-align: left;
    width: 100%;

    &:hover .drawer__toggle-btn__icon {
      background-color: var(--color-primary);
      color: var(--color-white);
      border-radius: var(--border-redius-small-xs);
    }
  }

}

.navbar {
  padding: 0 0.5rem;
}

.menu {
  &__items {
    padding: 0 var(--padding-sm);
  }

  &__action {
    font-size: 90%;
    text-transform: none;

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
