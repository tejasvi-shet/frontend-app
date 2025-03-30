import React, { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import "./NoteItCanvas.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const NoteItCanvas = () => {
  const [note, setNote] = useState("");
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000"); // Default brush color: black
  const [brushSize, setBrushSize] = useState(5); // Brush size control
  const [isErasing, setIsErasing] = useState(false); // Eraser mode
  const [tool, setTool] = useState("brush"); // Current tool: brush, rectangle, circle, triangle
  const [shapes, setShapes] = useState([]); // Store drawn shapes
  const [dragging, setDragging] = useState(false); // Is a shape being dragged?
  const [draggedShapeIndex, setDraggedShapeIndex] = useState(null); // Which shape is being dragged?
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset for drag start
  const [toolActive, setToolActive] = useState(false); // Track if the tool is active

  // Function to resize the canvas to fit its container
  const resizeCanvas = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.canvasContainer;
      const canvas = container.querySelector("canvas");

      if (canvas) {
        // Set the canvas dimensions to match the container
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    }
  };

  // Resize the canvas on component mount and window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Brush Icon Component
  const BrushIcon = () => (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="55"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Function to toggle between eraser and brush
  const toggleEraser = () => {
    if (isErasing) {
      setColor("#000"); // Restore original color
    } else {
      setColor("#FFFFFF"); // White color for eraser effect
    }
    setIsErasing(!isErasing);
  };

  // Function to save the drawing as an image
  const saveDrawing = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "drawing.png"; // File name for the saved image
    link.click();
  };


  // Function to draw a shape at the clicked position
  const drawShape = (e) => {
    if (tool === "brush" || dragging || !toolActive) return; // Do nothing if brush tool is selected, dragging, or tool is inactive

    const canvas = canvasRef.current.canvasContainer.children[1];
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShape = {
      type: tool,
      x,
      y,
      width: 100, // Fixed width for rectangle/triangle/square/oval/diamond
      height: tool === "square" || tool === "diamond" ? 100 : 70, // Fixed height for square, diamond; different height for oval
      radiusX: tool === "oval" ? 100 : 50, // For oval, radiusX is different from radiusY
      radiusY: tool === "oval" ? 70 : 50, // For oval, radiusY is different from radiusX
      fillColor: "#ffffff", // Store fill color for shapes (set to white by default)
    };

    setShapes([...shapes, newShape]);
    setToolActive(false); // Deactivate the tool after drawing a shape
  };

  // Function to handle mouse down event for dragging
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current.canvasContainer.children[1];
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if a shape is clicked
    const clickedShapeIndex = shapes.findIndex((shape) => {
      if (shape.type === "rectangle" || shape.type === "square" || shape.type === "diamond") {
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
      } else if (shape.type === "circle" || shape.type === "oval") {
        const dx = x - shape.x;
        const dy = y - shape.y;
        return (dx * dx) / (shape.radiusX * shape.radiusX) + (dy * dy) / (shape.radiusY * shape.radiusY) <= 1;
      } else if (shape.type === "triangle") {
        return (
          x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
        );
      }
      return false;
    });

    if (clickedShapeIndex !== -1) {
      // If a shape is clicked, start dragging
      setDragging(true);
      setDraggedShapeIndex(clickedShapeIndex);
      setOffset({ x: x - shapes[clickedShapeIndex].x, y: y - shapes[clickedShapeIndex].y });

      // Temporarily disable brush drawing by setting brushRadius to 0
      canvasRef.current.brushRadius = 0;
    }
  };

  // Function to handle mouse move event for dragging
  const handleMouseMove = (e) => {
    if (!dragging || draggedShapeIndex === null) return;

    const canvas = canvasRef.current.canvasContainer.children[1];
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update the position of the dragged shape
    const updatedShapes = [...shapes];
    updatedShapes[draggedShapeIndex] = {
      ...updatedShapes[draggedShapeIndex],
      x: x - offset.x,
      y: y - offset.y,
    };

    setShapes(updatedShapes);
  };

  // Function to handle mouse up event for dragging
  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      setDraggedShapeIndex(null);

      // Re-enable brush drawing after dragging
      canvasRef.current.brushRadius = brushSize;
    }
  };

  // Function to draw all shapes on the canvas
  const drawAllShapes = () => {
    const canvas = canvasRef.current.canvasContainer.children[1];
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    shapes.forEach((shape) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      // Apply fill color to shapes
      ctx.fillStyle = shape.fillColor;

      if (shape.type === "rectangle" || shape.type === "square") {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "diamond") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - shape.height / 2); // Top
        ctx.lineTo(shape.x - shape.width / 2, shape.y); // Left
        ctx.lineTo(shape.x, shape.y + shape.height / 2); // Bottom
        ctx.lineTo(shape.x + shape.width / 2, shape.y); // Right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radiusX, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "oval") {
        ctx.beginPath();
        ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width / 2, shape.y - shape.height);
        ctx.lineTo(shape.x + shape.width, shape.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  // Re-render all shapes whenever the shapes state changes
  useEffect(() => {
    drawAllShapes();
  }, [shapes]);

  // Function to handle tool selection
  const handleToolChange = (newTool) => {
    setTool(newTool);
    setToolActive(true); // Activate the tool when selected
  };

  // Function to undo the last action
  const undoShape = () => {
    if (shapes.length > 0) {
      // If there are shapes, remove the last one
      setShapes((prevShapes) => prevShapes.slice(0, -1));
    } else {
      // If no shapes, undo the last freehand drawing
      canvasRef.current?.undo();
    }
  };

  // SVG Icons for Shapes
  const RectangleIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const SquareIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const CircleIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const TriangleIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 22,22 2,22" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const DiamondIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 22,12 12,22 2,12" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const OvalIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
const navigate = useNavigate();

  return (
    <div className="note-container">
      {/* Main Box with Border */}
      <div className="main-box">
        {/* Top Section: Grid with 4 columns */}
        <div className="top-section">
          {/* Column 1: Tools */}
          <div className="column">
            <h3>Tools</h3>
            <div className="button-row">
              <button
                onClick={() => handleToolChange("brush")}
                className={tool === "brush" ? "active-tool" : ""}
              >
                <BrushIcon /> {/* Use the BrushIcon here */}
              </button>
              <button onClick={toggleEraser}>
                {isErasing ? "Use Brush" : "Use Eraser"}
              </button>
            </div>
          </div>

          {/* Column 2: Colour */}
          <div className="column">
            <h3>Colour</h3>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setIsErasing(false); // Disable eraser when changing color
              }}
            />
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>

          {/* Column 3: Shapes */}
          <div className="column">
            <h3>Shapes</h3>
            {/* Row 1: Rectangle, Square, Circle */}
            <div className="shape-row">
              <button
                onClick={() => handleToolChange("rectangle")}
                className={tool === "rectangle" ? "active-tool" : ""}
              >
                <RectangleIcon />
              </button>
              <button
                onClick={() => handleToolChange("square")}
                className={tool === "square" ? "active-tool" : ""}
              >
                <SquareIcon />
              </button>
              <button
                onClick={() => handleToolChange("circle")}
                className={tool === "circle" ? "active-tool" : ""}
              >
                <CircleIcon />
              </button>
            </div>

            {/* Row 2: Triangle, Diamond, Oval */}
            <div className="shape-row">
              <button
                onClick={() => handleToolChange("triangle")}
                className={tool === "triangle" ? "active-tool" : ""}
              >
                <TriangleIcon />
              </button>
              <button
                onClick={() => handleToolChange("diamond")}
                className={tool === "diamond" ? "active-tool" : ""}
              >
                <DiamondIcon />
              </button>
              <button
                onClick={() => handleToolChange("oval")}
                className={tool === "oval" ? "active-tool" : ""}
              >
                <OvalIcon />
              </button>
            </div>
          </div>

          {/* Column 4: Edit */}
          <div className="column">
            <h3>Edit</h3>
            <button onClick={() => canvasRef.current?.clear()}>Clear</button>
            <button onClick={undoShape}>Undo</button>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div
          onClick={drawShape}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            width: "100%",
            height: "500px",
            position: "relative",
            border: "1px solid #ccc",
          }}
        >
          <CanvasDraw
            ref={canvasRef}
            brushColor={color}
            brushRadius={tool === "brush" ? brushSize : 0} // Disable brush for shapes
            lazyRadius={0}
            canvasWidth={800} // Fixed canvas width
            canvasHeight={500} // Fixed canvas height
            hideGrid
            className="drawing-canvas"
          />
        </div>

        {/* Text Input for Notes */}
        <textarea
          className="note-input"
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />


        {/* Buttons for Save */}
        <div className="btn-group">
          <button onClick={saveDrawing}>Save Drawing</button>
          <button onClick={() => navigate('/gallery')} >Go to Gallery</button>
        </div>
      </div>
    </div>
  );
};

export default NoteItCanvas;