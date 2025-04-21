import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { removeImage } from '../store/canvasSlice';

const Button = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 10px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background-color: #c82333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const RemoveButton = () => {
  const dispatch = useDispatch();
  const { image } = useSelector((state) => state.canvas);

  const handleRemove = () => {
    dispatch(removeImage());
  };

  return (
    <Button onClick={handleRemove} disabled={!image}>
      Remove Image
    </Button>
  );
};

export default RemoveButton; 