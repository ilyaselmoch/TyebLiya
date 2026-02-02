# Tyeb Liya 🥘

**The authentic Moroccan home-cooked meal marketplace.**

Connecting food lovers with talented home chefs. Discover dishes like Tajine, Couscous, and Rfissa, cooked with love and delivered to your door.

![Tyeb Liya Banner](https://via.placeholder.com/1200x400/F5E3CC/D35400?text=Tyeb+Liya+App)

---

## 📱 Project Overview

**Tyeb Liya** is a mobile application built with **React Native (Expo)** and **TypeScript**. It facilitates a marketplace where:
- **Clients** discover and order homemade food.
- **Chefs** manage their menus, orders, and earnings.

### Key Features
- **Strict Role-Based Access (RBAC)**: Secure separation between Client and Chef interfaces.
- **Marketplace Feed**: Discovery with search, filters (City/Type), and categories.
- **Order Management**: End-to-end order tracking (Pending -> Cooking -> Ready).
- **Messaging**: Integrated chat system for direct Client-Chef communication.
- **Secure**: Hardened authentication flows and secure storage.

---

## 🚀 Getting Started

This repository contains the source code for the mobile application.

### Prerequisites
- Node.js (LTS)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/StartUp-2025/TyebLiya.git
    cd TyebLiya
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (copied from `.env.example`):
    ```bash
    cp .env.example .env
    ```
    *You must populate `.env` with your own Supabase credentials.*

4.  **Run the App**
    ```bash
    npx expo start
    ```
    - Scan the QR code with **Expo Go** on your Android/iOS device.
    - Or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 📂 Project Structure

- **`/screens`**: All application screens, separated by role (`Client*`, `Chef*`).
- **`/components`**: Reusable UI elements (`DishCard`, `Button`, `ThemedText`).
- **`/lib`**: Services for API, Auth, and Security.
- **`/navigation`**: Stack and Tab navigator configurations.
- **`/context`**: Global state management (`AuthContext`, `CartContext`).

---

## 🔒 Security

This project has passed a security audit:
- Secrets are environment-gated.
- Logs are sanitized.
- Access control is strictly enforced at the navigation level.

---

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **Language**: TypeScript
- **Backend**: Supabase (Auth & Database)
- **Styling**: StyleSheet (Custom Design System)

---

*Note: This project is currently in MVP phase.*
