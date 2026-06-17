import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const rooms = {}; // Persist drawing history across all connections

app.get("/", (req, res) => {
    res.json({
        msg: "Server is running"
    });
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let currentRoom = null;

    socket.on("join-room", (roomId) => {
        // Leave old room if switching rooms
        if (currentRoom && currentRoom !== roomId) {
            socket.leave(currentRoom);
        }
        
        currentRoom = roomId;
        socket.join(roomId);

        socket.emit("canvas-history", rooms[roomId] || []);
    });

    socket.on("start-draw", (data) => {
        if (!rooms[data.roomId]) {
            rooms[data.roomId] = [];
        }
        
        rooms[data.roomId].push({
            type: "start",
            x: data.x,
            y: data.y
        });

        socket.to(data.roomId).emit("start-draw", {
            x: data.x,
            y: data.y
        })
    })

    socket.on("draw", (data) => {

        if (!rooms[data.roomId]) {
            rooms[data.roomId] = [];
        }

        rooms[data.roomId].push(data);

        socket.to(data.roomId).emit("draw", {
            x: data.x,
            y: data.y
        })
    })

    socket.on("stop-draw", (data) => {
        socket.to(data.roomId).emit("stop-draw");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



server.listen(3000, () => {
    console.log("Server started on port 3000");
});