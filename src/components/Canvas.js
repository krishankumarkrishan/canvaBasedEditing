import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setPosition, setScale } from '../store/canvasSlice';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
  position: relative;
`;

const Frame = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  overflow: hidden;
  border: 2px solid #000;
  box-shadow: 0 5px 10px rgba(0,0,0,0.3);
  ${props => {
    switch (props.shape) {
      case 'circle':
        return 'border-radius: 50%;';
      case 'triangle':
        return `
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          border: none;
          background: white;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #000;
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          }
        `;
      case 'star':
        return `
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          border: none;
          background: white;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #000;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          }
        `;
      case 'heart':
        return `
          clip-path: path('M50,15 C25,-5 0,15 0,40 C0,65 25,85 50,95 C75,85 100,65 100,40 C100,15 75,-5 50,15');
          border: none;
          background: white;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #000;
            clip-path: path('M50,15 C25,-5 0,15 0,40 C0,65 25,85 50,95 C75,85 100,65 100,40 C100,15 75,-5 50,15');
          }
        `;
      default: // rectangle
        return `border-radius: ${props.borderRadius}px;`;
    }
  }}
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const dispatch = useDispatch();
  const { image, stencil, scale } = useSelector((state) => state.canvas);
  const frameSize = Math.min(stencil.width, stencil.height) * 0.7;

  // Initialize canvas once
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: frameSize,
      height: frameSize,
      selection: false,
      backgroundColor: 'transparent'
    });
    fabricCanvasRef.current = canvas;

    // Handle resize
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      canvas.setWidth(container.clientWidth);
      canvas.setHeight(container.clientHeight);
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Add mouse wheel handler for zoom
    const handleMouseWheel = (opt) => {
      const evt = opt.e;
      const delta = evt.deltaY;
      let newZoom = canvas.getZoom() * (0.999 ** delta);
      
      // Limit zoom
      if (newZoom > 3) newZoom = 3;
      if (newZoom < 0.1) newZoom = 0.1;

      // Get mouse position relative to canvas
      const pointer = canvas.getPointer(evt);
      const point = new fabric.Point(pointer.x, pointer.y);
      
      // Update zoom
      canvas.zoomToPoint(point, newZoom);
      dispatch(setScale(newZoom));
      
      evt.preventDefault();
      evt.stopPropagation();
    };

    canvas.on('mouse:wheel', handleMouseWheel);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [frameSize]);

  // Handle scale changes from Redux (zoom buttons)
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const currentZoom = canvas.getZoom();
    if (Math.abs(currentZoom - scale) > 0.01) {
      const center = new fabric.Point(
        canvas.width / 2,
        canvas.height / 2
      );
      canvas.zoomToPoint(center, scale);
      canvas.renderAll();
    }
  }, [scale]);

  // Handle image changes
  useEffect(() => {
    if (!image || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.clear();

    fabric.Image.fromURL(image, img => {
      // Calculate initial scale to fit inside frame
      const initialScale = Math.min(
        frameSize / img.width,
        frameSize / img.height
      );

      img.set({
        left: frameSize / 2,
        top: frameSize / 2,
        originX: 'center',
        originY: 'center',
        scaleX: initialScale,
        scaleY: initialScale,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        transparentCorners: false,
        cornerColor: 'rgba(0,0,0,0.5)',
        cornerSize: 10,
        lockUniScaling: false
      });

      canvas.add(img);
      canvas.setActiveObject(img);

      // Add event handlers
      img.on('moving', () => {
        // Keep image within frame bounds
        const bound = frameSize / 2;
        const imgBounds = img.getBoundingRect();
        
        if (img.left < -bound) img.left = -bound;
        if (img.left > bound) img.left = bound;
        if (img.top < -bound) img.top = -bound;
        if (img.top > bound) img.top = bound;
        
        dispatch(setPosition({ x: img.left, y: img.top }));
        canvas.renderAll();
      });
      
      img.on('scaling', () => {
        // Ensure minimum scale to cover frame
        const minScale = Math.min(
          frameSize / img.width,
          frameSize / img.height
        );
        
        if (img.scaleX < minScale) {
          img.scale(minScale);
        }
        
        dispatch(setScale(img.scaleX));
        canvas.renderAll();
      });
      
      canvas.renderAll();
    });
  }, [image, frameSize]);

  return (
    <CanvasContainer>
      <Frame 
        size={frameSize} 
        shape={stencil.shape}
        borderRadius={stencil.borderRadius}
      >
        <StyledCanvas ref={canvasRef} />
      </Frame>
    </CanvasContainer>
  );
};

export default Canvas; 