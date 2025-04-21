import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setStencilShape } from '../store/canvasSlice';

const ShapeContainer = styled.div`
  padding: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ShapeButton = styled.button`
  width: 50px;
  height: 50px;
  border: 2px solid #007bff;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
  }

  &.active {
    background: #007bff;
    color: white;
  }
`;

const shapes = [
  { type: 'rectangle', label: '□' },
  { type: 'circle', label: '○' },
  { type: 'triangle', label: '△' },
  { type: 'star', label: '★' },
  // { type: 'heart', label: '❤' },
];

const ShapeSelector = () => {
  const dispatch = useDispatch();

  const handleShapeSelect = (shapeType) => {
    dispatch(setStencilShape(shapeType));
  };

  return (
    <ShapeContainer>
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.type}
          onClick={() => handleShapeSelect(shape.type)}
          title={shape.type}
        >
          {shape.label}
        </ShapeButton>
      ))}
    </ShapeContainer>
  );
};

export default ShapeSelector; 