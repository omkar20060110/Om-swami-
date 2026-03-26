# Swami Samarth Global Exports - Website Documentation

This project consists of a **Flask Backend** and a **React Frontend (Vite)**.

## 🚀 How to Run the Project

Follow these steps to get the website running on your local machine.

### 1. Prerequisites
- **Python 3.10+**: Make sure Python is installed and added to your PATH.
- **Node.js**: Required to run the React frontend.

---

### 2. Setup the Backend (Flask)
The backend handles the data, product management, and inquiries.

1.  **Open a terminal** and navigate to the backend folder:
    ```bash
    cd d:\website\backend
    ```
2.  **Activate the Virtual Environment**:
    - **Windows**:
      ```powershell
      .\venv\Scripts\activate
      ```
3.  **Install Dependencies** (only required the first time):
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Server**:
    ```bash
    python app.py
    ```
    - The backend will start on `http://127.0.0.1:5000/`.
    - Database tables are created automatically on startup.

---

### 3. Setup the Frontend (React + Vite)
The frontend is the user-facing website and admin panel.

1.  **Open a NEW terminal** window and navigate to the frontend folder:
    ```bash
    cd d:\website\frontend
    ```
2.  **Install Dependencies** (only required the first time):
    ```bash
    npm install
    ```
3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    - The website will be available at `http://localhost:5173`.

---

### 4. Admin Access
To manage products, categories, and inquiries:

- **Login URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Username**: `Omkar Angadi`
- **Password**: `Omkar2006`

---

## 🛠 Project Structure
- `backend/`: Flask server, SQLite database, and API routes.
- `frontend/`: React components, CSS, and assets.
- `backend/uploads/`: Directory where product images are saved.

## 📝 Features Implemented
- **Dynamic Hero Section**: Interactive home page with premium visuals.
- **Product Catalog**: Beautifully designed product cards with detailed modals.
- **Inquiry System**: Global buyers can submit interest forms directly.
- **Admin Dashboard**: Full control over products and inquiries with custom security.
