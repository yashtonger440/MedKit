import { createServer } from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./config/env.js";

connectDB();

const httpServer = createServer(app);

const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
  path: "/",
});
app.use("/peerjs", peerServer);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["polling", "websocket"],
});

const onlineUsers = {};
const userPeerIds = {};

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("✅ Registered:", userId, "→", socket.id);
    console.log("Online users:", onlineUsers);
    socket.emit("registered", { success: true }); // ✅ confirm bhejo
  });

  socket.on("register_peer", ({ userId, peerId }) => {
    userPeerIds[userId] = peerId;
    console.log("✅ PeerID registered:", userId, "→", peerId);
  });

  socket.on("get_peer_id", ({ userId }) => {
    socket.emit("peer_id_response", { peerId: userPeerIds[userId] || null });
  });

  // ✅ callType aur callerPeerId add kiya
  socket.on("call:initiate", ({ callerId, callerPeerId, doctorId, callerName, callType }) => {
    console.log("📞 Call initiate:", callerId, "→", doctorId, "| Type:", callType);
    console.log("Doctor socket:", onlineUsers[doctorId]);
    const doctorSocket = onlineUsers[doctorId];
    if (doctorSocket) {
      io.to(doctorSocket).emit("call:incoming", {
        callerId,
        callerName,
        callerPeerId, // ✅ add kiya
        callType,     // ✅ add kiya
      });
    }
  });

  socket.on("call:accept", ({ callerId }) => {
    const callerSocket = onlineUsers[callerId];
    if (callerSocket) {
      io.to(callerSocket).emit("call:accepted");
    }
  });

  socket.on("call:reject", ({ callerId }) => {
    const callerSocket = onlineUsers[callerId];
    if (callerSocket) {
      io.to(callerSocket).emit("call:rejected");
    }
  });

  socket.on("call:end", ({ otherUserId }) => {
    const otherSocket = onlineUsers[otherUserId];
    if (otherSocket) {
      io.to(otherSocket).emit("call:ended");
    }
  });

  socket.on("disconnect", () => {
    Object.keys(onlineUsers).forEach((userId) => {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        delete userPeerIds[userId]; // ✅ cleanup
        console.log("User disconnected:", userId);
      }
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});