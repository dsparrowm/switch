import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {
  setActiveConversation,
  addNewConversation
} from '../features/conversations/conversationSlice';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CustomModal from './modals/CustomModal';
import HandleFormInputError from '../components/HandleFormInputError';
import { createNewDepartmentRoute } from "../utils/APIRoutes";
import Axios from '../utils/Axios';
import Toast from '../components/Alert';

const styles = {
  iconStyles: {
    fontSize: 'large'
  }
};

function Conversations ({ category, conversations }) {
  const dispatch = useDispatch();
  const activeConversation = useSelector((state) => state.conversations.activeConversations);
  const user = useSelector((state) => state.auth.user);
  const organization = useSelector((state) => state.organization);
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formErrorMsgs, setFormErrorMsgs] = useState('');
  const [inValidField, setInValidField,] = useState(false);
  const [formDate, setSetFromData] = useState({
    name: '',
    type: 'Public'
  });
  const [apiResponse, setApiResponse] = useState('');

  const handleChange = (e) => {
    setSetFromData({ ...formDate, [e.target.name]: e.target.value });
  };

  const handleOpenModal = () => setOpenCreateModal(true);

  const handleCloseModal = () => {
    setOpenCreateModal(!openCreateModal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiResponse('');
    if (handleValidation()) {
      const { name } = formDate;
      const formatedName = name.toLocaleLowerCase().replaceAll(' ', '-');
      try {
        console.log(user, formatedName, organization.id, 'sa;doioeiw');
        const { data } = Axios.post(createNewDepartmentRoute, {
          userId: user.id,
          departmentName: formatedName,
          orgId: organization.id
        })
        if (data.isSuccess) {
          dispatch(addNewConversation({
            id: 100,
            name: formatedName,
          }))
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
  }

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
            ? ' Departments'
            : ' DM'}
        </button>

        <CustomModal
          isOpen={openCreateModal}
          onCloseModal={handleCloseModal}
          title={`Create ${category === 'group' ? 'Department': 'DM'}`}
        >
          {apiResponse && (
            <Toast
              type='error'
              isOpen={apiResponse.length}
              msg={apiResponse}
            />)}
          <form
            onSubmit={handleSubmit}>
              {category === 'group'
              ?  (
              <>
                <div className='form-group'>
                  <input
                    type='text'
                    placeholder='Type name'
                    name='name'
                    className={`${inValidField ? 'invalid' : formDate.name && 'valid'}`}
                    onChange={(e) => handleChange(e)}
                  />
                  <HandleFormInputError
                    state={inValidField}
                    msg={formErrorMsgs}
                  />
                </div>
                {/* <div className='form-group'>
                  <h4>Visibility</h4>
                  <p>
                    <input
                      type='radio'
                      name='type'
                      value='Public'
                      checked
                      onChange={(e) => handleChange(e)}
                    /> Public - For all to see
                  </p>
                  <p>
                    <input
                      type='radio'
                      name='type'
                      value='Private'
                      onChange={(e) => handleChange(e)}
                    /> Private - For specific people
                  </p>
                </div> */}
              </>)
              : ''
              }
            <div className='form-group'>
              <button
                className='submit-button button-secondry button'
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

.add-conversation {
  .add-conversation__btn {
    padding: var(--padding-sm);
    color: var(--color-secondry);
    background-color: inherit;

    .add-conversation__btn__icon {
      margin-right: 1rem;
      background-color: var(--light-grey);
    }
  }
}
`;

export default Conversations;
