import React from 'react'
import styled from 'styled-components';
import RightSide from '../../components/RightSide';

function UserDetails() {

  return (
    <PageWrapper>
      <RightSide title='Profile'>
        <div className='red'>
        Daniel Jackson07:25
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Daniel Jackson07:25
        </div>
      </RightSide>
    </PageWrapper>
  )
}

const PageWrapper = styled.aside`

`;

export default UserDetails;