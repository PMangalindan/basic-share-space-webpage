// === server.js ===
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// === Middleware ===
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const DB_FILE = path.join(__dirname, "users.json");

// Load or initialize users
let users = {};
if (fs.existsSync(DB_FILE)) {
  users = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
} else {
  fs.writeFileSync(DB_FILE, "{}");
}






// === Login / Register Endpoint ===
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: "Missing username or password" });
  }

  // Existing user login
  if (users[username]) {
    if (users[username].password === password) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.json({ success: false, message: "Incorrect password" });
    }
  }

  // Register new user
  users[username] = {
    password,
    lastPosition: { x: 300, y: 200 },
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  console.log(`Registered new user: ${username}`);
  res.json({ success: true, message: "Registered successfully" });
});

// === Game State ===
let players = {};
const SPEED = 5;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Player joins
  socket.on("newPlayer", (name) => {
    // If user has saved position
    let startX = 300;
    let startY = 200;
    if (users[name]?.lastPosition) {
      startX = users[name].lastPosition.x;
      startY = users[name].lastPosition.y;
    }

    players[socket.id] = { x: startX, y: startY, name };
    io.emit("state", players);
  });

  // Movement handling
  socket.on("move", (key) => {
    const p = players[socket.id];
    if (!p) return;

    switch (key) {
      case "ArrowUp":
        p.y = Math.max(p.y - SPEED, 10);
        break;
      case "ArrowDown":
        p.y = Math.min(p.y + SPEED, 390);
        break;
      case "ArrowLeft":
        p.x = Math.max(p.x - SPEED, 10);
        break;
      case "ArrowRight":
        p.x = Math.min(p.x + SPEED, 590);
        break;
    }

    io.emit("state", players);
  });

  // Chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  // Save last position on disconnect
  socket.on("disconnect", () => {
    const player = players[socket.id];
    if (player && users[player.name]) {
      users[player.name].lastPosition = { x: player.x, y: player.y };
      fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    }

    delete players[socket.id];
    io.emit("state", players);
    console.log("A user disconnected:", socket.id);
  });
});





// Make sure this line exists near the top:
app.use(express.json());

// === Save Player Position ===
app.post('/save-position', (req, res) => {
  const { name, x, y } = req.body;

  if (!name || x === undefined || y === undefined) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Update user position in users.json
  if (users[name]) {
    users[name].lastPosition = { x, y };
  } else {
    users[name] = { password: '', lastPosition: { x, y } }; // fallback
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    console.log(`✅ Saved ${name} at (${x}, ${y})`);
    res.json({ message: '✅ Position saved successfully!' });
  } catch (err) {
    console.error('❌ Failed to save position:', err);
    res.status(500).json({ message: 'Failed to save position.' });
  }
});





// === Start Server ===
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
