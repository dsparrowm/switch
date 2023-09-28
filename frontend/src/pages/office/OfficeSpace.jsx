import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import MessageContainer from '../../components/MessageContainer';

import getRequests from '../../utils/APIRequest/getRequest';
import {
  getOrganizationByIdRoute,
  getDirectMessagesRoute
} from '../../utils/APIRoutes';

import {
  setActiveConversation,
  setDepartmentConversation,
  setPrivateConversation
} from '../../features/conversations/conversationSlice';

import { setOrganization } from '../../features/organization/organizationSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

function OfficeSpace () {
  let ignore = false;
  const user = useSelector(selectCurrentUser);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ignore) {
      // Get Organization Information by ID.
      getRequests(getOrganizationByIdRoute, { id: params.officeId })
        .then(res => {
          if (res?.data?.isSuccess) {
            const { getOrg } = res?.data;
            const { departments } = getOrg;
            dispatch(setOrganization(getOrg));
            dispatch(setDepartmentConversation(departments));
            dispatch(setActiveConversation({ ...departments[0], type: 'group' }));
          }
        })
        .catch((err) => console.error(err));

      // Get Direct Message Summary
      getRequests(getDirectMessagesRoute, { userId: user.id })
        .then(res => {
          if (res?.data) {
            // console.log(res.data);
            const formatedRes = res.data.map((dm) => {
              const isLoginUser = dm.senderId === user.id;
              const displayUser = dm.senderId === user.id ? dm.recipient : dm.sender;
              const updatedDm = {
                ...dm,
                isLoginUser,
                name: displayUser.name
              };
              return updatedDm;
            });
            // console.log(formatedRes, 'formated');
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

  return (
    <PageWrapper>
      <div className={`row ${params.pageId ? 'col-2' : ''}`}>
        <MessageContainer />
        <Outlet />
      </div>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
 .row {
  display: grid;
  grid-template-columns: 1fr;
 }

 .col-2 {
  grid-template-columns: auto 300px;
 }

`;

export default OfficeSpace;
