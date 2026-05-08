# 💬 SpotChat

> A real-time chat app with location-based rooms — connect privately with friends or publicly with people nearby.

🔗 **Live Demo:** [https://spotchat-1.onrender.com](https://spotchat-1.onrender.com)

---

## ✨ Features

- 🔐 **Authentication** — Secure signup/login with JWT & HTTP-only cookies
- 💬 **Private Messaging** — Real-time 1-on-1 chat with friends via WebSockets
- 👥 **Friend System** — Send, accept, and reject friend requests; see who's online
- 📍 **Location-Based Rooms** — Create or join temporary public chat rooms visible only to nearby users
- ⏳ **Auto-Expiring Rooms** — Rooms auto-delete after a set duration (MongoDB TTL index)
- 🖼️ **Profile Photos** — Upload and update your profile picture via Cloudinary
- 🟢 **Online Presence** — See real-time online/offline status of contacts
- 📱 **Responsive UI** — Clean dark-themed interface built with TailwindCSS + DaisyUI

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| Zustand | State management |
| Socket.io-client | Real-time messaging |
| TailwindCSS + DaisyUI | Styling |
| Axios | HTTP requests |
| React Router v7 | Client-side routing |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| Socket.io | WebSocket server |
| JWT | Session tokens |
| bcryptjs | Password hashing |
| Cloudinary | Profile photo storage |
| Cookie-parser | HTTP-only cookie handling |

---

## 📍 How Rooms Work

Rooms are the unique feature of SpotChat. Unlike private chats, rooms are:

- **Location-based** — only users within a certain radius can see and join a room
- **Temporary** — creator sets a duration (e.g. 1 hour, 2 hours); the room auto-deletes when it expires
- **Public within range** — no friend request needed, anyone nearby can jump in
- **Real-time** — messages appear instantly via WebSockets for all members in the room

**Use cases:** college campus discussions, event meetups, local community chats, conference networking, etc.

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB URI
- Cloudinary account



## 📁 Project Structure

```
Chat-App/
├── backend/
│   └── src/
│       ├── controllers/     # auth, message logic
│       ├── middleware/      # JWT auth guard
│       ├── models/          # User, Room, Message schemas
│       ├── routes/          # API routes
│       ├── lib/             # cloudinary, socket, utils
│       └── index.js
│
└── frontend/chat-app/
    └── src/
        ├── components/      # ChatContainer, Sidebar, RoomsPanel, etc.
        ├── pages/           # HomePage, LoginPage, SignupPage, ProfilePage
        ├── store/           # Zustand stores (useAuthStore, useChatStore)
        └── lib/             # axios instance, roomsApi, utils
```

---

## 🌐 Deployment

Hosted on **Render** (free tier):
- Backend: Node.js web service
- Frontend: Static site (Vite build)
- Database: MongoDB Atlas (free tier)
- Media: Cloudinary (free tier)

---

## 📸 Screenshots

| Chat | Profile | Rooms |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## 👨‍💻 Author

**Arkit Bajpai**
- GitHub: [@arkitbajpai](https://github.com/arkitbajpai)
