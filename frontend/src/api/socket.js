import { io } from "socket.io-client";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const socket = io(url);

// export default socket;