// import { Server } from 'socket.io';

// const io = new Server(9000, {
//     cors: {
//         origin: 'http://localhost:3000',
//     },
// })

// let users = [];

// const addUser = (userData, socketId) => {
//     !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
// }

// const removeUser = (socketId) => {
//     users = users.filter(user => user.socketId !== socketId);
// }

// const getUser = (userId) => {
//     return users.find(user => user.sub === userId);
// }

// io.on('connection',  (socket) => {
//     console.log('user connected')

//     //connect
//     socket.on("addUser", userData => {
//         addUser(userData, socket.id);
//         io.emit("getUsers", users);
//     })

//     //send message
//     socket.on('sendMessage', (data) => {
//         const user = getUser(data.receiverId);
//         io.to(user.socketId).emit('getMessage', data)
//     })

//     //disconnect
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         removeUser(socket.id);
//         io.emit('getUsers', users);
//     })
// })
import { Server } from "socket.io";

// Create socket server on port 9000
// const io = new Server(9000, {
//   cors: {
//     origin: "http://localhost:3000", // make sure this matches your frontend
//     methods: ["GET", "POST"],
//   },
// });

const PORT = process.env.PORT || 9000;
const io = new Server(PORT, {
  cors: {
    origin: 'https://your-frontend.vercel.app',
    methods: ['GET', 'POST'],
  },
});

let users = [];

// Add user only if not already present
const addUser = (userData, socketId) => {
  if (!users.some((user) => user.sub === userData.sub)) {
    users.push({ ...userData, socketId });
  }
};

// Remove user on disconnect
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Get receiver user
const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

// Socket connection
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // When a new user is added
  socket.on("addUser", (userData) => {
    addUser(userData, socket.id);
    console.log("👤 Users:", users);
    io.emit("getUsers", users);
  });

  // When message is sent
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
    } else {
      console.warn("⚠️ Receiver not found:", data.receiverId);
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
