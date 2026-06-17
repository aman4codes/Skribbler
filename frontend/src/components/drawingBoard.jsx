import { useRef, useEffect, useState } from "react";
import { socket } from "../api/socket.js";

function DrawingBoard() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [room, setRoom] = useState("123");
  const roomId = room;

  const drawLine = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const startPath = (x, y) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  useEffect(() => {
    // Emit join-room whenever roomId changes
    socket.emit("join-room", roomId);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas on connection
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    socket.on("canvas-history", (history) => {
      history.forEach((point) => {
        if (point.type === "start") {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
    });

    socket.on("start-draw", (data) => {
      console.log("Received start-draw:", data);
      startPath(data.x, data.y);
    });

    socket.on("draw", (data) => {
      console.log("Received draw:", data);

      drawLine(data.x, data.y);
    });

    socket.on("stop-draw", () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.closePath();
    });

    return () => {
      socket.off("start-draw");
      socket.off("draw");
      socket.off("stop-draw");
      socket.off("canvas-history");
    };
  }, [roomId]);

  const startDrawing = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    drawingRef.current = true;

    startPath(x, y);

    socket.emit("start-draw", { roomId, x, y });
  };

  const draw = (e) => {
    if (!drawingRef.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    drawLine(x, y);

    socket.emit("draw", { roomId, x, y });
  };

  const stopDrawing = () => {
    drawingRef.current = false;

    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();

    socket.emit("stop-draw", { roomId });
  };

  return (
    <div>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="bg-white text-black"
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default DrawingBoard;
