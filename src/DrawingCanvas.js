import React, { useEffect, useRef, useState } from 'react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState(null);
  const [isErasing, setIsErasing] = useState(false);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#a52a2a',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Canvas Dimensions:', canvas.width, canvas.height); // Debugging
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setContext(ctx);
  }, [color, brushSize]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = isErasing ? 'white' : color;
      context.lineWidth = isErasing ? 20 : brushSize;
    }
  }, [isErasing, context, color, brushSize]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    if (!context) return;
    
    canvasRef.current.style.cursor = 'none';

    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing || !context) return;

    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  };

  const toggleEraser = () => {
    console.log('Toggling Eraser:', !isErasing); // Debugging
    setIsErasing(!isErasing);
  };

  return (
    <div className="drawing-canvas" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Color Palette */}
      <div className="color-palette">
        {colors.map((clr) => (
          <button
            key={clr}
            onClick={() => { setColor(clr); setIsErasing(false); }}
            className={`color-button ${color === clr ? 'selected' : ''}`}
            style={{ backgroundColor: clr }}
          />
        ))}
      </div>

      {/* Brush Size Control */}
      <div className="brush-size-control">
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </div>

      {/* Canvas */}
      <div className="canvas-container" style={{ border: '2px solid red' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', cursor: 'none !important' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Control Buttons */}
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={downloadDrawing}>Download Drawing</button>
      <button onClick={toggleEraser}>{isErasing ? 'Use Brush' : 'Use Eraser'}</button>
    </div>
  );
};

export default DrawingCanvas;



