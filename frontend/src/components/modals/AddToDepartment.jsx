import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Stack, ThemeProvider, createTheme } from '@mui/material';
import { selectOrganizationStaffs } from '../../features/organization/staffSlice';
import { addUsersToDepartmentRoute } from '../../utils/APIRoutes';
import {
  postRequest
} from '../../utils/api';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectActiveConversation } from '../../features/conversations/conversationSlice';
import Toast from '../Alert';

const theme = createTheme({
  typography: {
    body1: {
      fontSize: 'var(--font-size-medium)'
    }
  }
});

function AddToDepartment () {
  const [searchInputValue, setSearchInputValue] = useState('');
  const staffList = useSelector(selectOrganizationStaffs);
  const user = useSelector(selectCurrentUser);
  const activeConversation = useSelector(selectActiveConversation);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const changeOption = (newValue) => {
    console.log(newValue);
    setSelectedOptions(newValue);
    // dispatch(setActiveConversation(newValue));
    // dispatch(addNewPrivateConversation({ ...newValue, type: 'private' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userIds = selectedOptions.map(({ user }) => user.id);

    const data = {
      userIds: userIds,
      adminOrDeptHeadId: user.id,
      departmentId: activeConversation.id
    };

    postRequest(addUsersToDepartmentRoute, data)
      .then(res => {
        if (res?.data) {
          const { data } = res;
          setApiResponse({ message: data?.message, status: data?.isSuccess });
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Container>

      {apiResponse && (
        <Toast
          type={apiResponse?.status ? 'success' : 'error'}
          isOpen={apiResponse && true}
          msg={apiResponse?.message}
        />)}

      <p>
        All members added will have access to all content shared on this department!
      </p>

      <form onSubmit={handleSubmit}>
        <div className='search form-group'>
          <ThemeProvider theme={theme}>
            <Autocomplete
              multiple
              disabled={!staffList}
              disablePortal
              onChange={(event, newValue) => changeOption(newValue)}
              inputValue={searchInputValue}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
              className='search__container'
              getOptionLabel={(option) => option?.user?.name}
              options={staffList}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder='Search Users'
                  variant='standard'
                />)}
            />
          </ThemeProvider>
        </div>

        <div className='search__add form-group'>
          <Stack
            direction='row'
            justifyContent='flex-end'
          >
            <Button
              disabled={!selectedOptions || !selectedOptions.length}
              className='button-secondry'
              variant='contained'
              size='medium'
              type='submit'
            >
              Add
            </Button>
          </Stack>
        </div>
      </form>
    </Container>
  );
}

const Container = styled.div`
  .search {
    margin: 2rem 0;
    border: var(--sw-border);
    border-radius: var(--border-redius-small-xs);
    padding: 0.5rem;

    &__container {
      .MuiAutocomplete-tag {
        font-size: inherit;
      }

      input {
        border: none;
        color: var(--text-color);

        &:before {
          border: none;
        }

        &::placeholder {
          color: var(--text-color);
          font-style: italic;
          font-size: var(--font-size-medium);
          font-weight: var(--font-weight-regular);
        }
      }

      .css-yq9shg-MuiInputBase-root-MuiInput-root:before {
        border: none;
      }
    }

    &__add {
      .button-secondry {
        color: var(--color-white);
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        font-size: 1.08rem;
        font-weight: var(--font-weight-bold);

        &:disabled {
          color: rgba(0, 0, 0, 0.26);
          background-color: rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
`;

export default AddToDepartment;
