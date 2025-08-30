# Notification Orchestrator API

An Express.js API for orchestrating notifications to users based on their preferences, built as a technical assignment.
It provides endpoints to send notifications through multiple channels with user preference validation. Business logic is encapsulated in service classes, and the project is fully covered by tests.

---

## ⚙️ Technical Stack

- **Node.js:** Latest LTS
- **Express.js:** Web framework
- **TypeScript:** Type-safe JavaScript
- **Zod:** Runtime validation and parsing
- **Jest:** Testing framework
- **Supertest:** HTTP assertion testing

---

## 🚀 Setup & Verification

Follow these steps to set up the project locally.
The project was tested with Arch Linux. It should also work on other Linux distributions if you have the necessary dependencies installed and PATH is set up correctly for `node` and `npm`.

### 1. Install Node.js & npm (if needed)

```bash
# Using pacman (Arch Linux)
sudo pacman -S nodejs npm
```

You may also want to add `node` and `npm` to your PATH environment variable.

### 2. Clone the Repository

```bash
git clone https://github.com/DrArzter/notification-orchestrator
cd notification-orchestrator
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

---

## ✅ Running the Test Suite

To verify the setup and run tests:

```bash
npm test
```

---

## 🚀 Starting the Server

**For production:**

You would like to build the project before starting the server.

```bash
npm run build
```

Then start the server:

```bash
npm start
```

The server will start on port 3000. You can access it at `http://localhost:3000`.

**For development with auto-reload:**

```bash
npm run dev
```

---

## 📡 API Usage Examples

All endpoints accept JSON payloads and return JSON responses.

### 1. Health Check

```bash
curl -X GET http://localhost:3000
```

### 2. Send Event Notification

```bash
curl -X POST http://localhost:3000/events \
     -H "Content-Type: application/json" \
     -d '{
       "eventId": "evt_1",
       "userId": "user123",
       "eventType": "item_shipped",
       "timestamp": "2025-07-29T21:59:00Z"
     }'
```

### 3. Get User Preferences

```bash
curl -X GET http://localhost:3000/preferences/user123
```

### 4. Update User Preferences

```bash
curl -X POST http://localhost:3000/preferences/user123 \
     -H "Content-Type: application/json" \
     -d '{
       "dnd": {
         "start": "22:00",
         "end": "07:00"
       },
       "eventSettings": {
         "item_shipped": {
           "enabled": true
         },
         "invoice_generated": {
           "enabled": false
         }
       }
     }'
```

---

## 🏗️ Project Structure

```
src/
├── controllers/     # Request handlers
│   └── __tests__/
├── services/        # Business logic
│   └── __tests__/
├── schemas/         # Data models and validation
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
└── store/           # Internal storage constructor
```

---

## 🧪 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript
- `npm test` - Run all tests

---
