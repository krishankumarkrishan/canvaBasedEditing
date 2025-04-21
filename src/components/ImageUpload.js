import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setImage } from '../store/canvasSlice';

const UploadContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${props => props.disabled ? '#cccccc' : '#007bff'};
  color: white;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#0056b3'};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageUpload = () => {
  const dispatch = useDispatch();
  const { stencil } = useSelector((state) => state.canvas);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setImage(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UploadContainer>
      <UploadButton disabled={!stencil.shape}>
        Upload Image
        <HiddenInput
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={!stencil.shape}
        />
      </UploadButton>
    </UploadContainer>
  );
};

export default ImageUpload; 