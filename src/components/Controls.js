import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setScale, resetTransformations } from '../store/canvasSlice';

const ControlsContainer = styled.div`
  padding: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Controls = () => {
  const dispatch = useDispatch();
  const { scale } = useSelector((state) => state.canvas);

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    dispatch(setScale(newScale));
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.1);
    dispatch(setScale(newScale));
  };

  const handleReset = () => {
    dispatch(resetTransformations());
  };

  return (
    <ControlsContainer>
      <Button onClick={handleZoomIn}>Zoom In</Button>
      <Button onClick={handleZoomOut}>Zoom Out</Button>
      <Button onClick={handleReset}>Reset</Button>
    </ControlsContainer>
  );
};

export default Controls; 