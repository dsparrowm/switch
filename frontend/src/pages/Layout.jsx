import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSide from '../components/LeftSid';
import SearchBar from '../components/SearchBar';
import styled from 'styled-components';

function Layout () {
  return (
    <Container>
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
