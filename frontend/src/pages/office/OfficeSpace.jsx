import React from 'react';
// import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LeftSideBar from '../../components/LeftSideBar';
import SearchBar from '../../components/SearchBar';
import MessageContainer from '../../components/MessageContainer';

function OfficeSpace () {
  // const { officeId } = useParams();
  // console.log(useParams())
  return (
    <PageWrapper>
      <header>
        <SearchBar />
      </header>
      <Main>
        <LeftSideBar />
        <MessageContainer />
      </Main>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
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
  }
`;

const Main = styled.main`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 220px auto;
  height: 100%;
  overflow-y: hidden;
`;

export default OfficeSpace;
