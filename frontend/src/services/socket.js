import { io } from "socket.io-client";

console.log("io =", io);

const socket = io("http://localhost:5000");

console.log("socket =", socket);

export default socket;