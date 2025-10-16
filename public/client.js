/* global io */

const gameCanvas = document.getElementById('game');
const ctx = gameCanvas.getContext('2d');
const infoCanvas = document.getElementById('info');
const infoCtx = infoCanvas.getContext('2d');

const socket = io();

let players = {};
const size = 20;
let selectedPlayerId = null; // who was clicked

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

// === Handle Clicks on Player Squares ===
gameCanvas.addEventListener('click', (e) => {
  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Find which square was clicked
  for (let id in players) {
    const p = players[id];
    if (
      mouseX >= p.x - size / 2 &&
      mouseX <= p.x + size / 2 &&
      mouseY >= p.y - size / 2 &&
      mouseY <= p.y + size / 2
    ) {
      selectedPlayerId = id;
      drawInfoPanel();
      break;
    }
  }
});

// === Draw Grid ===
function drawGrid() {
  const gridSize = 40;
  ctx.strokeStyle = '#333';
  for (let x = 0; x < gameCanvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gameCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < gameCanvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gameCanvas.width, y);
    ctx.stroke();
  }
}

// === Draw Player Info Panel ===
function drawInfoPanel() {
  infoCtx.fillStyle = '#111';
  infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);

  infoCtx.font = '14px monospace';
  infoCtx.fillStyle = '#0f0';
  infoCtx.fillText('Player Info', 50, 30);

  if (selectedPlayerId && players[selectedPlayerId]) {
    const p = players[selectedPlayerId];
    infoCtx.fillStyle = '#fff';
    infoCtx.fillText(`Name: ${p.name}`, 20, 80);
    infoCtx.fillText(`X: ${Math.round(p.x)}`, 20, 110);
    infoCtx.fillText(`Y: ${Math.round(p.y)}`, 20, 140);
    infoCtx.fillText(`ID: ${selectedPlayerId.substring(0, 6)}...`, 20, 170);
  } else {
    infoCtx.fillStyle = '#777';
    infoCtx.fillText('Click a square', 30, 80);
  }
}

// === Main Draw Loop ===
function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  drawGrid();

  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = id === socket.id ? '#0f0' : '#f00';
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

    // Name + coordinates
    ctx.font = '14px monospace';
    ctx.fillStyle = '#fff';
    if (p.name) ctx.fillText(p.name, p.x - size / 2, p.y - size / 2 - 20);
    if (id === socket.id) {
      ctx.fillText(
        `(${Math.round(p.x)}, ${Math.round(p.y)})`,
        p.x - size / 2,
        p.y - size / 2 - 5
      );
    }

    // Highlight selected
    if (id === selectedPlayerId) {
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - size / 2 - 2, p.y - size / 2 - 2, size + 4, size + 4);
    }
  }

  drawInfoPanel();
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
