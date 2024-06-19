import React, { ReactNode } from "react";
import styled from 'styled-components';

interface ButtonProp {
  onClick?: () => void;
  disabled: boolean;
  children:   string;
}

const StyledButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Button: React.FC<ButtonProp> = ({
  children,
  disabled,
  onClick,
  
}) => {
    console.log(children)
  return (
    <StyledButton  onClick={() => onClick && onClick(children)} disabled={disabled}>
     {children}
    </StyledButton>
  );
};
