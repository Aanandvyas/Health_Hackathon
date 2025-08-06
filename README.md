# Health-Menta: Full Stack Health Application

This document provides instructions for setting up and running the Health-Menta project locally. The project is composed of a React frontend and multiple backend services.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [Python v3.11](https://www.python.org/) (for the Chatbot and OCR services) 
- A Python virtual environment (`venv`) set up within the `server` directory.

---

## Running the Project Locally

Follow the steps below to run the frontend and all backend services. Each command should be run in a separate terminal window.

### 1. Frontend (React App)

The frontend is a Vite-powered React application.

1.  Navigate to the project's **root directory**.
2.  Install the necessary dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

### 2. Backend Services

All backend services are located in the `server` directory.

#### Node.js Server (Main API)

This server handles the core API logic.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Start the server:
    ```bash
    node index.js
    ```
    The Node.js API will be running on its configured port (e.g., `http://localhost:3001`).

#### OCR Service (Python)

This service handles Optical Character Recognition tasks.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Start the Uvicorn server for the OCR app:
    ```bash
    uvicorn ocr:app --reload --host 0.0.0.0 --port 5000
    ```
    The OCR service will be available at `http://localhost:5000`.

#### Chatbot Service (Python)

This service powers the application's chatbot functionality.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Activate the Python virtual environment:
    ```bash
    # For Windows
    .\venv\scripts\activate

    # For macOS/Linux
    source venv/bin/activate
    ```
3.  Start the Uvicorn server for the Chatbot app:
    ```bash
    uvicorn chatBot:app --reload --host 0.0.0.0 --port 8000
    ```
    The Chatbot service will be available at `http://localhost:8000`.
