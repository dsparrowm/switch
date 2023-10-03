import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LeftSide from '../components/LeftSid';
import SearchBar from '../components/SearchBar';
import styled from 'styled-components';

import { selectOfficeSpace, setActiveTab, setUpOfficeSpace } from '../features/ui/uiSlice';
import { selectCurrentUserToken, selectCurrentUser } from '../features/auth/authSlice';
import { getDirectMessagesRoute, getOrganizationByIdRoute } from '../utils/APIRoutes';
import { setOrganization } from '../features/organization/organizationSlice';
import { getRequest, setAuthToken } from '../utils/api';
import { setDepartmentConversation, setPrivateConversation } from '../features/conversations/conversationSlice';

function Layout () {
  const token = useSelector(selectCurrentUserToken);
  const { officeId } = useParams();
  const office = useSelector(selectOfficeSpace);
  const navigate = useNavigate();
  let ignore = false;
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ignore) {
      setAuthToken(token);
      // Get Organization Information by ID.
      getRequest(getOrganizationByIdRoute, { orgId: officeId })
        .then(res => {
          if (res?.data?.isSuccess) {
            const { org } = res?.data;
            const { departments } = org;
            dispatch(setOrganization(org));
            dispatch(setDepartmentConversation(departments));
            dispatch(setActiveTab({ ...departments[0], type: 'group' }));
            dispatch(setUpOfficeSpace({
              loading: false,
              default: departments[0].id
            }));
          }
        })
        .catch((err) => {
          console.error(err);
          dispatch(setUpOfficeSpace({
            loading: false,
            default: 0
          }));
        });

      // Get Direct Message Summary
      getRequest(getDirectMessagesRoute, { userId: user.id })
        .then(res => {
          if (res?.data) {
            const formatedRes = res.data.map((dm) => {
              const isLoginUser = dm.senderId === user.id;
              const displayUser = dm.senderId === user.id ? dm.recipient : dm.sender;
              const updatedDm = {
                ...dm,
                isLoginUser,
                name: displayUser.name,
                recipientId: displayUser.id
              };
              return updatedDm;
            });
            dispatch(setPrivateConversation(formatedRes));
          }
        })
        .catch((err) => console.error(err));
    }

    return () => {
      // eslint-disable-next-line
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!office.loading) {
      navigate(`/office/${officeId}/${office.default}`);
    }
  }, [office.loading]);

  return (
    <Container>
      {!office.loading &&
        <>
          <header>
            <SearchBar />
          </header>
          <Main>
            <LeftSide />
            <Outlet />
            {/* <div className={`d-grid ${params.nestedId ? 'col-3' : 'col-2'}`}>
              <MessageContainer />
            </div> */}
          </Main>
        </>}
    </Container>
  );
}

const Container = styled.div`
  background-color: var(--theme-light-bg);
  color: var(--theme-light-fg);
  display: flex;
  flex-direction: column; 
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  header {
    // overflow-y: auto;
    border-bottom: var(--sw-border);
    background-color: var(--color-primary);
  }
`;

const Main = styled.main`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 220px auto;
  overflow-y: hidden;

//  .d-grid {
//  }
//   // height: 100%;

//   .col-2 {
//     grid-template-columns: 220px auto;
//   }

//   .col-3 {
//     grid-template-columns: 220px auto 220px;
//   }
`;

export default Layout;
