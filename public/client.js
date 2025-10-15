/* global io */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const socket = io();

let players = {};
const size = 20; // each player square size

// === Ask for Player Name ===
const playerName = prompt("Enter your name:") || "Player";

// Send name to server when connecting
socket.emit("newPlayer", playerName);

// === Movement ===
document.addEventListener('keydown', (e) => {
  socket.emit('move', e.key);
});

socket.on('state', (serverPlayers) => {
  players = serverPlayers;
});

// === Draw Grid ===
function drawGrid() {
  const gridSize = 40;
  ctx.strokeStyle = '#333';
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// === Drawing Loop ===
function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  drawGrid();

  // Draw players as squares
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = id === socket.id ? '#0f0' : '#f00';
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

    // Show name and coordinates
    ctx.font = '14px monospace';
    ctx.fillStyle = '#fff';

    // Show player name (above square)
    if (p.name) {
      ctx.fillText(p.name, p.x - size / 2, p.y - size / 2 - 20);
    }

    // Show coordinates (for self)
    if (id === socket.id) {
      ctx.fillText(
        `(${Math.round(p.x)}, ${Math.round(p.y)})`,
        p.x - size / 2,
        p.y - size / 2 - 5
      );
    }
  }

  requestAnimationFrame(draw);
}
draw();

// === Chat Logic ===
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg !== '') {
    socket.emit('chatMessage', msg);
    input.value = '';
  }
});

socket.on('chatMessage', (msg) => {
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
