import { useRef, useState, useEffect } from "react";

function DrawingBoard() {
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setDrawing(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
    />
  );
}

export default DrawingBoard;
