# 🕹️ Basic Share Space Webpage (Multiplayer Game)
A simple real-time **multiplayer game and chat app** built with **Node.js**, **Express**, and **Socket.IO**. Players appear as colored circles on a shared canvas and can move around and chat in real time.

## 🚀 Features
- 🎮 Real-time multiplayer movement  
- 💬 Public chat system  
- 🎨 Canvas-based player rendering  
- ⚡ Live updates powered by Socket.IO  
- 🧩 Beginner-friendly and modular structure  

## 🧰 Tech Stack
| Technology | Purpose |
|-------------|----------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework for serving files |
| **Socket.IO** | Real-time communication between players |
| **HTML5 Canvas** | Rendering the game area |
| **CSS Flexbox** | Layout and styling |

## 📁 Project Structure

basic-share-space-webpage/
├── server.js # Main server file
├── package.json # Node dependencies
└── public/
├── index.html # Frontend UI
├── style.css # Styling
└── client.js # Client-side game logic


## ⚙️ Setup & Installation
### 1️⃣ Prerequisites
Make sure you have:
- **Node.js** (v18 or newer recommended)
- **npm** (comes with Node.js)
- A terminal or command prompt

Verify installation:
```bash
node -v
npm -v

2️⃣ Clone this repository

git clone https://github.com/PMangalindan/basic-share-space-webpage.git
cd basic-share-space-webpage

3️⃣ Install dependencies

npm install

4️⃣ Run the server

Start the local server:

node server.js

Or, if you have nodemon installed:

npx nodemon server.js

You should see this message:

Server running on http://localhost:3000

5️⃣ Open the game in your browser

Go to: http://localhost:3000


You’ll see:

    A dark canvas with moving player dots

    A chat box below the canvas

6️⃣ Test Multiplayer Mode

Open multiple browser tabs (all pointing to http://localhost:3000):

    Each tab acts as a separate player.

    Move your player using arrow keys.

    Send chat messages visible to all players.

🔒 Security Notes

This project is intended for educational and local testing purposes.
If deploying publicly, you should:

    ✅ Add authentication (e.g., JWT or session-based login)

    ✅ Sanitize messages to prevent XSS

    ✅ Use HTTPS + WSS for secure communication

    ✅ Add rate limiting to prevent spam/flooding

💡 Future Improvements

    Add player usernames and avatars

    Save player positions or stats

    Add in-game scoring or collectibles

    Implement private chats or teams

    Deploy online (Render, Railway, or Vercel)

🧑‍💻 Author

Purple Mangalindan
🔗 GitHub Profile
🪪 License

This project is open-source under the MIT License

.


----------------------------------------------------------------------------------------------------------------------------
![Node.js Code Check](https://github.com/PMangalindan/basic-share-space-webpage/actions/workflows/node-check.yml/badge.svg)
