import React, { useRef, useState, useEffect } from 'react';
import './Coloring.css';
import { useNavigate } from "react-router-dom";

const imageSources = {
  rose: '/images/rose.png',
  lotus: '/images/lotus.png',
  sunflower: '/images/sunflower.png',
  cat: '/images/cat.png',
  dog: '/images/dog.png',
  tiger: '/images/tiger.png',
};

const categoryMap = {
  Flowers: ['rose', 'lotus', 'sunflower'],
  Animals: ['cat', 'dog', 'tiger'],
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const Coloring = () => {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('brush');
  const [lineWidth, setLineWidth] = useState(5);
  const [undoStack, setUndoStack] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Flowers');
  const [shapeTool, setShapeTool] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [activeShape, setActiveShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [resizeHandle, setResizeHandle] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [shapes]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all shapes
    shapes.forEach(shape => {
      drawShapeOnCanvas(shape);
    });
  };

  const drawShapeOnCanvas = (shape) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.lineWidth;
    ctx.beginPath();

    const { x1, y1, x2, y2, type } = shape;
    const width = x2 - x1;
    const height = y2 - y1;

    switch (type) {
      case 'rectangle':
        ctx.rect(x1, y1, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        ctx.arc(x1 + width / 2, y1 + height / 2, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        break;
      case 'triangle':
        ctx.moveTo(x1 + width / 2, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        break;
      case 'star':
        drawStar(ctx, x1 + width / 2, y1 + height / 2, 5, Math.min(width, height) / 2, Math.min(width, height) / 4);
        break;
      case 'heart':
        drawHeart(ctx, x1 + width / 2, y1 + height / 2, Math.abs(width), Math.abs(height));
        break;
      default:
        break;
    }

    ctx.stroke();

    // Draw resize handles if shape is active
    if (activeShape && activeShape.id === shape.id) {
      drawResizeHandles(shape);
    }
  };

  const drawResizeHandles = (shape) => {
    const ctx = ctxRef.current;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    const { x1, y1, x2, y2 } = shape;
    const handleSize = 8;

    // Corners
    ctx.beginPath();
    ctx.rect(x1 - handleSize/2, y1 - handleSize/2, handleSize, handleSize);
    ctx.rect(x2 - handleSize/2, y1 - handleSize/2, handleSize, handleSize);
    ctx.rect(x1 - handleSize/2, y2 - handleSize/2, handleSize, handleSize);
    ctx.rect(x2 - handleSize/2, y2 - handleSize/2, handleSize, handleSize);
    // Sides
    ctx.rect(x1 + (x2 - x1)/2 - handleSize/2, y1 - handleSize/2, handleSize, handleSize);
    ctx.rect(x1 + (x2 - x1)/2 - handleSize/2, y2 - handleSize/2, handleSize, handleSize);
    ctx.rect(x1 - handleSize/2, y1 + (y2 - y1)/2 - handleSize/2, handleSize, handleSize);
    ctx.rect(x2 - handleSize/2, y1 + (y2 - y1)/2 - handleSize/2, handleSize, handleSize);
    
    ctx.fill();
    ctx.stroke();
  };

  const getResizeHandleAtPosition = (x, y, shape) => {
    const { x1, y1, x2, y2 } = shape;
    const handleSize = 8;
    const tolerance = 10;

    // Check corners
    if (isPointInRect(x, y, x1 - handleSize/2, y1 - handleSize/2, handleSize, handleSize, tolerance)) return 'nw';
    if (isPointInRect(x, y, x2 - handleSize/2, y1 - handleSize/2, handleSize, handleSize, tolerance)) return 'ne';
    if (isPointInRect(x, y, x1 - handleSize/2, y2 - handleSize/2, handleSize, handleSize, tolerance)) return 'sw';
    if (isPointInRect(x, y, x2 - handleSize/2, y2 - handleSize/2, handleSize, handleSize, tolerance)) return 'se';
    // Check sides
    if (isPointInRect(x, y, x1 + (x2 - x1)/2 - handleSize/2, y1 - handleSize/2, handleSize, handleSize, tolerance)) return 'n';
    if (isPointInRect(x, y, x1 + (x2 - x1)/2 - handleSize/2, y2 - handleSize/2, handleSize, handleSize, tolerance)) return 's';
    if (isPointInRect(x, y, x1 - handleSize/2, y1 + (y2 - y1)/2 - handleSize/2, handleSize, handleSize, tolerance)) return 'w';
    if (isPointInRect(x, y, x2 - handleSize/2, y1 + (y2 - y1)/2 - handleSize/2, handleSize, handleSize, tolerance)) return 'e';

    return null;
  };

  const isPointInRect = (x, y, rectX, rectY, rectW, rectH, tolerance = 0) => {
    return x >= rectX - tolerance && x <= rectX + rectW + tolerance &&
           y >= rectY - tolerance && y <= rectY + rectH + tolerance;
  };

  const isPointInShape = (x, y, shape) => {
    const { x1, y1, x2, y2, type } = shape;
    const width = x2 - x1;
    const height = y2 - y1;
    const centerX = x1 + width / 2;
    const centerY = y1 + height / 2;
    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

    switch (type) {
      case 'rectangle':
        return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
               y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
      case 'circle':
        return Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) <= radius;
      case 'line':
        // Simple line hit detection - could be improved
        const dist = distanceToLine(x, y, x1, y1, x2, y2);
        return dist < 10;
      case 'triangle':
        return pointInTriangle(x, y, x1 + width / 2, y1, x1, y2, x2, y2);
      case 'star':
      case 'heart':
        // For complex shapes, use bounding box for simplicity
        return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
               y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
      default:
        return false;
    }
  };

  const distanceToLine = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const pointInTriangle = (x, y, x1, y1, x2, y2, x3, y3) => {
    const A = area(x1, y1, x2, y2, x3, y3);
    const A1 = area(x, y, x2, y2, x3, y3);
    const A2 = area(x1, y1, x, y, x3, y3);
    const A3 = area(x1, y1, x2, y2, x, y);
    return Math.abs(A - (A1 + A2 + A3)) < 0.1;
  };

  const area = (x1, y1, x2, y2, x3, y3) => {
    return Math.abs((x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2))/2);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    // First check if we're clicking on a shape to select/move/resize it
    if (tool === 'select') {
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        const handle = getResizeHandleAtPosition(offsetX, offsetY, shape);
        if (handle) {
          setResizeHandle(handle);
          setActiveShape(shape);
          setStartPos({ x: offsetX, y: offsetY });
          return;
        }
        if (isPointInShape(offsetX, offsetY, shape)) {
          setActiveShape(shape);
          setStartPos({ x: offsetX, y: offsetY });
          return;
        }
      }
      // Clicked on empty space - deselect
      setActiveShape(null);
      setResizeHandle(null);
      redrawCanvas();
      return;
    }

    if (shapeTool) {
      setStartPos({ x: offsetX, y: offsetY });
      saveState();
      return;
    }

    if (tool !== 'brush' && tool !== 'eraser') return;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    saveState();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || (tool !== 'brush' && tool !== 'eraser')) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = ({ nativeEvent }) => {
    if (tool === 'brush' || tool === 'eraser') {
      ctxRef.current.closePath();
      setIsDrawing(false);
    }

    if (shapeTool && startPos) {
      const { offsetX, offsetY } = nativeEvent;
      const newShape = {
        id: Date.now(),
        type: shapeTool,
        x1: startPos.x,
        y1: startPos.y,
        x2: offsetX,
        y2: offsetY,
        color,
        lineWidth,
      };
      setShapes([...shapes, newShape]);
      setActiveShape(newShape);
      setStartPos(null);
    }

    if (tool === 'select' && activeShape && startPos) {
      const { offsetX, offsetY } = nativeEvent;
      if (resizeHandle) {
        // Resize the shape
        const updatedShapes = shapes.map(shape => {
          if (shape.id === activeShape.id) {
            let { x1, y1, x2, y2 } = shape;
            const dx = offsetX - startPos.x;
            const dy = offsetY - startPos.y;

            switch (resizeHandle) {
              case 'nw':
                x1 += dx;
                y1 += dy;
                break;
              case 'ne':
                x2 += dx;
                y1 += dy;
                break;
              case 'sw':
                x1 += dx;
                y2 += dy;
                break;
              case 'se':
                x2 += dx;
                y2 += dy;
                break;
              case 'n':
                y1 += dy;
                break;
              case 's':
                y2 += dy;
                break;
              case 'w':
                x1 += dx;
                break;
              case 'e':
                x2 += dx;
                break;
            }

            return { ...shape, x1, y1, x2, y2 };
          }
          return shape;
        });
        setShapes(updatedShapes);
      } else {
        // Move the shape
        const dx = offsetX - startPos.x;
        const dy = offsetY - startPos.y;
        const updatedShapes = shapes.map(shape => {
          if (shape.id === activeShape.id) {
            return {
              ...shape,
              x1: shape.x1 + dx,
              y1: shape.y1 + dy,
              x2: shape.x2 + dx,
              y2: shape.y2 + dy,
            };
          }
          return shape;
        });
        setShapes(updatedShapes);
      }
      setResizeHandle(null);
      setStartPos(null);
    }
  };

  const drawShape = (x1, y1, x2, y2) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const width = x2 - x1;
    const height = y2 - y1;

    ctx.beginPath();

    switch (shapeTool) {
      case 'rectangle':
        ctx.rect(x1, y1, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        ctx.arc(x1 + width / 2, y1 + height / 2, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        break;
      case 'triangle':
        ctx.moveTo(x1 + width / 2, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        break;
      case 'star':
        drawStar(ctx, x1 + width / 2, y1 + height / 2, 5, Math.min(width, height) / 2, Math.min(width, height) / 4);
        break;
      case 'heart':
        drawHeart(ctx, x1 + width / 2, y1 + height / 2, Math.abs(width), Math.abs(height));
        break;
      default:
        break;
    }

    ctx.stroke();
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const drawHeart = (ctx, x, y, width, height) => {
    ctx.moveTo(x, y + height / 4);
    ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + height / 4);
    ctx.bezierCurveTo(x - width / 2, y + height / 2, x, y + height * 3 / 4, x, y + height);
    ctx.bezierCurveTo(x, y + height * 3 / 4, x + width / 2, y + height / 2, x + width / 2, y + height / 4);
    ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + height / 4);
    ctx.closePath();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);
  };

  const undo = () => {
    if (undoStack.length < 2) return;
    const previous = undoStack[undoStack.length - 2];
    const img = new Image();
    img.src = previous;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    setUndoStack((prev) => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setUndoStack([]);
    setShapes([]);
    setActiveShape(null);
  };

  const saveDrawing = () => {
    if (!canvasRef.current) return;
    const originalCanvas = canvasRef.current;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = originalCanvas.width;
    offscreenCanvas.height = originalCanvas.height;

    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(originalCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = offscreenCanvas.toDataURL();
    link.click();
  };

  const handleImageSelect = (imgName) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSources[imgName];

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.width / imgRatio;
      } else {
        drawWidth = canvas.height * imgRatio;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      saveState();
    };
  };

  const handleCanvasClick = ({ nativeEvent }) => {
    if (tool !== 'fill') return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const { offsetX, offsetY } = nativeEvent;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const targetColor = getPixelColor(data, offsetX, offsetY, canvas.width);
    const fillCol = hexToRgb(color);
    if (!fillCol) return;

    floodFill(data, offsetX, offsetY, targetColor, fillCol, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    saveState();
  };

  const getPixelColor = (data, x, y, width) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const colorMatchWithTolerance = (a, b, tolerance = 32) => {
    return (
      Math.abs(a[0] - b[0]) <= tolerance &&
      Math.abs(a[1] - b[1]) <= tolerance &&
      Math.abs(a[2] - b[2]) <= tolerance &&
      Math.abs(a[3] - b[3]) <= tolerance
    );
  };

  const floodFill = (data, x, y, targetColor, fillColor, width, height) => {
    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length) {
      const [cx, cy] = stack.pop();
      const index = (cy * width + cx) * 4;
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const currentColor = [
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3],
      ];

      if (!colorMatchWithTolerance(currentColor, targetColor)) continue;

      data[index] = fillColor[0];
      data[index + 1] = fillColor[1];
      data[index + 2] = fillColor[2];
      data[index + 3] = 255;

      if (cx > 0) stack.push([cx - 1, cy]);
      if (cx < width - 1) stack.push([cx + 1, cy]);
      if (cy > 0) stack.push([cx, cy - 1]);
      if (cy < height - 1) stack.push([cx, cy + 1]);
    }
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  };

  return (
    <div className="coloring-container">
      <div className="toolbar">
        <div className="tool-section">
          <h3>Tools</h3>
          <button className={tool === 'brush' ? 'active' : ''} onClick={() => { setTool('brush'); setShapeTool(null); }}>🖌</button>
          <button className={tool === 'eraser' ? 'active' : ''} onClick={() => { setTool('eraser'); setShapeTool(null); }}>🧽</button>
          <button className={tool === 'fill' ? 'active' : ''} onClick={() => { setTool('fill'); setShapeTool(null); }}>🪣</button>
          <button className={tool === 'select' ? 'active' : ''} onClick={() => { setTool('select'); setShapeTool(null); }}>✥</button>
        </div>

        <div className="color-section">
          <h3>Colour</h3>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        </div>

        <div className="image-section">
          <h3>Image</h3>
          <div className="image-buttons">
            <button className={selectedCategory === 'Flowers' ? 'active' : ''} onClick={() => setSelectedCategory('Flowers')}>Flowers</button>
            <button className={selectedCategory === 'Animals' ? 'active' : ''} onClick={() => setSelectedCategory('Animals')}>Animals</button>
          </div>
          <div className="image-buttons" style={{ marginTop: '8px' }}>
            {categoryMap[selectedCategory].map((imgKey) => (
              <button key={imgKey} onClick={() => handleImageSelect(imgKey)}>
                {capitalize(imgKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="shapes-section">
          <h3>Shapes</h3>
          {[
            { type: 'rectangle', icon: <svg width="20" height="20"><rect x="2" y="5" width="16" height="10" stroke="black" fill="none" strokeWidth="2" /></svg> },
            { type: 'circle', icon: <svg width="20" height="20"><circle cx="10" cy="10" r="7" stroke="black" fill="none" strokeWidth="2" /></svg> },
            { type: 'triangle', icon: <svg width="20" height="20"><polygon points="10,3 3,17 17,17" stroke="black" fill="none" strokeWidth="2" /></svg> },
            { type: 'line', icon: <svg width="20" height="20"><line x1="3" y1="17" x2="17" y2="3" stroke="black" strokeWidth="2" /></svg> },
            { type: 'star', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" stroke="black" fill="none" strokeWidth="2"/></svg> },
            { type: 'heart', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 21s-6-4.5-9-9c-2-3 0-7 4-7s5 3 5 3 1-3 5-3 6 4 4 7c-3 4.5-9 9-9 9z" stroke="black" fill="none" strokeWidth="2"/></svg> },
          ].map(({ type, icon }) => (
            <button
              key={type}
              className={shapeTool === type ? 'active' : ''}
              onClick={() => {
                setTool('shape');
                setShapeTool(type);
              }}
              title={capitalize(type)}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="edit-section">
          <h3>Edit</h3>
          <button onClick={clearCanvas}>Clear</button>
          <button onClick={undo}>Undo</button>
          {activeShape && (
            <button onClick={() => {
              setShapes(shapes.filter(shape => shape.id !== activeShape.id));
              setActiveShape(null);
            }}>Delete</button>
          )}
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
        />
      </div>

      <div className="bottom-buttons">
        <button onClick={saveDrawing}>Save Drawing</button>
        <button onClick={() => navigate('/gallery')}>Go to Gallery</button>
         <button onClick={() => navigate('/chat')}>Chat with Bot</button>
      </div>
    </div>
  );
};

export default Coloring;

