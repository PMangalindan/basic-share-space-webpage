const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("New player:", socket.id);
  players[socket.id] = { x: 200, y: 200, color: getRandomColor() };

  io.emit("updatePlayers", players);

  socket.on("move", (dir) => {
    const p = players[socket.id];
    if (!p) return;
    const speed = 5;
    if (dir === "up") p.y -= speed;
    if (dir === "down") p.y += speed;
    if (dir === "left") p.x -= speed;
    if (dir === "right") p.x += speed;
    io.emit("updatePlayers", players);
  });

  // 🔹 Handle chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", { id: socket.id, text: msg });
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 80%, 60%)`;
}

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
