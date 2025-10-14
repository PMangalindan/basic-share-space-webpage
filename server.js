const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = {};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 20;

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Random spawn within bounds
  players[socket.id] = {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLAYER_SIZE)) + PLAYER_SIZE / 2,
    y: Math.floor(Math.random() * (CANVAS_HEIGHT - PLAYER_SIZE)) + PLAYER_SIZE / 2,
  };

  io.emit('state', players);

  socket.on('move', (key) => {
    const player = players[socket.id];
    if (!player) return;

    const speed = 10;
    if (key === 'ArrowUp') player.y -= speed;
    if (key === 'ArrowDown') player.y += speed;
    if (key === 'ArrowLeft') player.x -= speed;
    if (key === 'ArrowRight') player.x += speed;

    // 🧱 Border limits
    player.x = Math.max(PLAYER_SIZE / 2, Math.min(player.x, CANVAS_WIDTH - PLAYER_SIZE / 2));
    player.y = Math.max(PLAYER_SIZE / 2, Math.min(player.y, CANVAS_HEIGHT - PLAYER_SIZE / 2));

    // 💥 Collision handling
    for (let id in players) {
      if (id === socket.id) continue;
      const other = players[id];
      const dx = player.x - other.x;
      const dy = player.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = PLAYER_SIZE;
      if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        player.x += nx * overlap;
        player.y += ny * overlap;
        other.x -= nx * overlap;
        other.y -= ny * overlap;
      }
    }

    io.emit('state', players);
  });

  socket.on('chatMessage', (msg) => {
    const message = `Player ${socket.id.slice(0, 4)}: ${msg}`;
    io.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('state', players);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://0.0.0.0:3000');
});
