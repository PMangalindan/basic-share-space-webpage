const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const socket = io();

let players = {};
const radius = 10;

// === Movement ===
document.addEventListener('keydown', (e) => {
  socket.emit('move', e.key);
});

socket.on('state', (serverPlayers) => {
  players = serverPlayers;
});

// === Drawing Loop ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];

    // Draw player
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = id === socket.id ? '#0f0' : '#f00';
    ctx.fill();

    // Show coordinates
    if (id === socket.id) {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`(${Math.round(p.x)}, ${Math.round(p.y)})`, p.x + 15, p.y - 15);
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
  messages.scrollTop = messages.scrollHeight; // auto-scroll to newest message
});
