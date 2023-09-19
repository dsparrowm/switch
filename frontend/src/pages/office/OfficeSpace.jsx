import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import MessageContainer from '../../components/MessageContainer';

import Axios from '../../utils/Axios';
import { getOrganisationByIdRoute } from '../../utils/APIRoutes';

import {
  setActiveConversation,
  setDepartmentConversation
} from '../../features/conversations/conversationSlice';

import { setOrganisation } from '../../features/organization/organizationSlice';

function OfficeSpace () {
  let ignore = false;
  const params = useParams();
  const dispatch = useDispatch();

  const getOrganization = async () => {
    try {
      const { data } = await Axios.get(getOrganisationByIdRoute, { 
        params: { id: params.officeId }
      });
      
      if (data.isSuccess) {
        const { departments } = data.getOrg;
        dispatch(setOrganisation(data.getOrg));
        dispatch(setDepartmentConversation(departments));
        dispatch(setActiveConversation({...departments[0], type: 'group'}));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!ignore) {
      getOrganization();
    }

    return () => {
      ignore = true;
    }
  }, []);

  return (
    <PageWrapper>
        <div className={`row ${params.pageId ? 'col-2' : ''}`}>
          <MessageContainer />
          {<Outlet />}
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
  grid-template-columns: auto 220px;
 }

`;


export default OfficeSpace;
