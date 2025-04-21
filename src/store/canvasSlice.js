import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: null,
  scale: 1,
  position: { x: 0, y: 0 },
  stencil: {
    width: 600,
    height: 600,
    borderRadius: 20,
    shape: 'rectangle', // Default shape
  },
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
    removeImage: (state) => {
      state.image = null;
      state.scale = 1;
      state.position = { x: 0, y: 0 };
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setStencilShape: (state, action) => {
      state.stencil.shape = action.payload;
    },
    resetTransformations: (state) => {
      state.scale = 1;
      state.position = { x: 0, y: 0 };
    },
  },
});

export const { 
  setImage, 
  removeImage, 
  setScale, 
  setPosition, 
  setStencilShape, 
  resetTransformations 
} = canvasSlice.actions;

export default canvasSlice.reducer; 