import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import styled from 'styled-components';
import Canvas from './components/Canvas';
import ImageUpload from './components/ImageUpload';
import Controls from './components/Controls';
import ShapeSelector from './components/ShapeSelector';
import RemoveButton from './components/RemoveButton';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <CanvasWrapper>
          <ShapeSelector />
          <ImageUpload />
          <Canvas />
          <ControlsContainer>
            <Controls />
            <RemoveButton />
          </ControlsContainer>
        </CanvasWrapper>
      </AppContainer>
    </Provider>
  );
}

export default App;
