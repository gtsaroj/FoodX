# FoodX

FoodX is an online platform for efficient canteen management, providing customers with a seamless experience to browse menus, customize orders, and track their orders in real-time. The system also enables canteen staff to handle orders, manage inventory, and utilize data insights for optimized operations.

## Table of Contents
- [Purpose](#purpose)
- [Scope](#scope)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)

## Purpose

FoodX streamlines canteen operations by automating order management, inventory tracking, and customer engagement through loyalty programs and analytics. It enhances both customer experience and canteen staff efficiency.

## Scope

FoodX includes:
- **Admin CMS**: For canteen administrators and chefs to manage inventory, orders, and view business insights.
- **Customer Frontend Application**: Enables customers to browse menus, place orders, and track orders in real-time.
- **Backend API**: Supports authentication, data management, and reporting.

## Features

- **Menu Browsing**: Customers can view available food items.
- **Order Management**: Customers place orders; staff manage and fulfill orders.
- **Real-Time Order Tracking**: Customers can monitor their orders' progress.
- **Inventory Management**: Staff can manage and update inventory.
- **Data Insights**: Provides insights on customer activity and operations.
- **Loyalty Programs**: Rewards frequent customers to increase engagement.

## Tech Stack

### Frontend
- **React** with **TypeScript**: For creating user interfaces in both `frontend` and `admin` applications.
- **Tailwind CSS**: For styling the user interface.
- **Firebase Authentication**: For secure user authentication.
- **JWT**: JWT token for managing tokens.
- **Redux**: For centralized state management.

### Backend
- **Node.js** with **Express**: For API and server logic.
- **Firebase Firestore**: For real-time database functionality.
- **Firebase Storage**: For storing images and assets.
- **Socket**: For real time order management and real time notifications.
- **Redis**: For caching purpose.

## Folder Structure

- **frontend**: Contains the customer-facing application.
- **admin**: Contains the admin CMS for managing canteen operations.
- **backend**: Manages API, authentication, and data services.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AaaayushXD/FoodX.git
   cd FoodX
   ```

2. **Install dependencies for each folder**:
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     ```
   - **Admin**:
     ```bash
     cd ../admin
     npm install
     ```
   - **Backend**:
     ```bash
     cd ../backend
     npm install
     ```

3. **Setup Firebase**:
   - Create a Firebase project and configure Firebase settings for both `frontend` and `admin` applications.
   - Enable Firestore, Storage, and Authentication.

4. **Environment Variables**:
   - Create `.env` file for all directory with firebase varibles.

## Usage

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend (Customer)**:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Start the Admin Application**:
   ```bash
   cd ../admin
   npm run dev
   ```

4. **Access the Application**:
   - **Customer Frontend**: Go to `http://localhost:5173`
   - **Admin CMS**: Go to `http://localhost:5500`

