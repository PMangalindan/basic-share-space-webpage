const socket = io();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let players = {};

socket.on("updatePlayers", data => {
  players = data;
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") socket.emit("move", "up");
  if (e.key === "ArrowDown") socket.emit("move", "down");
  if (e.key === "ArrowLeft") socket.emit("move", "left");
  if (e.key === "ArrowRight") socket.emit("move", "right");
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    const p = players[id];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = id === socket.id ? '#0f0' : '#f00'; // green = you
    ctx.fill();

    // ✅ Display coordinates for your own player
    if (id === socket.id) {
      ctx.font = '16px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`(${Math.round(p.x)}, ${Math.round(p.y)})`, p.x + 15, p.y - 15);
    }
  }
  requestAnimationFrame(draw);
}
draw();

// 🔹 Chat
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (msg) socket.emit("chatMessage", msg);
  chatInput.value = "";
});

socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.textContent = `${data.id.slice(0, 4)}: ${data.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
