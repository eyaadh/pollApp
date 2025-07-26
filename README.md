# Real-time Polling Application

A modern, serverless, real-time polling application built with Vue.js 3 and Firebase. This project allows users to instantly create, manage, and share live polls, with results that update in real-time for all participants.

[➡️ **Live Demo: pollapp.eyaadh.net**](https://pollapp.eyaadh.net/)

---

## ✨ Core Features

This application is packed with features to provide a complete and flexible polling experience:

* **Real-time Results**: Vote counts and rankings update instantly for all viewers without needing to refresh the page, powered by Firestore's real-time listeners.

* **Full Poll Management**:

  * **Create Polls**: Easily create a new poll with a custom name.

  * **Add/Edit/Delete Options**: Full control over poll options while in the 'configuring' state.

  * **Drag & Drop Re-ordering**: Intuitively re-arrange options using a smooth drag-and-drop interface.

* **Flexible Visibility & Listing**:

  * **Open vs. Private Polls**: Choose whether results are visible to everyone ('Open') or only to the host until the poll is closed ('Private').

  * **Listed vs. Unlisted Polls**: Decide if your poll should appear on the public homepage ('Listed') or be accessible only via a direct link ('Unlisted').

* **Complete Poll Lifecycle**:

  * **Configuring**: The initial state where the host sets up the poll.

  * **Voting**: The poll is live and accepting votes. Options are locked.

  * **Closed**: The poll is permanently closed and no longer accepts votes. The manage page provides options to view final results or delete the poll.

* **Secure Host Controls**:

  * **Closing Code**: Each poll is generated with a unique, secret code. This code is required to view private results, close the poll, and permanently delete it.

  * **Permanent Deletion**: Hosts can securely delete their polls and all associated data after they are closed.

* **Voter Experience**:

  * **Simple Interface**: A clean, mobile-friendly view for casting votes.

  * **One Vote Per Device**: Uses `localStorage` to prevent a single device from voting multiple times on the same poll.

  * **QR Code Sharing**: A QR code is generated for easy sharing and voting access, perfect for live presentations.

---

## 🛠️ Tech Stack

This project is built with a modern, component-based architecture.

* **Frontend**:

  * **Framework**: [Vue 3](https://vuejs.org/) (with `<script setup>` and Composition API)

  * **Build Tool**: [Vite](https://vitejs.dev/)

  * **Language**: [TypeScript](https://www.typescriptlang.org/)

  * **Styling**: [Tailwind CSS](https://tailwindcss.com/)

  * **State Management**: [Pinia](https://pinia.vuejs.org/)

  * **Routing**: [Vue Router](https://router.vuejs.org/)

  * **UI Components**: [Headless UI](https://headlessui.com/) (for the dialog and switch)

  * **Composables**: [VueUse](https://vueuse.org/) (for `useSortable` and `useClipboard`)

* **Backend & Database**:

  * **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)

  * **Real-time Sync**: [VueFire](https://vuefire.vuejs.org/)

---

## 🚀 Project Setup

To run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone [https://github.com/eyaadh/pollApp.git](https://github.com/eyaadh/pollApp.git)
cd pollApp
````

### 2\. Install Dependencies

This project uses `npm`. Run the following command to install all the necessary packages.

```bash
npm install
```

### 3\. Set Up Firebase

  * Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

  * In your new project, go to **Build \> Firestore Database** and create a new database. Start in **test mode** for local development.

  * Go to **Project Overview** and add a new **Web App** (`</>`).

  * Copy the `firebaseConfig` object provided.

### 4\. Configure Environment Variables

  * In the root of the Vue project, create a new file named `.env.local`.

  * Add the Firebase configuration keys you copied, prefixed with `VITE_`.

**File: `.env.local`**

```
VITE_FIREBASE_API_KEY="AIza..."
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

  * Update the `src/firebase.ts` file to use these environment variables.

### 5\. Run the Development Server

Once your environment variables are set, you can start the local development server.

```bash
npm run dev
```

-----

## 📜 Available Scripts

  * `npm run dev`: Starts the Vite development server.

  * `npm run build`: Compiles the Vue application for production.

  * `npm run preview`: Serves the production build locally for testing.