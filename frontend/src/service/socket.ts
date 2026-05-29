import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectSocket = (token: string): Socket => {
    const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"

    socket = io(socketUrl, {
        auth: { token }
    })

    return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}