import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};
