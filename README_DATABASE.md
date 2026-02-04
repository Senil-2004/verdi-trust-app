# Database Setup Instructions

You have requested to delete dummy data and use a real MySQL database via XAMPP.

## 1. Start XAMPP
Open XAMPP Control Panel and start **Apache** and **MySQL**.

## 2. Create Database & Import Schema
1. Open [phpMyAdmin](http://localhost/phpmyadmin).
2. Click **New** on the left sidebar.
3. Create a database named `verdi_trust_db`.
4. Select the `verdi_trust_db` database.
5. Click **Import** tab.
6. Choose the file: `d:\verdi-trust-app-react\server\schema.sql`.
7. Click **Import** at the bottom.

## 3. Run the Backend Server
Open a new terminal window:
```powershell
cd server
npm start
```
This will start the API server on `http://localhost:3005`.

## 4. Run the Frontend Application
In your original terminal (root directory):
```powershell
npm run dev
```
The application will now fetch live data from your MySQL database.

## Troubleshooting
- If you see `Error connecting to database`, ensure XAMPP MySQL is running on default port 3306 with user `root` and no password.
- If data doesn't load, check the browser console and the server terminal for errors.
