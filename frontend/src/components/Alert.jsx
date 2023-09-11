import React from 'react';
import styled, { css } from 'styled-components';

function Alert ({ type, msg }) {
  return (
    <AlertContainer $theme={type}>
      <p>{msg}</p>
    </AlertContainer>
  );
}

const AlertContainer = styled.div`
  padding: 8px 16px;
  word-break: break-word;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.5s ease 0s;

  ${(props) => {
    switch (props.$theme) {
      case 'error':
        return css`
        background-color: rgba(224, 30, 90, .1);
        border-color: rgba(224, 30, 90, .4);
        `;
      default:
        return css`
        background-color: var(--color-green);
        background-color: rgba(8, 128, 91, .1);
        border-color: rgba(8, 128, 91, .4);
        `;
    }
  }}
`;

export default Alert;
