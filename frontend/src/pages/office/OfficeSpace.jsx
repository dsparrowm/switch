import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function OfficeSpace() {
  const { officeId } = useParams();
  console.log(useParams())
  return (
    <PageWrapper>
      <header>
        My OfficeSpace {officeId}
      </header>
      <Main>
        <aside>
          List of Departments Or Channels
          <nav>
            <ul className='menu'>
              <li className='menu-item'>
                <button className='menu-links'>Channel 1</button>
              </li>
              <li className='menu-item'>
                <button className='menu-links'>Channel 2</button>
              </li>
              <li className='menu-item'>
                <button className='menu-links'>Channel 3</button>
              </li>
            </ul>
          </nav>
        </aside>
        <section>
          Department Or Channel messages
        </section>
      </Main>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column; 
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Main = styled.main`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 30% 70%;
  border: 1px solid red;
  height: 100%;
  overflow-y: hidden;

  aside, section {
    overflow-y: auto;
    border: 1px solid blue;
  }
`;

export default OfficeSpace;