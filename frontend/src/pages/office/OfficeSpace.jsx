import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import MessageContainer from '../../components/MessageContainer';

function OfficeSpace () {
  const { pageId } = useParams();
  return (
    <PageWrapper>
      <div className={`row ${pageId ? 'col-2' : ''}`}>
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
